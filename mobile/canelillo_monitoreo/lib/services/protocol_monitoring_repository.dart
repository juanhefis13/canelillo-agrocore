import 'dart:async';
import 'dart:io';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../core/app_config.dart';
import '../models/models.dart';
import 'local_database.dart';

class ProtocolSyncReport {
  const ProtocolSyncReport({
    required this.synced,
    required this.failed,
    required this.remaining,
    this.offline = false,
  });

  final int synced;
  final int failed;
  final int remaining;
  final bool offline;
}

class ProtocolSyncPlanner {
  const ProtocolSyncPlanner._();

  static const operationTypes = {
    'protocol_visit_upsert',
    'protocol_pest_upsert',
    'protocol_structure_upsert',
    'protocol_units_batch_upsert',
    'protocol_states_batch_upsert',
    'protocol_damages_batch_upsert',
    'protocol_enemies_batch_upsert',
    'protocol_attributes_batch_upsert',
    'protocol_photo_sync',
    'protocol_pest_finalize',
    'protocol_visit_finalize',
  };

  static String operationPrefix(String visitId) => 'protocol:$visitId:';

  static List<PendingOperationInput> build(VisitDraft draft) {
    _validate(draft);
    final trees = _treesFor(draft);
    final prefix = operationPrefix(draft.id);
    final operations = <PendingOperationInput>[];
    var sequence = 0;
    String? previous;

    void add(String type, Map<String, dynamic> payload, {int priority = 100}) {
      final id = '$prefix${sequence.toString().padLeft(4, '0')}:$type';
      operations.add(
        PendingOperationInput(
          id: id,
          type: type,
          payload: payload,
          dependsOn: previous,
          priority: priority,
        ),
      );
      previous = id;
      sequence += 1;
    }

    add('protocol_visit_upsert', {
      'table': 'visitas_monitoreo',
      'on_conflict': 'id',
      'row': {
        'id': draft.id,
        'campo_id': draft.fieldId,
        'fecha_hora_inicio': draft.startedAt.toIso8601String(),
        'fecha_hora_fin': null,
        'fenologia': _nullIfEmpty(draft.phenology),
        'estado': 'en_progreso',
        'arboles_programados': trees.length,
        'id_operacion_cliente': draft.clientOperationId,
        'dispositivo_id': draft.deviceId,
        'creado_por': draft.createdBy,
        'observaciones': _nullIfEmpty(draft.observations),
      },
    }, priority: 10);

    for (final tree in trees) {
      for (final monitoring in tree.pestObservations) {
        add('protocol_pest_upsert', {
          'table': 'monitoreo_plagas',
          'on_conflict': 'id',
          'resolve_tree': true,
          'row': {
            'id': monitoring.id,
            'id_operacion_cliente': monitoring.clientOperationId,
            'visita_id': draft.id,
            'campo_id': draft.fieldId,
            'arbol_id': tree.treeId,
            'numero_arbol': tree.treeNumber,
            'fecha': _dateOnly(draft.startedAt),
            'tipo_plaga': monitoring.pestName,
            'plaga_id': monitoring.pestId,
            'protocolo_id': monitoring.protocolId,
            'protocolo_version': monitoring.protocolVersion,
            'fenologia': _nullIfEmpty(draft.phenology),
            'estado_registro': 'en_progreso',
            'encontrada': monitoring.found,
            'latitud': tree.latitude,
            'longitud': tree.longitude,
            'observaciones': monitoring.notes,
            'creado_por': draft.createdBy,
          },
        }, priority: 20);

        for (final structure in monitoring.structures) {
          add('protocol_structure_upsert', {
            'table': 'monitoreo_estructuras',
            'on_conflict': 'id',
            'row': {
              'id': structure.id,
              'monitoreo_plaga_id': monitoring.id,
              'estructura_id': structure.structureId,
              'cantidad_programada': structure.plannedQuantity,
              'no_evaluable': structure.notEvaluable,
              'motivo_no_evaluable': structure.notEvaluableReason,
              'estructura_nombre_snapshot': structure.structureNameSnapshot,
              'instrucciones_snapshot': structure.instructionsSnapshot,
            },
          }, priority: 30);

          if (structure.units.isNotEmpty) {
            add('protocol_units_batch_upsert', {
              'table': 'monitoreo_unidades',
              'on_conflict': 'id',
              'rows': [
                for (final unit in structure.units)
                  {
                    'id': unit.id,
                    'monitoreo_estructura_id': structure.id,
                    'numero_unidad': unit.number,
                    'positivo': unit.hasPestPresence,
                    'abundancia_categoria': unit.abundanceCategory,
                    'severidad': unit.severity,
                    'observaciones': unit.notes,
                    'id_operacion_cliente': unit.clientOperationId,
                  },
              ],
            }, priority: 40);
          }

          final stateRows = <Map<String, dynamic>>[];
          final damageRows = <Map<String, dynamic>>[];
          final enemyRows = <Map<String, dynamic>>[];
          final attributeRows = <Map<String, dynamic>>[];
          for (final unit in structure.units) {
            for (final state in unit.stateCounts) {
              if (state.quantity <= 0) continue;
              stateRows.add({
                'unidad_id': unit.id,
                'estado_biologico_id': state.stateId,
                'cantidad': state.quantity,
              });
            }
            for (final damage in unit.damages) {
              damageRows.add({
                'unidad_id': unit.id,
                'tipo_dano_id': damage.damageTypeId,
                'severidad': damage.severity,
              });
            }
            for (final enemy in unit.naturalEnemies) {
              enemyRows.add({
                'unidad_id': unit.id,
                'enemigo_natural_id': enemy.enemyId,
                'presente': enemy.present,
                'cantidad': enemy.quantity,
              });
            }
            attributeRows.addAll(
              _attributeRows(
                unit.attributes,
                monitoring.id,
                structureId: structure.id,
                unitId: unit.id,
              ),
            );
          }
          attributeRows.addAll(
            _attributeRows(
              structure.attributes,
              monitoring.id,
              structureId: structure.id,
            ),
          );

          if (stateRows.isNotEmpty) {
            add('protocol_states_batch_upsert', {
              'table': 'monitoreo_unidad_estados',
              'on_conflict': 'unidad_id,estado_biologico_id',
              'rows': stateRows,
            }, priority: 50);
          }
          if (damageRows.isNotEmpty) {
            add('protocol_damages_batch_upsert', {
              'table': 'monitoreo_unidad_danos',
              'on_conflict': 'unidad_id,tipo_dano_id',
              'rows': damageRows,
            }, priority: 51);
          }
          if (enemyRows.isNotEmpty) {
            add('protocol_enemies_batch_upsert', {
              'table': 'monitoreo_unidad_enemigos',
              'on_conflict': 'unidad_id,enemigo_natural_id',
              'rows': enemyRows,
            }, priority: 52);
          }
          if (attributeRows.isNotEmpty) {
            add('protocol_attributes_batch_upsert', {
              'table': 'monitoreo_atributos',
              'on_conflict': 'id',
              'rows': attributeRows,
            }, priority: 53);
          }

          for (final unit in structure.units) {
            for (final photo in unit.photos) {
              final ownerFolder = draft.createdBy ?? 'device';
              final extension = photo.mimeType == 'image/png'
                  ? 'png'
                  : photo.mimeType == 'image/heic'
                  ? 'heic'
                  : 'jpg';
              add('protocol_photo_sync', {
                'table': 'monitoreo_fotografias',
                'bucket': 'monitoreo-fotografias',
                'local_path': photo.localPath,
                'storage_path':
                    '$ownerFolder/${draft.id}/${photo.id}.$extension',
                'row': {
                  'id': photo.id,
                  'visita_id': draft.id,
                  'monitoreo_plaga_id': monitoring.id,
                  'monitoreo_estructura_id': structure.id,
                  'unidad_id': unit.id,
                  'ruta_storage':
                      '$ownerFolder/${draft.id}/${photo.id}.$extension',
                  'ruta_local': null,
                  'mime_type': photo.mimeType,
                  'tamano_bytes': photo.sizeBytes,
                  'estado_sincronizacion': 'sincronizado',
                  'id_operacion_cliente': photo.clientOperationId,
                  'creado_por': draft.createdBy,
                  'creado_en': photo.createdAt.toIso8601String(),
                },
              }, priority: 60);
            }
          }
        }

        final monitoringAttributes = _attributeRows(
          monitoring.attributes,
          monitoring.id,
        );
        if (monitoringAttributes.isNotEmpty) {
          add('protocol_attributes_batch_upsert', {
            'table': 'monitoreo_atributos',
            'on_conflict': 'id',
            'rows': monitoringAttributes,
          }, priority: 54);
        }

        add('protocol_pest_finalize', {
          'table': 'monitoreo_plagas',
          'match_id': monitoring.id,
          'values': {
            'estado_registro':
                monitoring.pestName.toLowerCase().contains('no identificad')
                ? 'pendiente_identificacion'
                : 'completado',
            'finalizado_en': DateTime.now().toIso8601String(),
          },
        }, priority: 80);
      }
    }

    add('protocol_visit_finalize', {
      'table': 'visitas_monitoreo',
      'match_id': draft.id,
      'draft_id': draft.id,
      'values': {
        'estado': 'completado',
        'fecha_hora_fin': (draft.finishedAt ?? DateTime.now())
            .toIso8601String(),
      },
    }, priority: 90);
    return operations;
  }

