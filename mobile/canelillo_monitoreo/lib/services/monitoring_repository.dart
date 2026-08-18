import 'dart:async';

import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:uuid/uuid.dart';

import '../core/app_config.dart';
import '../models/models.dart';
import 'local_database.dart';

class MonitoringRepository {
  MonitoringRepository(this.client);

  final SupabaseClient client;
  final _local = LocalDatabase.instance;
  final _uuid = const Uuid();

  Future<DashboardData> loadDashboard({bool force = false}) async {
    if (!force) {
      final cached = await _loadCached();
      if (cached.fields.isNotEmpty && cached.trees.isNotEmpty) {
        unawaited(refreshAndCache());
        return cached;
      }
    }
    try {
      return await refreshAndCache();
    } catch (_) {
      return _loadCached();
    }
  }

  Future<DashboardData> refreshAndCache() async {
    await syncPending();
    final results = await Future.wait([
      _fetchFields(),
      _fetchTrees(),
      _fetchPests(),
      _fetchMonitorings(),
    ]).timeout(AppConfig.networkTimeout);
    final fields = results[0] as List<FieldBlock>;
    final trees = results[1] as List<TreeRecord>;
    final pests = results[2] as List<PestCatalog>;
    final monitorings = results[3] as List<MonitoringRecord>;
    await Future.wait([
      _local.writeCache('fields', fields.map((row) => row.toJson()).toList()),
      _local.writeCache('trees', trees.map((row) => row.toJson()).toList()),
      _local.writeCache('pests', pests.map((row) => row.toJson()).toList()),
      _local.writeCache(
        'monitorings',
        monitorings.map((row) => row.toJson()).toList(),
      ),
    ]);
    return DashboardData(
      fields: fields,
      trees: trees,
      pests: pests,
      monitorings: monitorings,
      fromCache: false,
    );
  }

  Future<DashboardData> _loadCached() async {
    final results = await Future.wait([
      _local.readCache('fields'),
      _local.readCache('trees'),
      _local.readCache('pests'),
      _local.readCache('monitorings'),
    ]);
    final pests = results[2].map(PestCatalog.fromJson).toList();
    return DashboardData(
      fields: results[0].map(FieldBlock.fromJson).toList(),
      trees: results[1].map(TreeRecord.fromJson).toList(),
      pests: pests.isEmpty ? _fallbackPests : pests,
      monitorings: results[3].map(MonitoringRecord.fromJson).toList(),
      fromCache: true,
    );
  }

  Future<List<FieldBlock>> _fetchFields() async {
    final rows = await client
        .from('campos')
        .select('id,potrero,bloque,especie,variedad,hectareas')
        .eq('activo', true)
        .order('potrero')
        .order('bloque');
    return rows.map<FieldBlock>((row) => FieldBlock.fromJson(row)).toList();
  }

  Future<List<TreeRecord>> _fetchTrees() async {
    final rows = await client
        .from('monitoreo_arboles')
        .select(
          'id,id_operacion_cliente,campo_id,fecha_referencia,numero_arbol,'
          'hilera,sector_monitoreo,longitud,latitud,activo',
        )
        .eq('activo', true)
        .order('numero_arbol')
        .limit(2500);
    return rows.map<TreeRecord>((row) => TreeRecord.fromJson(row)).toList();
  }

  Future<List<PestCatalog>> _fetchPests() async {
    try {
      final rows = await client
          .from('monitoreo_plagas_catalogo')
          .select()
          .eq('activo', true)
          .order('tipo_plaga');
      final result = rows
          .map<PestCatalog>((row) => PestCatalog.fromJson(row))
          .toList();
      return result.isEmpty ? _fallbackPests : result;
    } catch (_) {
      return _fallbackPests;
    }
  }

  Future<List<MonitoringRecord>> _fetchMonitorings() async {
    final rows = await client
        .from('monitoreo_plagas')
        .select(
          'id,id_operacion_cliente,correlativo,arbol_id,campo_id,numero_arbol,'
          'tipo_plaga,fecha,latitud,longitud,encontrada,encontrado_en,'
          'huevos,ninfas_1,ninfas_2,ninfas_3,adultos,larvas,pupas',
        )
        .order('fecha', ascending: false)
        .limit(5000);
    return rows
        .map<MonitoringRecord>((row) => MonitoringRecord.fromJson(row))
        .toList();
  }

  Future<TreeRecord> saveTree(TreeRecord tree) async {
    final clientId = tree.clientOperationId.isEmpty
        ? _uuid.v4()
        : tree.clientOperationId;
    final localTree = tree.copyWith(
      id: tree.id.isEmpty ? clientId : tree.id,
      clientOperationId: clientId,
      pending: false,
    );
    final payload = _treePayload(localTree);
    try {
      final row = await _sendTree(
        payload,
        tree.id,
      ).timeout(AppConfig.writeTimeout);
      final saved = TreeRecord.fromJson(row);
      await _mergeTreeCache(saved);
      return saved;
    } catch (_) {
      final pending = localTree.copyWith(pending: true);
      await _local.enqueue(id: clientId, type: 'tree_upsert', payload: payload);
      await _mergeTreeCache(pending);
      return pending;
    }
  }

