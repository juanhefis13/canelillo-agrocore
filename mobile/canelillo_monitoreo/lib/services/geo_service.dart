import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../models/models.dart';

class FieldShape {
  const FieldShape({
    required this.fieldIds,
    required this.potrero,
    required this.block,
    required this.blockLabel,
    required this.blockAliases,
    required this.rings,
  });

  final List<String> fieldIds;
  final String potrero;
  final String block;
  final String blockLabel;
  final List<String> blockAliases;
  final List<List<LatLng>> rings;

  String get key =>
      '${normalizeFieldName(potrero)}|${normalizeFieldName(block)}';
}

class GeoMapLabel {
  const GeoMapLabel({
    required this.id,
    required this.text,
    required this.potrero,
    required this.fieldIds,
    required this.position,
  });

  final String id;
  final String text;
  final String potrero;
  final List<String> fieldIds;
  final LatLng position;
}

class AreaShape {
  const AreaShape({required this.name, required this.rings});

  final String name;
  final List<List<LatLng>> rings;
}

class GeoData {
  const GeoData({
    required this.shapes,
    required this.potreros,
    required this.casetas,
    required this.tranques,
    required this.center,
  });

  final List<FieldShape> shapes;
  final List<AreaShape> potreros;
  final List<AreaShape> casetas;
  final List<AreaShape> tranques;
  final LatLng center;

  Map<String, LatLng> fieldCenters(List<FieldBlock> fields) {
    final byId = {for (final field in fields) field.id: field};
    final byKey = {
      for (final field in fields)
        '${normalizeFieldName(field.potrero)}|${normalizeFieldName(field.block)}':
            field,
    };
    final result = <String, LatLng>{};
    for (final shape in shapes) {
      final center = _shapeCenter(shape.rings);
      for (final id in shape.fieldIds) {
        if (byId.containsKey(id)) result[id] = center;
      }
      if (shape.fieldIds.isEmpty) {
        final field = byKey[shape.key];
        if (field != null) result[field.id] = center;
      }
    }
    return result;
  }

  Map<String, LatLng> get potreroCenters => {
    for (final shape in potreros)
      normalizeFieldName(shape.name): _shapeCenter(shape.rings),
  };

  Map<String, LatLng> get casetaCenters => {
    for (final shape in casetas) shape.name: _shapeCenter(shape.rings),
  };

  List<GeoMapLabel> get blockLabels {
    final result = <GeoMapLabel>[];
    for (var index = 0; index < shapes.length; index++) {
      final shape = shapes[index];
      for (var ringIndex = 0; ringIndex < shape.rings.length; ringIndex++) {
        result.add(
          GeoMapLabel(
            id: 'block_${index}_$ringIndex',
            text: shape.blockLabel.startsWith('B')
                ? shape.blockLabel
                : 'B${shape.blockLabel}',
            potrero: shape.potrero,
            fieldIds: shape.fieldIds,
            position: _shapeCenter([shape.rings[ringIndex]]),
          ),
        );
      }
    }
    return result;
  }

  List<GeoMapLabel> get potreroLabels => [
    for (var index = 0; index < potreros.length; index++)
      GeoMapLabel(
        id: 'potrero_$index',
        text: _potreroLabel(potreros[index].name),
        potrero: potreros[index].name,
        fieldIds: const [],
        position: _shapeCenter(potreros[index].rings),
      ),
  ];

  List<FieldBlock> fieldsAt(LatLng point, List<FieldBlock> fields) {
    final byId = {for (final field in fields) field.id: field};
    final matches = <String, FieldBlock>{};
    for (final shape in shapes) {
      if (!shape.rings.any((ring) => _contains(point, ring))) continue;

      for (final id in shape.fieldIds) {
        final field = byId[id];
        if (field != null) matches[field.id] = field;
      }
      if (matches.isNotEmpty) continue;

      final potrero = normalizeFieldName(shape.potrero);
      final blocks = {
        normalizeFieldName(shape.block),
        ...shape.blockAliases.map(normalizeFieldName),
      };
      for (final field in fields) {
        if (normalizeFieldName(field.potrero) == potrero &&
            blocks.contains(normalizeFieldName(field.block))) {
          matches[field.id] = field;
        }
      }
    }
    return matches.values.toList()
      ..sort((left, right) => _naturalCompare(left.block, right.block));
  }

  FieldBlock? fieldAt(LatLng point, List<FieldBlock> fields) {
    final matches = fieldsAt(point, fields);
    return matches.isEmpty ? null : matches.first;
  }