  static List<Map<String, dynamic>> _attributeRows(
    List<AttributeObservation> attributes,
    String monitoringId, {
    String? structureId,
    String? unitId,
  }) => [
    for (final attribute in attributes)
      {
        'id': attribute.id,
        'monitoreo_plaga_id': monitoringId,
        'monitoreo_estructura_id': structureId,
        'unidad_id': unitId,
        'atributo_id': attribute.attributeId,
        'valor': attribute.value,
      },
  ];

  static void _validate(VisitDraft draft) {
    if (draft.id.isEmpty || draft.clientOperationId.isEmpty) {
      throw ArgumentError(
        'La visita requiere identificadores locales estables.',
      );
    }
    if (draft.fieldId.isEmpty) {
      throw ArgumentError('Selecciona un bloque antes de guardar.');
    }
    final trees = _treesFor(draft);
    if (trees.isEmpty || trees.any((tree) => tree.treeId.isEmpty)) {
      throw ArgumentError('La visita debe contener al menos un arbol valido.');
    }
    for (final tree in trees) {
      if (tree.pestObservations.isEmpty) {
        throw ArgumentError(
          'El arbol ${tree.treeNumber} no contiene monitoreos.',
        );
      }
      for (final monitoring in tree.pestObservations) {
        if (monitoring.id.isEmpty ||
            monitoring.clientOperationId.isEmpty ||
            monitoring.protocolId.isEmpty ||
            monitoring.pestId.isEmpty) {
          throw ArgumentError('El monitoreo no tiene un protocolo valido.');
        }
        if (monitoring.structures.isEmpty) {
          throw ArgumentError(
            'El protocolo no contiene estructuras a revisar.',
          );
        }
        for (final structure in monitoring.structures) {
          if (structure.notEvaluable) {
            if ((structure.notEvaluableReason ?? '').trim().isEmpty) {
              throw ArgumentError(
                'Indica por que ${structure.structureNameSnapshot} no es evaluable.',
              );
            }
            continue;
          }
          if (structure.units.length != structure.plannedQuantity) {
            throw ArgumentError(
              '${structure.structureNameSnapshot}: se requieren '
              '${structure.plannedQuantity} unidades y hay ${structure.units.length}.',
            );
          }
          if (structure.units.any(
            (unit) => unit.id.isEmpty || unit.number <= 0,
          )) {
            throw ArgumentError(
              'Todas las unidades requieren ID y numero valido.',
            );
          }
        }
      }
    }
  }

