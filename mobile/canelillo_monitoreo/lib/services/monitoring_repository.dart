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
  Future<void>? _activeSimpleSync;

  static const _simpleOperationTypes = {'tree_upsert', 'monitoring_upsert'};
  static const _monitoringSelect =
      'id,id_operacion_cliente,correlativo,arbol_id,campo_id,numero_arbol,'
      'tipo_plaga,fecha,latitud,longitud,encontrada,encontrado_en,'
      'huevos,ninfas_1,ninfas_2,ninfas_3,adultos,larvas,pupas,'
      'precision_metros,ubicacion_fuente';

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
      _local.writeCache(
        'fields_v2',
        fields.map((row) => row.toJson()).toList(),
      ),
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
      _local.readCache('fields_v2'),
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
        .select('id,potrero,bloque,especie,variedad,hectareas,plantas')
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
          'hilera,sector_monitoreo,longitud,latitud,activo,'
          'precision_metros,ubicacion_fuente',
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
        .select(_monitoringSelect)
        .order('fecha', ascending: false)
        .limit(5000);
    return rows
        .map<MonitoringRecord>((row) => MonitoringRecord.fromJson(row))
        .toList();
  }

  Future<List<MonitoringRecord>> loadMonitoringsRange(
    DateTime from,
    DateTime to,
  ) async {
    final start = DateTime(from.year, from.month, from.day);
    final end = DateTime(to.year, to.month, to.day);
    const pageSize = 1000;
    final remote = <MonitoringRecord>[];
    try {
      for (var offset = 0; ; offset += pageSize) {
        final rows = await client
            .from('monitoreo_plagas')
            .select(_monitoringSelect)
            .gte('fecha', start.toIso8601String().split('T').first)
            .lte('fecha', end.toIso8601String().split('T').first)
            .order('fecha', ascending: false)
            .range(offset, offset + pageSize - 1)
            .timeout(AppConfig.networkTimeout);
        remote.addAll(rows.map<MonitoringRecord>(MonitoringRecord.fromJson));
        if (rows.length < pageSize) break;
      }
    } catch (_) {
      final cached = await _local.readCache('monitorings');
      return cached
          .map(MonitoringRecord.fromJson)
          .where((record) => _insideRange(record.date, start, end))
          .toList();
    }
    final cachedPending = (await _local.readCache('monitorings'))
        .map(MonitoringRecord.fromJson)
        .where(
          (record) => record.pending && _insideRange(record.date, start, end),
        );
    for (final pending in cachedPending) {
      remote.removeWhere(
        (record) =>
            record.id == pending.id ||
            (pending.clientOperationId.isNotEmpty &&
                record.clientOperationId == pending.clientOperationId),
      );
      remote.add(pending);
    }
    return remote;
  }

  bool _insideRange(DateTime value, DateTime from, DateTime to) {
    final day = DateTime(value.year, value.month, value.day);
    return !day.isBefore(from) && !day.isAfter(to);
  }

  Future<TreeRecord> saveTree(TreeRecord tree) async {
    final clientId = tree.clientOperationId.isEmpty
        ? _uuid.v4()
        : tree.clientOperationId;
    final localTree = tree.copyWith(
      id: tree.id.isEmpty ? clientId : tree.id,
      clientOperationId: clientId,
      pending: true,
    );
    final payload = _treePayload(localTree);
    final queuedPayload = {
      ...payload,
      if (tree.id.isNotEmpty) '_current_id': tree.id,
    };
    await _local.enqueue(
      id: clientId,
      type: 'tree_upsert',
      payload: queuedPayload,
    );
    await _mergeTreeCache(localTree);
    unawaited(syncPending());
    return localTree;
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
      locationSource: record.locationSource,
      accuracyMeters: record.accuracyMeters,
      pending: true,
    );
    final payload = localRecord.toJson()
      ..remove('id')
      ..remove('correlativo')
      ..remove('pending');
    await _local.enqueue(
      id: clientId,
      type: 'monitoring_upsert',
      payload: payload,
    );
    await _mergeMonitoringCache(localRecord);
    unawaited(syncPending());
    return localRecord;
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
    'ubicacion_fuente': tree.locationSource,
    'precision_metros': tree.accuracyMeters,
    'activo': tree.active,
  };

  Future<Map<String, dynamic>> _sendTree(
    Map<String, dynamic> payload,
    String currentId,
  ) async {
    final request = {...payload};
    final queuedCurrentId = request.remove('_current_id')?.toString() ?? '';
    final targetId = currentId.isNotEmpty ? currentId : queuedCurrentId;
    if (targetId.isNotEmpty && targetId != request['id_operacion_cliente']) {
      return await client
          .from('monitoreo_arboles')
          .update(request)
          .eq('id', targetId)
          .select()
          .single();
    }
    return await client
        .from('monitoreo_arboles')
        .upsert(request, onConflict: 'id_operacion_cliente')
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

  Future<void> syncPending() {
    final active = _activeSimpleSync;
    if (active != null) return active;
    final sync = _syncSimplePending();
    _activeSimpleSync = sync;
    return sync.whenComplete(() => _activeSimpleSync = null);
  }

  Future<void> _syncSimplePending() async {
    while (true) {
      final operations = await _local.pending(types: _simpleOperationTypes);
      if (operations.isEmpty) return;
      operations.sort((a, b) {
        if (a.type == b.type) return 0;
        return a.type == 'tree_upsert' ? -1 : 1;
      });
      for (final operation in operations) {
        try {
          await _local.markSyncing(operation.id);
          if (operation.type == 'tree_upsert') {
            final row = await _sendTree(operation.payload, '');
            await _mergeTreeCache(TreeRecord.fromJson(row));
          } else if (operation.type == 'monitoring_upsert') {
            final row = await _sendMonitoring({...operation.payload});
            await _mergeMonitoringCache(MonitoringRecord.fromJson(row));
          } else {
            continue;
          }
          await _local.markSynced(operation.id);
        } catch (error) {
          await _local.markFailed(operation.id, error);
        }
      }
    }
  }

  Future<int> pendingCount() =>
      _local.pendingCount(types: _simpleOperationTypes);

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