  Set<Polygon> polygons(
    List<FieldBlock> fields, {
    Map<String, Color> fillColors = const {},
    bool showPotreros = true,
    bool showTranques = true,
  }) {
    final byId = {for (final field in fields) field.id: field};
    final byKey = {
      for (final field in fields)
        '${normalizeFieldName(field.potrero)}|${normalizeFieldName(field.block)}':
            field,
    };
    final result = <Polygon>{};

    for (var shapeIndex = 0; shapeIndex < shapes.length; shapeIndex++) {
      final shape = shapes[shapeIndex];
      final matched = shape.fieldIds
          .map((id) => byId[id])
          .whereType<FieldBlock>()
          .toList();
      final field = matched.isNotEmpty ? matched.first : byKey[shape.key];
      Color? heatColor;
      for (final candidate in matched) {
        heatColor ??= fillColors[candidate.id];
      }
      heatColor ??= field == null ? null : fillColors[field.id];
      final blockColor = _mapColor(
        '${shape.potrero}:${shape.block}',
        block: true,
      );
      for (var ringIndex = 0; ringIndex < shape.rings.length; ringIndex++) {
        result.add(
          Polygon(
            polygonId: PolygonId('block_${shapeIndex}_$ringIndex'),
            points: shape.rings[ringIndex],
            strokeColor: blockColor,
            strokeWidth: 2,
            fillColor: heatColor ?? blockColor.withValues(alpha: .10),
            consumeTapEvents: false,
            zIndex: 3,
          ),
        );
      }
    }

    if (showPotreros) {
      for (var shapeIndex = 0; shapeIndex < potreros.length; shapeIndex++) {
        final shape = potreros[shapeIndex];
        final color = _mapColor(shape.name, ordinal: shapeIndex);
        for (var ringIndex = 0; ringIndex < shape.rings.length; ringIndex++) {
          result.add(
            Polygon(
              polygonId: PolygonId('potrero_${shapeIndex}_$ringIndex'),
              points: shape.rings[ringIndex],
              strokeColor: color,
              strokeWidth: 4,
              fillColor: Colors.transparent,
              consumeTapEvents: false,
              zIndex: 8,
            ),
          );
        }
      }
    }

    if (showTranques) {
      for (var shapeIndex = 0; shapeIndex < tranques.length; shapeIndex++) {
        final shape = tranques[shapeIndex];
        for (var ringIndex = 0; ringIndex < shape.rings.length; ringIndex++) {
          result.add(
            Polygon(
              polygonId: PolygonId('tranque_${shapeIndex}_$ringIndex'),
              points: shape.rings[ringIndex],
              strokeColor: const Color(0xFF35BDF6),
              strokeWidth: 4,
              fillColor: const Color(0xFF168AC0).withValues(alpha: .30),
              consumeTapEvents: false,
              zIndex: 10,
            ),
          );
        }
      }
    }
    return result;
  }
}

class GeoService {
  static Future<GeoData> load() async {
    final collections = await Future.wait([
      _loadCollection('assets/maps/bloques.geojson'),
      _loadCollection('assets/maps/potreros.geojson'),
      _loadCollection('assets/maps/casetas.geojson'),
      _loadCollection('assets/maps/tranques.geojson'),
    ]);
    final blockShapes = _fieldShapes(collections[0]);
    final potreroShapes = _areaShapes(collections[1], [
      'potrero_oficial',
      'potrero',
      'Potrero_Nombre',
      'nombre',
    ]);
    final casetaShapes = _areaShapes(collections[2], [
      'nombre',
      'Nombre',
      'caseta',
    ]);
    final tranqueShapes = _areaShapes(collections[3], [
      'nombre',
      'Nombre',
      'tranque',
    ]);
    final points = blockShapes
        .expand((shape) => shape.rings)
        .expand((ring) => ring)
        .toList();
    return GeoData(
      shapes: blockShapes,
      potreros: potreroShapes,
      casetas: casetaShapes,
      tranques: tranqueShapes,
      center: points.isEmpty
          ? const LatLng(-32.812, -71.262)
          : LatLng(
              points.fold<double>(0, (sum, point) => sum + point.latitude) /
                  points.length,
              points.fold<double>(0, (sum, point) => sum + point.longitude) /
                  points.length,
            ),
    );
  }

  static Future<Map<String, dynamic>> _loadCollection(String asset) async {
    final raw = await rootBundle.loadString(asset);
    return Map<String, dynamic>.from(jsonDecode(raw) as Map);
  }

  static List<FieldShape> _fieldShapes(Map<String, dynamic> collection) {
    final result = <FieldShape>[];
    for (final item in (collection['features'] as List? ?? const [])) {
      final feature = Map<String, dynamic>.from(item as Map);
      final properties = Map<String, dynamic>.from(
        feature['properties'] as Map? ?? const {},
      );
      final geometry = Map<String, dynamic>.from(
        feature['geometry'] as Map? ?? const {},
      );
      final potrero = _fieldText(properties, [
        'potrero_oficial',
        'potrero',
        'Potrero_Nombre',
        'Potrero',
        'Potrero_Alias:',
      ]).replaceFirst(RegExp(r'^P(?=\d)', caseSensitive: false), '');
      final block = _fieldText(properties, ['bloque', 'Bloque']);
      final blockLabel = _fieldText(properties, ['bloque_label', 'Bloque']);
      final rings = _geometryRings(geometry);
      if (potrero.isEmpty || block.isEmpty || rings.isEmpty) continue;
      result.add(
        FieldShape(
          fieldIds: _fieldList(properties, ['campo_ids', 'campo_id']),
          potrero: potrero,
          block: block,
          blockLabel: blockLabel.isEmpty ? block : blockLabel,
          blockAliases: _fieldList(properties, [
            'bloques_supabase',
            'bloque_aliases',
          ]),
          rings: rings,
        ),
      );
    }
    return result;
  }