  static List<TreeMonitoringDraft> _treesFor(VisitDraft draft) {
    if (draft.treeMonitorings.isNotEmpty) return draft.treeMonitorings;
    if (draft.treeId.isEmpty) return const [];
    return [
      TreeMonitoringDraft(
        treeId: draft.treeId,
        treeNumber: draft.treeNumber,
        latitude: draft.latitude,
        longitude: draft.longitude,
        pestObservations: draft.pestObservations,
        completedAt: draft.finishedAt,
      ),
    ];
  }

  static String _dateOnly(DateTime value) =>
      value.toIso8601String().split('T').first;

  static String? _nullIfEmpty(String value) =>
      value.trim().isEmpty ? null : value.trim();
}

class ProtocolMonitoringRepository {
  ProtocolMonitoringRepository(
    this.client, {
    LocalDatabase? localDatabase,
    Connectivity? connectivity,
  }) : _local = localDatabase ?? LocalDatabase.instance,
       _connectivity = connectivity ?? Connectivity();

  static const _catalogCacheKey = 'protocol_catalog_v1';

  final SupabaseClient client;
  final LocalDatabase _local;
  final Connectivity _connectivity;

  Future<ProtocolCatalogBundle> loadCatalog({bool force = false}) async {
    if (!force) {
      final cached = await _loadCachedCatalog();
      if (!cached.isEmpty) {
        unawaited(_refreshCatalogIgnoringErrors());
        return cached;
      }
    }
    try {
      return await refreshCatalog();
    } catch (_) {
      return _loadCachedCatalog();
    }
  }

