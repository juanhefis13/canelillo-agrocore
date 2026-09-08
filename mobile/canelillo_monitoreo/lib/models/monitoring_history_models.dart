import 'package:google_maps_flutter/google_maps_flutter.dart';

class MonitoringHistoryFilter {
  const MonitoringHistoryFilter({
    required this.from,
    required this.to,
    this.fieldId,
    this.pestId,
    this.structureId,
    this.monitorId,
  });

  final DateTime from;
  final DateTime to;
  final String? fieldId;
  final String? pestId;
  final String? structureId;
  final String? monitorId;
}

class ProtocolizedResultRow {
  const ProtocolizedResultRow({
    required this.date,
    required this.fieldId,
    required this.treeId,
    required this.treeNumber,
    required this.pestId,
    required this.pest,
    required this.structureId,
    required this.structure,
    required this.monitorId,
    required this.monitor,
    required this.reviewed,
    required this.positive,
    required this.notEvaluable,
    required this.position,
  });

  final DateTime date;
  final String fieldId;
  final String treeId;
  final String treeNumber;
  final String pestId;
  final String pest;
  final String structureId;
  final String structure;
  final String monitorId;
  final String monitor;
  final int reviewed;
  final int positive;
  final bool notEvaluable;
  final LatLng position;

  String get groupKey => '$pestId|$structureId';

  factory ProtocolizedResultRow.fromJson(Map<String, dynamic> json) =>
      ProtocolizedResultRow(
        date: DateTime.tryParse(_text(json['fecha'])) ?? DateTime.now(),
        fieldId: _text(json['campo_id']),
        treeId: _text(json['arbol_id']),
        treeNumber: _text(json['numero_arbol']),
        pestId: _text(json['plaga_id']),
        pest: _text(json['plaga']),
        structureId: _text(json['estructura_id']),
        structure: _text(json['estructura']),
        monitorId: _text(json['creado_por']),
        monitor: _text(json['monitor']),
        reviewed: _integer(json['cantidad_revisada']),
        positive: _integer(json['cantidad_positiva']),
        notEvaluable: json['no_evaluable'] == true,
        position: LatLng(_number(json['latitud']), _number(json['longitud'])),
      );
}

class ProtocolizedAggregate {
  const ProtocolizedAggregate({
    required this.key,
    required this.pest,
    required this.structure,
    required this.monitoredPoints,
    required this.positivePoints,
    required this.reviewedUnits,
    required this.positiveUnits,
  });

  final String key;
  final String pest;
  final String structure;
  final int monitoredPoints;
  final int positivePoints;
  final int reviewedUnits;
  final int positiveUnits;

  double? get incidence =>
      reviewedUnits == 0 ? null : positiveUnits * 100 / reviewedUnits;
  double? get positivePointPercentage =>
      monitoredPoints == 0 ? null : positivePoints * 100 / monitoredPoints;
}

List<ProtocolizedAggregate> aggregateProtocolizedRows(
  List<ProtocolizedResultRow> rows,
) {
  final groups = <String, List<ProtocolizedResultRow>>{};
  for (final row in rows.where((item) => !item.notEvaluable)) {
    groups.putIfAbsent(row.groupKey, () => []).add(row);
  }
  final result = groups.entries.map((entry) {
    final values = entry.value;
    final monitored = values.map((row) => row.treeId).toSet();
    final positive = values
        .where((row) => row.positive > 0)
        .map((row) => row.treeId)
        .toSet();
    return ProtocolizedAggregate(
      key: entry.key,
      pest: values.first.pest,
      structure: values.first.structure,
      monitoredPoints: monitored.length,
      positivePoints: positive.length,
      reviewedUnits: values.fold(0, (sum, row) => sum + row.reviewed),
      positiveUnits: values.fold(0, (sum, row) => sum + row.positive),
    );
  }).toList();
  result.sort((a, b) {
    final pest = a.pest.compareTo(b.pest);
    return pest != 0 ? pest : a.structure.compareTo(b.structure);
  });
  return result;
}

class MonitorOption {
  const MonitorOption({required this.id, required this.name});
  final String id;
  final String name;

  factory MonitorOption.fromJson(Map<String, dynamic> json) => MonitorOption(
    id: _text(json['id']),
    name: _text(json['nombre_completo']).isEmpty
        ? _text(json['email'])
        : _text(json['nombre_completo']),
  );
}

class MonitoringVisitSummary {
  const MonitoringVisitSummary({
    required this.id,
    required this.fieldId,
    required this.startedAt,
    required this.status,
    required this.phenology,
    required this.notes,
    required this.monitorId,
    required this.treeCount,
    required this.pestCount,
  });

  final String id;
  final String fieldId;
  final DateTime startedAt;
  final String status;
  final String phenology;
  final String notes;
  final String monitorId;
  final int treeCount;
  final int pestCount;

  factory MonitoringVisitSummary.fromJson(Map<String, dynamic> json) {
    final rows = _maps(json['monitoreo_plagas']);
    return MonitoringVisitSummary(
      id: _text(json['id']),
      fieldId: _text(json['campo_id']),
      startedAt:
          DateTime.tryParse(_text(json['fecha_hora_inicio'])) ?? DateTime.now(),
      status: _text(json['estado']),
      phenology: _text(json['fenologia']),
      notes: _text(json['observaciones']),
      monitorId: _text(json['creado_por']),
      treeCount: rows.map((row) => _text(row['arbol_id'])).toSet().length,
      pestCount: rows.map((row) => _text(row['plaga_id'])).toSet().length,
    );
  }
}

