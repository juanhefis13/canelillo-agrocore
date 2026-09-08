import 'package:canelillo_monitoreo/models/models.dart';
import 'package:canelillo_monitoreo/services/geo_service.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  const first = FieldBlock(
    id: 'campo-1',
    potrero: '5',
    block: '1A',
    species: 'MANDARINA',
    variety: 'MURCOTT',
    hectares: 3.2,
    plants: 1400,
  );
  const second = FieldBlock(
    id: 'campo-2',
    potrero: '5',
    block: '1B',
    species: 'MANDARINA',
    variety: 'MURCOTT',
    hectares: 2.8,
    plants: 1200,
  );
  const ring = [
    LatLng(-32.82, -71.27),
    LatLng(-32.82, -71.26),
    LatLng(-32.81, -71.26),
    LatLng(-32.81, -71.27),
  ];
  const geo = GeoData(
    shapes: [
      FieldShape(
        fieldIds: ['campo-1', 'campo-2'],
        potrero: '5',
        block: '1A / 1B',
        blockLabel: '1A / 1B',
        blockAliases: ['1A', '1B'],
        rings: [ring],
      ),
    ],
    potreros: [],
    casetas: [],
    tranques: [],
    center: LatLng(-32.815, -71.265),
  );

  test('resuelve todos los campos vinculados al poligono por UUID', () {
    final fields = geo.fieldsAt(const LatLng(-32.815, -71.265), [
      first,
      second,
    ]);

    expect(fields.map((field) => field.id), ['campo-1', 'campo-2']);
  });

  test('no conserva un campo cuando el punto queda fuera del bloque', () {
    final field = geo.fieldAt(const LatLng(-32.80, -71.25), [first, second]);

    expect(field, isNull);
  });

  test('campos conserva hectareas y plantas en cache', () {
    final restored = FieldBlock.fromJson(first.toJson());

    expect(restored.hectares, 3.2);
    expect(restored.plants, 1400);
  });

  test('el paquete movil contiene el mapa vigente y sus capas', () async {
    final loaded = await GeoService.load();

    expect(loaded.shapes.length, greaterThan(150));
    expect(
      loaded.shapes.where((shape) => shape.fieldIds.isNotEmpty).length,
      greaterThan(150),
    );
    expect(loaded.potreros.length, greaterThan(30));
    expect(loaded.casetas, isNotEmpty);
    expect(loaded.tranques, isNotEmpty);
  });
}