  Future<void> _refreshCatalogIgnoringErrors() async {
    try {
      await refreshCatalog();
    } catch (_) {
      // El catalogo local sigue disponible cuando la red es inestable.
    }
  }

  Future<ProtocolCatalogBundle> refreshCatalog() async {
    final results = await Future.wait([
      _activeRows('plagas', orderBy: 'nombre_comun'),
      _activeRows('estructuras_vegetales', orderBy: 'nombre'),
      _activeRows('estados_biologicos', orderBy: 'nombre'),
      _activeRows('tipos_dano', orderBy: 'nombre'),
      _activeRows('enemigos_naturales', orderBy: 'nombre'),
      _activeRows('atributos_monitoreo', orderBy: 'nombre'),
      _activeRows('protocolos_monitoreo', orderBy: 'nombre'),
      _activeRows('protocolo_estructuras', orderBy: 'orden'),
      _activeRows('protocolo_atributos', orderBy: 'orden'),
      _activeRows('plaga_estados_biologicos', orderBy: 'orden'),
      _activeRows('fenologias', orderBy: 'orden'),
    ]).timeout(AppConfig.networkTimeout);
    final bundle = ProtocolCatalogBundle(
      pests: results[0].map(ProtocolPest.fromJson).toList(),
      structures: results[1].map(CatalogItem.fromJson).toList(),
      biologicalStates: results[2].map(CatalogItem.fromJson).toList(),
      damageTypes: results[3].map(CatalogItem.fromJson).toList(),
      naturalEnemies: results[4].map(CatalogItem.fromJson).toList(),
      attributes: results[5]
          .map(MonitoringAttributeDefinition.fromJson)
          .toList(),
      protocols: results[6].map(MonitoringProtocol.fromJson).toList(),
      structureRules: results[7].map(ProtocolStructureRule.fromJson).toList(),
      attributeRules: results[8].map(ProtocolAttributeRule.fromJson).toList(),
      pestStates: results[9].map(PestBiologicalState.fromJson).toList(),
      phenologies: results[10].map(CatalogItem.fromJson).toList(),
      fromCache: false,
    );
    await _local.writeCache(_catalogCacheKey, [bundle.toJson()]);
    return bundle;
  }

  Future<List<Map<String, dynamic>>> _activeRows(
    String table, {
    required String orderBy,
  }) async {
    final rows = await client
        .from(table)
        .select()
        .eq('activo', true)
        .order(orderBy);
    return rows.map((row) => Map<String, dynamic>.from(row)).toList();
  }

  Future<ProtocolCatalogBundle> _loadCachedCatalog() async {
    final rows = await _local.readCache(_catalogCacheKey);
    if (rows.isEmpty) {
      return const ProtocolCatalogBundle(
        pests: [],
        structures: [],
        biologicalStates: [],
        damageTypes: [],
        naturalEnemies: [],
        attributes: [],
        protocols: [],
        structureRules: [],
        attributeRules: [],
        pestStates: [],
        phenologies: [],
        fromCache: true,
      );
    }
    return ProtocolCatalogBundle.fromJson(rows.first, fromCache: true);
  }

