import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../core/app_theme.dart';
import '../models/models.dart';

class FieldShape {
  const FieldShape({
    required this.potrero,
    required this.block,
    required this.rings,
  });

  final String potrero;
  final String block;
  final List<List<LatLng>> rings;

  String get key => '${_normalize(potrero)}|${_normalize(block)}';
}

class GeoData {
  const GeoData({required this.shapes, required this.center});

  final List<FieldShape> shapes;
  final LatLng center;

  Map<String, LatLng> fieldCenters(List<FieldBlock> fields) {
    final byKey = {
      for (final field in fields)
        '${_normalize(field.potrero)}|${_normalize(field.block)}': field,
    };
    final pointsByField = <String, List<LatLng>>{};
    for (final shape in shapes) {
      final field = byKey[shape.key];
      if (field == null) continue;
      pointsByField.putIfAbsent(field.id, () => []).addAll(shape.rings.first);
    }
    return {
      for (final entry in pointsByField.entries)
        entry.key: LatLng(
          entry.value.fold<double>(0, (sum, point) => sum + point.latitude) /
              entry.value.length,
          entry.value.fold<double>(0, (sum, point) => sum + point.longitude) /
              entry.value.length,
        ),
    };
  }

  FieldBlock? fieldAt(LatLng point, List<FieldBlock> fields) {
    for (final shape in shapes) {
      if (!shape.rings.any((ring) => _contains(point, ring))) continue;
      return fields.cast<FieldBlock?>().firstWhere(
        (field) =>
            field != null &&
            _normalize(field.potrero) == _normalize(shape.potrero) &&
            _normalize(field.block) == _normalize(shape.block),
        orElse: () => null,
      );
    }
    return null;
  }

  Set<Polygon> polygons(
    List<FieldBlock> fields, {
    Map<String, Color> fillColors = const {},
  }) {
    final byKey = {
      for (final field in fields)
        '${_normalize(field.potrero)}|${_normalize(field.block)}': field,
    };
    final result = <Polygon>{};
    for (var shapeIndex = 0; shapeIndex < shapes.length; shapeIndex++) {
      final shape = shapes[shapeIndex];
      final field = byKey[shape.key];
      final heatColor = field == null ? null : fillColors[field.id];
      for (var ringIndex = 0; ringIndex < shape.rings.length; ringIndex++) {
        result.add(
          Polygon(
            polygonId: PolygonId('field_${shapeIndex}_$ringIndex'),
            points: shape.rings[ringIndex],
            strokeColor: field == null
                ? const Color(0xFF8A9A94)
                : AppColors.forest,
            strokeWidth: field == null ? 1 : 2,
            fillColor:
                heatColor ??
                (field == null ? const Color(0xFF8A9A94) : AppColors.forest)
                    .withValues(alpha: .055),
            consumeTapEvents: false,
            zIndex: 2,
          ),
        );
      }
    }
    return result;
  }
}

class GeoService {
  static Future<GeoData> load() async {
    final raw = await rootBundle.loadString('assets/maps/bloques.geojson');
    final collection = jsonDecode(raw) as Map<String, dynamic>;
    final features = (collection['features'] as List? ?? const []);
    final shapes = <FieldShape>[];
    var latitude = 0.0;
    var longitude = 0.0;
    var points = 0;
    for (final item in features) {
      final feature = Map<String, dynamic>.from(item as Map);
      final properties = Map<String, dynamic>.from(
        feature['properties'] as Map? ?? const {},
      );
      final geometry = Map<String, dynamic>.from(
        feature['geometry'] as Map? ?? const {},
      );
      final potrero = _fieldText(properties, [
        'Potrero_Nombre',
        'potrero',
        'Potrero',
        'Potrero_Alias:',
      ]).replaceFirst(RegExp(r'^P(?=\d)', caseSensitive: false), '');
      final block = _fieldText(properties, ['Bloque', 'bloque']);
      final rings = _geometryRings(geometry);
      if (potrero.isEmpty || block.isEmpty || rings.isEmpty) continue;
      for (final ring in rings) {
        for (final point in ring) {
          latitude += point.latitude;
          longitude += point.longitude;
          points += 1;
        }
      }
      shapes.add(FieldShape(potrero: potrero, block: block, rings: rings));
    }
    return GeoData(
      shapes: shapes,
      center: points == 0
          ? const LatLng(-32.812, -71.262)
          : LatLng(latitude / points, longitude / points),
    );
  }

  static List<List<LatLng>> _geometryRings(Map<String, dynamic> geometry) {
    final type = geometry['type']?.toString();
    final coordinates = geometry['coordinates'];
    if (coordinates is! List) return [];
    Iterable<dynamic> rawRings;
    if (type == 'Polygon') {
      rawRings = coordinates.take(1);
    } else if (type == 'MultiPolygon') {
      rawRings = coordinates.expand((polygon) => (polygon as List).take(1));
    } else {
      return [];
    }
    return rawRings
        .map((rawRing) {
          return (rawRing as List).map((coordinate) {
            final pair = coordinate as List;
            return LatLng(
              (pair[1] as num).toDouble(),
              (pair[0] as num).toDouble(),
            );
          }).toList();
        })
        .where((ring) => ring.length >= 3)
        .toList();
  }
}

String _fieldText(Map<String, dynamic> row, List<String> keys) {
  for (final key in keys) {
    final value = row[key]?.toString().trim() ?? '';
    if (value.isNotEmpty) return value;
  }
  return '';
}

String _normalize(String value) => value
    .trim()
    .toUpperCase()
    .replaceFirst(RegExp(r'^P(?=\d)'), '')
    .replaceAll(RegExp(r'[^A-Z0-9]'), '');

bool _contains(LatLng point, List<LatLng> polygon) {
  var inside = false;
  for (
    var index = 0, previous = polygon.length - 1;
    index < polygon.length;
    previous = index++
  ) {
    final currentPoint = polygon[index];
    final previousPoint = polygon[previous];
    final intersects =
        ((currentPoint.longitude > point.longitude) !=
            (previousPoint.longitude > point.longitude)) &&
        (point.latitude <
            (previousPoint.latitude - currentPoint.latitude) *
                    (point.longitude - currentPoint.longitude) /
                    (previousPoint.longitude - currentPoint.longitude + 1e-12) +
                currentPoint.latitude);
    if (intersects) inside = !inside;
  }
  return inside;
}