  Future<MonitoringRecord> saveMonitoring(MonitoringRecord record) async {
    final clientId = record.clientOperationId.isEmpty
        ? _uuid.v4()
        : record.clientOperationId;
    final localRecord = MonitoringRecord(
      id: record.id.isEmpty ? clientId : record.id,
      clientOperationId: clientId,
      correlative: record.correlative,
      treeId: record.treeId,
      fieldId: record.fieldId,
      treeNumber: record.treeNumber,
      pest: record.pest,
      date: record.date,
      position: record.position,
      found: record.found,
      stages: record.stages,
      foundAt: record.foundAt,
      pending: false,
    );
    final payload = localRecord.toJson()
      ..remove('id')
      ..remove('correlativo')
      ..remove('pending');
    try {
      final row = await _sendMonitoring(
        payload,
      ).timeout(AppConfig.writeTimeout);
      final saved = MonitoringRecord.fromJson(row);
      await _mergeMonitoringCache(saved);
      return saved;
    } catch (_) {
      final pending = MonitoringRecord.fromJson({
        ...localRecord.toJson(),
        'pending': true,
      });
      await _local.enqueue(
        id: clientId,
        type: 'monitoring_upsert',
        payload: payload,
      );
      await _mergeMonitoringCache(pending);
      return pending;
    }
  }

  Map<String, dynamic> _treePayload(TreeRecord tree) => {
    'id_operacion_cliente': tree.clientOperationId,
    'campo_id': tree.fieldId,
    'fecha_referencia': (tree.referenceDate ?? DateTime.now())
        .toIso8601String()
        .split('T')
        .first,
    'numero_arbol': tree.number,
    'hilera': tree.row.isEmpty ? null : tree.row,
    'sector_monitoreo': tree.monitoringSector.isEmpty
        ? null
        : tree.monitoringSector,
    'longitud': tree.position.longitude,
    'latitud': tree.position.latitude,
    'ubicacion_fuente': 'manual',
    'activo': tree.active,
  };

  Future<Map<String, dynamic>> _sendTree(
    Map<String, dynamic> payload,
    String currentId,
  ) async {
    if (currentId.isNotEmpty && currentId != payload['id_operacion_cliente']) {
      return await client
          .from('monitoreo_arboles')
          .update(payload)
          .eq('id', currentId)
          .select()
          .single();
    }
    return await client
        .from('monitoreo_arboles')
        .upsert(payload, onConflict: 'id_operacion_cliente')
        .select()
        .single();
  }

  Future<Map<String, dynamic>> _sendMonitoring(
    Map<String, dynamic> payload,
  ) async {
    final treeId = payload['arbol_id']?.toString() ?? '';
    if (treeId.isNotEmpty) {
      final tree = await client
          .from('monitoreo_arboles')
          .select('id')
          .or('id.eq.$treeId,id_operacion_cliente.eq.$treeId')
          .limit(1)
          .maybeSingle();
      if (tree == null) {
        throw StateError('El arbol del monitoreo aun no esta sincronizado.');
      }
      payload['arbol_id'] = tree['id'];
    }
    return await client
        .from('monitoreo_plagas')
        .upsert(payload, onConflict: 'id_operacion_cliente')
        .select()
        .single();
  }

  Future<void> syncPending() async {
    final operations = await _local.pending();
    operations.sort((a, b) {
      if (a.type == b.type) return 0;
      return a.type == 'tree_upsert' ? -1 : 1;
    });
    for (final operation in operations) {
      try {
        if (operation.type == 'tree_upsert') {
          final row = await _sendTree(operation.payload, '');
          await _mergeTreeCache(TreeRecord.fromJson(row));
        } else if (operation.type == 'monitoring_upsert') {
          final row = await _sendMonitoring({...operation.payload});
          await _mergeMonitoringCache(MonitoringRecord.fromJson(row));
        }
        await _local.markSynced(operation.id);
      } catch (error) {
        await _local.markFailed(operation.id, error);
      }
    }
  }

  Future<int> pendingCount() => _local.pendingCount();

  Future<void> _mergeTreeCache(TreeRecord record) async {
    final rows = await _local.readCache('trees');
    final records = rows.map(TreeRecord.fromJson).toList();
    records.removeWhere(
      (item) =>
          item.id == record.id ||
          (record.clientOperationId.isNotEmpty &&
              item.clientOperationId == record.clientOperationId),
    );
    records.add(record);
    await _local.writeCache(
      'trees',
      records.map((item) => item.toJson()).toList(),
    );
  }

  Future<void> _mergeMonitoringCache(MonitoringRecord record) async {
    final rows = await _local.readCache('monitorings');
    final records = rows.map(MonitoringRecord.fromJson).toList();
    records.removeWhere(
      (item) =>
          item.id == record.id ||
          (record.clientOperationId.isNotEmpty &&
              item.clientOperationId == record.clientOperationId),
    );
    records.add(record);
    await _local.writeCache(
      'monitorings',
      records.map((item) => item.toJson()).toList(),
    );
  }

  static const _fallbackPests = [
    PestCatalog(
      name: 'Arañita roja',
      stages: ['huevos', 'ninfas_1', 'adultos'],
      maximum: 10,
    ),
    PestCatalog(
      name: 'Chanchito blanco',
      stages: ['huevos', 'ninfas_1', 'adultos'],
      maximum: 10,
    ),
    PestCatalog(
      name: 'Conchuela blanca',
      stages: ['ninfas_2', 'adultos'],
      maximum: 10,
    ),
    PestCatalog(name: 'Escama', stages: ['adultos'], maximum: 10),
    PestCatalog(
      name: 'Mosquita blanca',
      stages: ['huevos', 'adultos', 'larvas', 'pupas'],
      maximum: 10,
    ),
    PestCatalog(name: 'Pulgón', stages: ['ninfas_1', 'adultos'], maximum: 10),
    PestCatalog(
      name: 'Trips',
      stages: ['huevos', 'adultos', 'larvas', 'pupas'],
      maximum: 10,
    ),
  ];
}