  Future<void> saveDraft(VisitDraft draft) => _local.saveVisitDraft(
    id: draft.id,
    fieldId: draft.fieldId,
    status: draft.status.wireName,
    payload: draft.toJson(),
  );

  Future<List<VisitDraft>> listDrafts() async =>
      (await _local.listVisitDrafts()).map(VisitDraft.fromJson).toList();

  Future<VisitDraft?> readDraft(String id) async {
    final row = await _local.readVisitDraft(id);
    return row == null ? null : VisitDraft.fromJson(row);
  }

  Future<List<MonitorOption>> listMonitors() async {
    final rows = await client
        .from('usuarios')
        .select('id,nombre_completo,email')
        .order('nombre_completo');
    return rows
        .map((row) => MonitorOption.fromJson(Map<String, dynamic>.from(row)))
        .where((item) => item.id.isNotEmpty)
        .toList();
  }

  Future<List<MonitoringVisitSummary>> loadHistoryPage(
    MonitoringHistoryFilter filter, {
    required int page,
    int pageSize = 25,
  }) async {
    List<String>? visitIds;
    if (filter.pestId != null && filter.pestId!.isNotEmpty) {
      final matching = await client
          .from('monitoreo_plagas')
          .select('visita_id')
          .eq('plaga_id', filter.pestId!)
          .gte('fecha', filter.from.toIso8601String().split('T').first)
          .lte('fecha', filter.to.toIso8601String().split('T').first);
      visitIds = matching
          .map((row) => row['visita_id']?.toString() ?? '')
          .where((id) => id.isNotEmpty)
          .toSet()
          .toList();
      if (visitIds.isEmpty) return const [];
    }

    dynamic query = client.from('visitas_monitoreo').select('''
      id,campo_id,fecha_hora_inicio,estado,fenologia,observaciones,creado_por,
      monitoreo_plagas(arbol_id,plaga_id)
    ''');
    query = query
        .gte('fecha_hora_inicio', filter.from.toIso8601String())
        .lt(
          'fecha_hora_inicio',
          filter.to.add(const Duration(days: 1)).toIso8601String(),
        );
    if (filter.fieldId != null && filter.fieldId!.isNotEmpty) {
      query = query.eq('campo_id', filter.fieldId!);
    }
    if (filter.monitorId != null && filter.monitorId!.isNotEmpty) {
      query = query.eq('creado_por', filter.monitorId!);
    }
    if (visitIds != null) query = query.inFilter('id', visitIds);
    final start = page * pageSize;
    final rows = await query
        .order('fecha_hora_inicio', ascending: false)
        .range(start, start + pageSize - 1);
    return (rows as List)
        .whereType<Map>()
        .map(
          (row) =>
              MonitoringVisitSummary.fromJson(Map<String, dynamic>.from(row)),
        )
        .toList();
  }

  Future<MonitoringVisitDetail> loadVisitDetail(String visitId) async {
    final rows = await client
        .from('monitoreo_plagas')
        .select('''
          id,arbol_id,numero_arbol,tipo_plaga,latitud,longitud,
          monitoreo_estructuras(
            id,estructura_nombre_snapshot,cantidad_revisada,cantidad_positiva,
            incidencia_porcentaje,no_evaluable,motivo_no_evaluable,
            monitoreo_unidades(
              id,numero_unidad,positivo,abundancia_categoria,severidad,observaciones,
              monitoreo_unidad_estados(cantidad,estados_biologicos(nombre)),
              monitoreo_unidad_danos(severidad,tipos_dano(nombre)),
              monitoreo_unidad_enemigos(presente,cantidad,enemigos_naturales(nombre)),
              monitoreo_fotografias(ruta_storage)
            )
          )
        ''')
        .eq('visita_id', visitId)
        .order('numero_arbol');
    final monitorings = rows
        .map(
          (row) =>
              HistoryPestMonitoring.fromJson(Map<String, dynamic>.from(row)),
        )
        .toList();
    final paths = monitorings
        .expand((monitoring) => monitoring.structures)
        .expand((structure) => structure.units)
        .expand((unit) => unit.photos)
        .toSet();
    final signedEntries = await Future.wait(
      paths.map((path) async {
        try {
          final url = await client.storage
              .from('monitoreo-fotografias')
              .createSignedUrl(path, 3600);
          return MapEntry(path, url);
        } catch (_) {
          return MapEntry(path, '');
        }
      }),
    );
    return MonitoringVisitDetail(
      monitorings: monitorings,
      photoPaths: Map.fromEntries(signedEntries),
    );
  }

