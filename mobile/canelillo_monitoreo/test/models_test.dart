import 'package:canelillo_monitoreo/models/models.dart';
import 'package:canelillo_monitoreo/services/protocol_monitoring_repository.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

void main() {
  test('suma solo las etapas registradas del monitoreo', () {
    final record = MonitoringRecord(
      id: '1',
      clientOperationId: 'client-1',
      correlative: 1,
      treeId: 'tree-1',
      fieldId: 'field-1',
      treeNumber: '12',
      pest: 'Trips',
      date: DateTime(2026, 8, 13),
      position: const LatLng(-32.81, -71.26),
      found: true,
      stages: const {'huevos': 1, 'adultos': 2, 'larvas': 3},
      foundAt: 'Hoja',
    );

    expect(record.total, 6);
  });

  test('el árbol conserva origen y precisión de la ubicación', () {
    final record = TreeRecord.fromJson({
      'id': 'tree-1',
      'id_operacion_cliente': 'operation-1',
      'campo_id': 'field-1',
      'numero_arbol': '12',
      'latitud': -32.81,
      'longitud': -71.26,
      'activo': true,
      'ubicacion_fuente': 'gps',
      'precision_metros': 8.4,
    });

    expect(record.locationSource, 'gps');
    expect(record.accuracyMeters, 8.4);
    expect(record.toJson()['ubicacion_fuente'], 'gps');
    expect(record.toJson()['precision_metros'], 8.4);
  });

  test('la etiqueta agrega P solo a potreros numericos', () {
    const numeric = FieldBlock(
      id: '1',
      potrero: '25',
      block: '2',
      species: 'PALTO',
      variety: 'HASS',
      hectares: 3,
    );
    const letter = FieldBlock(
      id: '2',
      potrero: 'D',
      block: '1',
      species: 'PALTO',
      variety: 'HASS',
      hectares: 2,
    );

    expect(numeric.label, 'P25 · B2');
    expect(letter.label, 'D · B1');
  });

  test('la incidencia cuenta unidades positivas, no estados biologicos', () {
    final structure = _structureSample();

    expect(structure.reviewedQuantity, 10);
    expect(structure.positiveQuantity, 4);
    expect(structure.incidencePercentage, 40);
    expect(structure.units.first.stateCounts, hasLength(2));
  });

  test('una estructura no evaluable no genera una incidencia artificial', () {
    const structure = StructureSample(
      id: 'structure-1',
      structureId: 'leaf',
      plannedQuantity: 10,
      structureNameSnapshot: 'Hoja',
      units: [],
      attributes: [],
      notEvaluable: true,
      notEvaluableReason: 'Sin hojas disponibles',
    );

    expect(structure.reviewedQuantity, 0);
    expect(structure.positiveQuantity, 0);
    expect(structure.incidencePercentage, isNull);
  });

  test('el borrador protocolizado conserva toda la jerarquia local', () {
    final original = _visitDraft();
    final restored = VisitDraft.fromJson(original.toJson());

    expect(restored.id, original.id);
    expect(restored.status, VisitStatus.inProgress);
    expect(restored.pestObservations, hasLength(1));
    expect(
      restored.pestObservations.first.structures.first.units,
      hasLength(10),
    );
    expect(
      restored.pestObservations.first.structures.first.units.first.stateCounts,
      hasLength(2),
    );
  });

  test(
    'el plan de sincronizacion respeta dependencias y finaliza al final',
    () {
      final operations = ProtocolSyncPlanner.build(_visitDraft());

      expect(operations.first.type, 'protocol_visit_upsert');
      expect(operations.first.dependsOn, isNull);
      for (var index = 1; index < operations.length; index += 1) {
        expect(operations[index].dependsOn, operations[index - 1].id);
      }
      expect(operations.last.type, 'protocol_visit_finalize');
      expect(
        operations.map((operation) => operation.type),
        containsAllInOrder([
          'protocol_pest_upsert',
          'protocol_structure_upsert',
          'protocol_units_batch_upsert',
          'protocol_states_batch_upsert',
          'protocol_pest_finalize',
          'protocol_visit_finalize',
        ]),
      );
    },
  );

  test('una visita conserva y sincroniza varios arboles por separado', () {
    final firstMonitoring = _protocolObservation('first');
    final secondMonitoring = _protocolObservation('second');
    final original = _visitDraft().copyWith(
      pestObservations: const [],
      treeMonitorings: [
        TreeMonitoringDraft(
          treeId: 'tree-1',
          treeNumber: '12',
          latitude: -32.81,
          longitude: -71.26,
          pestObservations: [firstMonitoring],
          completedAt: DateTime(2026, 8, 26, 9, 45),
        ),
        TreeMonitoringDraft(
          treeId: 'tree-2',
          treeNumber: '13',
          latitude: -32.8101,
          longitude: -71.2601,
          pestObservations: [secondMonitoring],
          completedAt: DateTime(2026, 8, 26, 9, 55),
        ),
      ],
    );

    final restored = VisitDraft.fromJson(original.toJson());
    final operations = ProtocolSyncPlanner.build(restored);
    final visitRow = operations.first.payload['row'] as Map<String, dynamic>;
    final pestRows = operations
        .where((operation) => operation.type == 'protocol_pest_upsert')
        .map((operation) => operation.payload['row'] as Map<String, dynamic>)
        .toList();

    expect(restored.treeMonitorings, hasLength(2));
    expect(visitRow['arboles_programados'], 2);
    expect(pestRows, hasLength(2));
    expect(pestRows.map((row) => row['arbol_id']), ['tree-1', 'tree-2']);
    expect(pestRows.map((row) => row['id']), [
      'monitoring-first',
      'monitoring-second',
    ]);
  });

  test('la fotografia queda en el borrador y se encola antes de finalizar', () {
    final photo = PhotoEvidence(
      id: 'photo-1',
      clientOperationId: 'photo-operation-1',
      localPath: r'C:\offline\photo-1.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 1200,
      createdAt: DateTime(2026, 8, 26, 10),
    );
    final draft = _visitDraft().copyWith(
      pestObservations: [
        _protocolObservation('photo', photos: [photo]),
      ],
    );

    final restored = VisitDraft.fromJson(draft.toJson());
    final operations = ProtocolSyncPlanner.build(restored);
    final photoIndex = operations.indexWhere(
      (operation) => operation.type == 'protocol_photo_sync',
    );
    final finalizationIndex = operations.indexWhere(
      (operation) => operation.type == 'protocol_pest_finalize',
    );

    expect(
      restored.pestObservations.first.structures.first.units.first.photos,
      hasLength(1),
    );
    expect(photoIndex, greaterThan(0));
    expect(photoIndex, lessThan(finalizationIndex));
    expect(operations[photoIndex].payload['local_path'], photo.localPath);
  });

  test('la agregacion usa sumas y no el promedio simple de porcentajes', () {
    final rows = [
      _resultRow(treeId: 'tree-1', reviewed: 10, positive: 4),
      _resultRow(treeId: 'tree-2', reviewed: 20, positive: 2),
    ];

    final result = aggregateProtocolizedRows(rows).single;

    expect(result.monitoredPoints, 2);
    expect(result.positivePoints, 2);
    expect(result.reviewedUnits, 30);
    expect(result.positiveUnits, 6);
    expect(result.incidence, 20);
  });

  test('un organismo no identificado queda pendiente de clasificacion', () {
    final draft = _visitDraft().copyWith(
      pestObservations: [
        ProtocolPestObservation(
          id: 'unknown-1',
          clientOperationId: 'unknown-operation-1',
          pestId: 'unknown-pest',
          pestName: 'Organismo / plaga no identificada',
          protocolId: 'unknown-protocol',
          protocolVersion: 1,
          structures: [_structureSample(suffix: 'unknown')],
          attributes: const [],
        ),
      ],
    );

    final finalization = ProtocolSyncPlanner.build(
      draft,
    ).firstWhere((operation) => operation.type == 'protocol_pest_finalize');
    final values = finalization.payload['values'] as Map<String, dynamic>;

    expect(values['estado_registro'], 'pendiente_identificacion');
  });

  test('la configuracion administrativa conserva version y frecuencia', () {
    final protocol = AdminProtocolRecord.fromJson({
      'id': 'protocol-2',
      'plaga_id': 'pest-1',
      'cultivo_referencia': 'PALTO',
      'nombre': 'Protocolo estándar',
      'descripcion': 'Muestreo de hojas',
      'version': 2,
      'requiere_lupa': true,
      'instrucciones': 'Revisar el envés',
      'frecuencia_dias': 7,
      'activo': true,
    });

    expect(protocol.version, 2);
    expect(protocol.frequencyDays, 7);
    expect(protocol.requiresMagnifier, isTrue);
    expect(protocol.active, isTrue);
  });

  test('la regla administrativa serializa el snapshot de unidades', () {
    const rule = AdminStructureRule(
      structureId: 'leaf',
      quantity: 20,
      order: 1,
      required: true,
      instructions: ' Revisar ambas caras ',
    );

    expect(rule.toJson(), {
      'estructura_id': 'leaf',
      'cantidad_revisar': 20,
      'orden': 1,
      'obligatorio': true,
      'instrucciones': 'Revisar ambas caras',
    });
  });
}