  static List<AreaShape> _areaShapes(
    Map<String, dynamic> collection,
    List<String> nameKeys,
  ) {
    final result = <AreaShape>[];
    for (final item in (collection['features'] as List? ?? const [])) {
      final feature = Map<String, dynamic>.from(item as Map);
      final properties = Map<String, dynamic>.from(
        feature['properties'] as Map? ?? const {},
      );
      final geometry = Map<String, dynamic>.from(
        feature['geometry'] as Map? ?? const {},
      );
      final name = _fieldText(properties, nameKeys);
      final rings = _geometryRings(geometry);
      if (name.isNotEmpty && rings.isNotEmpty) {
        result.add(AreaShape(name: name, rings: rings));
      }
    }
    return result;
  }

  static List<List<LatLng>> _geometryRings(Map<String, dynamic> geometry) {
    final type = geometry['type']?.toString();
    final coordinates = geometry['coordinates'];
    if (coordinates is! List) return [];
    final Iterable<dynamic> rawRings;
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
    if (value.isNotEmpty && value != 'null') return value;
  }
  return '';
}

List<String> _fieldList(Map<String, dynamic> row, List<String> keys) {
  for (final key in keys) {
    final value = row[key];
    if (value is List) {
      return value
          .map((item) => item.toString().trim())
          .where((item) => item.isNotEmpty)
          .toList();
    }
    final text = value?.toString().trim() ?? '';
    if (text.isNotEmpty && text != 'null') {
      return text
          .split(RegExp(r'[,;/|]'))
          .map((item) => item.trim())
          .where((item) => item.isNotEmpty)
          .toList();
    }
  }
  return const [];
}

String normalizeFieldName(String value) => value
    .trim()
    .toUpperCase()
    .replaceFirst(RegExp(r'^P(?=\d)'), '')
    .replaceAll(RegExp(r'[^A-Z0-9]'), '');

int _naturalCompare(String left, String right) {
  final leftNumber = int.tryParse(left.trim());
  final rightNumber = int.tryParse(right.trim());
  if (leftNumber != null && rightNumber != null) {
    return leftNumber.compareTo(rightNumber);
  }
  return left.toLowerCase().compareTo(right.toLowerCase());
}

bool _contains(LatLng point, List<LatLng> polygon) {
  var inside = false;
  for (
    var index = 0, previous = polygon.length - 1;
    index < polygon.length;
    previous = index++
  ) {
    final current = polygon[index];
    final prior = polygon[previous];
    final intersects =
        ((current.longitude > point.longitude) !=
            (prior.longitude > point.longitude)) &&
        (point.latitude <
            (prior.latitude - current.latitude) *
                    (point.longitude - current.longitude) /
                    (prior.longitude - current.longitude + 1e-12) +
                current.latitude);
    if (intersects) inside = !inside;
  }
  return inside;
}

LatLng _shapeCenter(List<List<LatLng>> rings) {
  if (rings.isEmpty) return const LatLng(0, 0);
  final sorted = [...rings]
    ..sort((left, right) => _ringArea(right).compareTo(_ringArea(left)));
  final selected = sorted.first;
  return LatLng(
    selected.fold<double>(0, (sum, point) => sum + point.latitude) /
        selected.length,
    selected.fold<double>(0, (sum, point) => sum + point.longitude) /
        selected.length,
  );
}

double _ringArea(List<LatLng> ring) {
  var area = 0.0;
  for (var index = 0; index < ring.length; index++) {
    final current = ring[index];
    final next = ring[(index + 1) % ring.length];
    area +=
        current.longitude * next.latitude - next.longitude * current.latitude;
  }
  return area.abs() / 2;
}

Color _mapColor(String key, {bool block = false, int? ordinal}) {
  var hash = 2166136261;
  for (final unit in key.toUpperCase().codeUnits) {
    hash ^= unit;
    hash = (hash * 16777619) & 0xFFFFFFFF;
  }
  final hue = ordinal == null ? (hash % 997) * 137.508 : ordinal * 137.508;
  return HSVColor.fromAHSV(1, hue % 360, block ? .92 : .88, .96).toColor();
}

String _potreroLabel(String value) {
  final clean = value.replaceFirst(
    RegExp(r'^P(?=\d)', caseSensitive: false),
    '',
  );
  return RegExp(r'^\d').hasMatch(clean) ? 'P$clean' : clean;
}