  Future<List<ProtocolizedResultRow>> loadProtocolizedResults(
    MonitoringHistoryFilter filter,
  ) async {
    const pageSize = 1000;
    final result = <ProtocolizedResultRow>[];
    for (var page = 0; ; page += 1) {
      dynamic query = client.from('v_monitoreo_protocolizado').select('''
        fecha,campo_id,arbol_id,numero_arbol,plaga_id,plaga,
        estructura_id,estructura,creado_por,monitor,cantidad_revisada,
        cantidad_positiva,no_evaluable,latitud,longitud
      ''');
      query = query
          .eq('estado_registro', 'completado')
          .gte('fecha', filter.from.toIso8601String().split('T').first)
          .lte('fecha', filter.to.toIso8601String().split('T').first);
      if (filter.fieldId != null && filter.fieldId!.isNotEmpty) {
        query = query.eq('campo_id', filter.fieldId!);
      }
      if (filter.pestId != null && filter.pestId!.isNotEmpty) {
        query = query.eq('plaga_id', filter.pestId!);
      }
      if (filter.structureId != null && filter.structureId!.isNotEmpty) {
        query = query.eq('estructura_id', filter.structureId!);
      }
      if (filter.monitorId != null && filter.monitorId!.isNotEmpty) {
        query = query.eq('creado_por', filter.monitorId!);
      }
      final start = page * pageSize;
      final rows = await query
          .order('fecha', ascending: false)
          .range(start, start + pageSize - 1);
      final pageRows = (rows as List)
          .whereType<Map>()
          .map(
            (row) =>
                ProtocolizedResultRow.fromJson(Map<String, dynamic>.from(row)),
          )
          .toList();
      result.addAll(pageRows);
      if (pageRows.length < pageSize) break;
    }
    return result;
  }

  Future<void> queueCompletedVisit(VisitDraft draft) async {
    final operations = ProtocolSyncPlanner.build(draft);
    final payload = draft.toJson()
      ..['estado'] = VisitStatus.pendingSync.wireName;
    await _local.saveDraftAndEnqueue(
      id: draft.id,
      fieldId: draft.fieldId,
      status: VisitStatus.pendingSync.wireName,
      payload: payload,
      operations: operations,
      operationIdPrefix: ProtocolSyncPlanner.operationPrefix(draft.id),
    );
  }

  Future<void> discardDraft(String id) async {
    final draft = await readDraft(id);
    if (draft != null) {
      for (final tree in ProtocolSyncPlanner._treesFor(draft)) {
        for (final monitoring in tree.pestObservations) {
          for (final structure in monitoring.structures) {
            for (final unit in structure.units) {
              for (final photo in unit.photos) {
                final file = File(photo.localPath);
                if (await file.exists()) await file.delete();
              }
            }
          }
        }
      }
    }
    await _local.deletePendingByPrefix(ProtocolSyncPlanner.operationPrefix(id));
    await _local.deleteVisitDraft(id);
  }