ProtocolizedResultRow _resultRow({
  required String treeId,
  required int reviewed,
  required int positive,
}) => ProtocolizedResultRow(
  date: DateTime(2026, 8, 26),
  fieldId: 'field-1',
  treeId: treeId,
  treeNumber: treeId,
  pestId: 'pest-1',
  pest: 'Aranita roja',
  structureId: 'leaf',
  structure: 'Hoja',
  monitorId: 'user-1',
  monitor: 'Monitor',
  reviewed: reviewed,
  positive: positive,
  notEvaluable: false,
  position: const LatLng(-32.81, -71.26),
);

StructureSample _structureSample({
  String suffix = '1',
  List<PhotoEvidence> photos = const [],
}) => StructureSample(
  id: 'structure-sample-$suffix',
  structureId: 'leaf',
  plannedQuantity: 10,
  structureNameSnapshot: 'Hoja',
  units: [
    for (var number = 1; number <= 10; number += 1)
      SamplingUnit(
        id: 'unit-$suffix-$number',
        clientOperationId: 'unit-operation-$suffix-$number',
        number: number,
        positive: number <= 4,
        stateCounts: number == 1
            ? const [
                BiologicalStateCount(stateId: 'egg', quantity: 1),
                BiologicalStateCount(stateId: 'adult', quantity: 2),
              ]
            : const [],
        damages: const [],
        naturalEnemies: const [],
        attributes: const [],
        photos: number == 1 ? photos : const [],
      ),
  ],
  attributes: const [],
);

ProtocolPestObservation _protocolObservation(
  String suffix, {
  List<PhotoEvidence> photos = const [],
}) => ProtocolPestObservation(
  id: 'monitoring-$suffix',
  clientOperationId: 'monitoring-operation-$suffix',
  pestId: 'pest-1',
  pestName: 'Aranita roja',
  protocolId: 'protocol-1',
  protocolVersion: 1,
  structures: [_structureSample(suffix: suffix, photos: photos)],
  attributes: const [],
);

VisitDraft _visitDraft() => VisitDraft(
  id: 'visit-1',
  clientOperationId: 'visit-operation-1',
  fieldId: 'field-1',
  treeId: 'tree-1',
  treeNumber: '12',
  startedAt: DateTime(2026, 8, 26, 9, 30),
  latitude: -32.81,
  longitude: -71.26,
  phenology: 'floracion',
  status: VisitStatus.inProgress,
  observations: 'Recorrido norte',
  updatedAt: DateTime(2026, 8, 26, 9, 45),
  pestObservations: [_protocolObservation('1')],
);