class MonitoringVisitDetail {
  const MonitoringVisitDetail({
    required this.monitorings,
    required this.photoPaths,
  });

  final List<HistoryPestMonitoring> monitorings;
  final Map<String, String> photoPaths;
}

class HistoryPestMonitoring {
  const HistoryPestMonitoring({
    required this.id,
    required this.treeId,
    required this.treeNumber,
    required this.pest,
    required this.position,
    required this.structures,
  });

  final String id;
  final String treeId;
  final String treeNumber;
  final String pest;
  final LatLng position;
  final List<HistoryStructure> structures;

  bool get positive => structures.any((item) => item.positive > 0);

  factory HistoryPestMonitoring.fromJson(Map<String, dynamic> json) =>
      HistoryPestMonitoring(
        id: _text(json['id']),
        treeId: _text(json['arbol_id']),
        treeNumber: _text(json['numero_arbol']),
        pest: _text(json['tipo_plaga']),
        position: LatLng(_number(json['latitud']), _number(json['longitud'])),
        structures: _maps(
          json['monitoreo_estructuras'],
        ).map(HistoryStructure.fromJson).toList(),
      );
}

class HistoryStructure {
  const HistoryStructure({
    required this.id,
    required this.name,
    required this.reviewed,
    required this.positive,
    required this.incidence,
    required this.notEvaluable,
    required this.notEvaluableReason,
    required this.units,
  });

  final String id;
  final String name;
  final int reviewed;
  final int positive;
  final double? incidence;
  final bool notEvaluable;
  final String notEvaluableReason;
  final List<HistoryUnit> units;

  factory HistoryStructure.fromJson(Map<String, dynamic> json) =>
      HistoryStructure(
        id: _text(json['id']),
        name: _text(json['estructura_nombre_snapshot']),
        reviewed: _integer(json['cantidad_revisada']),
        positive: _integer(json['cantidad_positiva']),
        incidence: json['incidencia_porcentaje'] == null
            ? null
            : _number(json['incidencia_porcentaje']),
        notEvaluable: json['no_evaluable'] == true,
        notEvaluableReason: _text(json['motivo_no_evaluable']),
        units: _maps(
          json['monitoreo_unidades'],
        ).map(HistoryUnit.fromJson).toList(),
      );
}

class HistoryUnit {
  const HistoryUnit({
    required this.id,
    required this.number,
    required this.positive,
    required this.abundance,
    required this.severity,
    required this.notes,
    required this.states,
    required this.damages,
    required this.enemies,
    required this.photos,
  });

  final String id;
  final int number;
  final bool positive;
  final String abundance;
  final String severity;
  final String notes;
  final List<String> states;
  final List<String> damages;
  final List<String> enemies;
  final List<String> photos;

  factory HistoryUnit.fromJson(Map<String, dynamic> json) => HistoryUnit(
    id: _text(json['id']),
    number: _integer(json['numero_unidad']),
    positive: json['positivo'] == true,
    abundance: _text(json['abundancia_categoria']),
    severity: _text(json['severidad']),
    notes: _text(json['observaciones']),
    states: _maps(json['monitoreo_unidad_estados'])
        .map((row) {
          final catalog = _firstMap(row['estados_biologicos']);
          final name = _text(catalog?['nombre']);
          final quantity = _number(row['cantidad']);
          return quantity > 0 ? '$name (${_compact(quantity)})' : name;
        })
        .where((value) => value.isNotEmpty)
        .toList(),
    damages: _maps(json['monitoreo_unidad_danos'])
        .map((row) {
          final catalog = _firstMap(row['tipos_dano']);
          final name = _text(catalog?['nombre']);
          final severity = _text(row['severidad']);
          return severity.isEmpty ? name : '$name · $severity';
        })
        .where((value) => value.isNotEmpty)
        .toList(),
    enemies: _maps(json['monitoreo_unidad_enemigos'])
        .where((row) => row['presente'] == true)
        .map((row) => _text(_firstMap(row['enemigos_naturales'])?['nombre']))
        .where((value) => value.isNotEmpty)
        .toList(),
    photos: _maps(json['monitoreo_fotografias'])
        .map((row) => _text(row['ruta_storage']))
        .where((value) => value.isNotEmpty)
        .toList(),
  );
}

List<Map<String, dynamic>> _maps(dynamic value) => value is List
    ? value
          .whereType<Map>()
          .map((row) => Map<String, dynamic>.from(row))
          .toList()
    : const [];

Map<String, dynamic>? _firstMap(dynamic value) {
  if (value is Map) return Map<String, dynamic>.from(value);
  final rows = _maps(value);
  return rows.isEmpty ? null : rows.first;
}

String _text(dynamic value) => value?.toString().trim() ?? '';
double _number(dynamic value) => double.tryParse('$value') ?? 0;
int _integer(dynamic value) => int.tryParse('$value') ?? 0;
String _compact(double value) => value == value.roundToDouble()
    ? value.toInt().toString()
    : value.toStringAsFixed(1);