  Future<ProtocolSyncReport> syncPending() async {
    final connectivity = await _connectivity.checkConnectivity();
    if (connectivity.every((result) => result == ConnectivityResult.none)) {
      return ProtocolSyncReport(
        synced: 0,
        failed: 0,
        remaining: await pendingCount(),
        offline: true,
      );
    }

    var synced = 0;
    var failed = 0;
    while (true) {
      final ready = await _local.pending(
        types: ProtocolSyncPlanner.operationTypes,
      );
      if (ready.isEmpty) break;
      var progressed = false;
      for (final operation in ready) {
        try {
          await _local.markSyncing(operation.id);
          await _sendOperation(operation).timeout(AppConfig.writeTimeout);
          await _local.markSynced(operation.id);
          if (operation.type == 'protocol_visit_finalize') {
            final draftId = operation.payload['draft_id']?.toString();
            if (draftId != null && draftId.isNotEmpty) {
              await _local.deleteVisitDraft(draftId);
            }
          }
          synced += 1;
          progressed = true;
        } catch (error) {
          await _local.markFailed(operation.id, error);
          failed += 1;
        }
      }
      if (!progressed) break;
    }
    return ProtocolSyncReport(
      synced: synced,
      failed: failed,
      remaining: await pendingCount(),
    );
  }

  Future<void> _sendOperation(PendingOperation operation) async {
    final payload = operation.payload;
    if (operation.type == 'protocol_photo_sync') {
      await _syncPhoto(payload);
      return;
    }
    final table = payload['table']?.toString() ?? '';
    if (table.isEmpty) throw StateError('Operacion sin tabla de destino.');

    if (payload['row'] case final Map rowValue) {
      final row = Map<String, dynamic>.from(rowValue);
      if (payload['resolve_tree'] == true) await _resolveTreeId(row);
      await client
          .from(table)
          .upsert(row, onConflict: payload['on_conflict']?.toString() ?? 'id');
      return;
    }
    if (payload['rows'] case final List rowsValue) {
      final rows = rowsValue
          .map((item) => Map<String, dynamic>.from(item as Map))
          .toList();
      if (rows.isEmpty) return;
      await client
          .from(table)
          .upsert(rows, onConflict: payload['on_conflict']?.toString() ?? 'id');
      return;
    }
    final matchId = payload['match_id']?.toString() ?? '';
    if (payload['values'] case final Map valuesValue when matchId.isNotEmpty) {
      await client
          .from(table)
          .update(Map<String, dynamic>.from(valuesValue))
          .eq('id', matchId);
      return;
    }
    throw StateError('Formato de operacion no reconocido: ${operation.type}.');
  }

  Future<void> _syncPhoto(Map<String, dynamic> payload) async {
    final table = payload['table']?.toString() ?? '';
    final bucket = payload['bucket']?.toString() ?? '';
    final localPath = payload['local_path']?.toString() ?? '';
    final storagePath = payload['storage_path']?.toString() ?? '';
    final rowValue = payload['row'];
    if (table.isEmpty ||
        bucket.isEmpty ||
        localPath.isEmpty ||
        storagePath.isEmpty ||
        rowValue is! Map) {
      throw StateError('La fotografia pendiente esta incompleta.');
    }
    final row = Map<String, dynamic>.from(rowValue);
    final operationId = row['id_operacion_cliente']?.toString() ?? '';
    final file = File(localPath);
    if (!await file.exists()) {
      final existing = operationId.isEmpty
          ? null
          : await client
                .from(table)
                .select('id')
                .eq('id_operacion_cliente', operationId)
                .maybeSingle();
      if (existing != null) return;
      throw StateError('El archivo local de la fotografia ya no existe.');
    }
    await client.storage
        .from(bucket)
        .upload(
          storagePath,
          file,
          fileOptions: FileOptions(
            upsert: true,
            contentType: row['mime_type']?.toString(),
          ),
        );
    await client.from(table).upsert(row, onConflict: 'id');
    await file.delete();
  }

  Future<void> _resolveTreeId(Map<String, dynamic> row) async {
    final treeId = row['arbol_id']?.toString() ?? '';
    if (treeId.isEmpty) return;
    final tree = await client
        .from('monitoreo_arboles')
        .select('id')
        .or('id.eq.$treeId,id_operacion_cliente.eq.$treeId')
        .limit(1)
        .maybeSingle();
    if (tree == null) {
      throw StateError('El arbol de la visita aun no esta sincronizado.');
    }
    row['arbol_id'] = tree['id'];
  }

  Future<int> pendingCount() =>
      _local.pendingCount(types: ProtocolSyncPlanner.operationTypes);
}
