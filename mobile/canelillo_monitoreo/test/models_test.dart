import 'package:canelillo_monitoreo/models/models.dart';
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
}
