import 'package:google_maps_flutter/google_maps_flutter.dart';

double _number(dynamic value) => double.tryParse('$value') ?? 0;
String _text(dynamic value) => value?.toString().trim() ?? '';

class FieldBlock {
  const FieldBlock({
    required this.id,
    required this.potrero,
    required this.block,
    required this.species,
    required this.variety,
    required this.hectares,
  });

  final String id;
  final String potrero;
  final String block;
  final String species;
  final String variety;
  final double hectares;

  String get label {
    final potreroLabel = RegExp(r'^\d').hasMatch(potrero)
        ? 'P$potrero'
        : potrero;
    return '$potreroLabel · B$block';
  }

  factory FieldBlock.fromJson(Map<String, dynamic> json) => FieldBlock(
    id: _text(json['id']),
    potrero: _text(json['potrero']),
    block: _text(json['bloque']),
    species: _text(json['especie']),
    variety: _text(json['variedad']),
    hectares: _number(json['hectareas']),
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'potrero': potrero,
    'bloque': block,
    'especie': species,
    'variedad': variety,
    'hectareas': hectares,
  };
}

class TreeRecord {
  const TreeRecord({
    required this.id,
    required this.clientOperationId,
    required this.fieldId,
    required this.number,
    required this.row,
    required this.monitoringSector,
    required this.position,
    required this.active,
    this.referenceDate,
    this.pending = false,
  });

  final String id;
  final String clientOperationId;
  final String fieldId;
  final String number;
  final String row;
  final String monitoringSector;
  final LatLng position;
  final bool active;
  final DateTime? referenceDate;
  final bool pending;

  TreeRecord copyWith({
    String? id,
    String? clientOperationId,
    String? fieldId,
    String? number,
    String? row,
    String? monitoringSector,
    LatLng? position,
    bool? active,
    DateTime? referenceDate,
    bool? pending,
  }) => TreeRecord(
    id: id ?? this.id,
    clientOperationId: clientOperationId ?? this.clientOperationId,
    fieldId: fieldId ?? this.fieldId,
    number: number ?? this.number,
    row: row ?? this.row,
    monitoringSector: monitoringSector ?? this.monitoringSector,
    position: position ?? this.position,
    active: active ?? this.active,
    referenceDate: referenceDate ?? this.referenceDate,
    pending: pending ?? this.pending,
  );

  factory TreeRecord.fromJson(Map<String, dynamic> json) => TreeRecord(
    id: _text(json['id']),
    clientOperationId: _text(json['id_operacion_cliente']),
    fieldId: _text(json['campo_id']),
    number: _text(json['numero_arbol']),
    row: _text(json['hilera']),
    monitoringSector: _text(json['sector_monitoreo']),
    position: LatLng(_number(json['latitud']), _number(json['longitud'])),
    active: json['activo'] != false,
    referenceDate: DateTime.tryParse(_text(json['fecha_referencia'])),
    pending: json['pending'] == true,
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'id_operacion_cliente': clientOperationId,
    'campo_id': fieldId,
    'numero_arbol': number,
    'hilera': row,
    'sector_monitoreo': monitoringSector,
    'latitud': position.latitude,
    'longitud': position.longitude,
    'activo': active,
    'fecha_referencia': referenceDate?.toIso8601String().split('T').first,
    'pending': pending,
  };
}

class PestCatalog {
  const PestCatalog({
    required this.name,
    required this.stages,
    required this.maximum,
  });

  final String name;
  final List<String> stages;
  final double maximum;

  factory PestCatalog.fromJson(Map<String, dynamic> json) {
    const columns = {
      'huevos': 'usa_huevos',
      'ninfas_1': 'usa_ninfas_1',
      'ninfas_2': 'usa_ninfas_2',
      'ninfas_3': 'usa_ninfas_3',
      'adultos': 'usa_adultos',
      'larvas': 'usa_larvas',
      'pupas': 'usa_pupas',
    };
    final cachedStages =
        (json['etapas'] as List?)
            ?.map((value) => value.toString())
            .where((value) => value.isNotEmpty)
            .toList() ??
        const <String>[];
    return PestCatalog(
      name: _text(json['tipo_plaga']),
      stages: cachedStages.isNotEmpty
          ? cachedStages
          : columns.entries
                .where((entry) => json[entry.value] == true)
                .map((entry) => entry.key)
                .toList(),
      maximum: _number(json['maximo_captura']),
    );
  }

  Map<String, dynamic> toJson() => {
    'tipo_plaga': name,
    'etapas': stages,
    'maximo_captura': maximum,
  };
}

class MonitoringRecord {
  const MonitoringRecord({
    required this.id,
    required this.clientOperationId,
    required this.correlative,
    required this.treeId,
    required this.fieldId,
    required this.treeNumber,
    required this.pest,
    required this.date,
    required this.position,
    required this.found,
    required this.stages,
    required this.foundAt,
    this.pending = false,
  });

  final String id;
  final String clientOperationId;
  final int correlative;
  final String treeId;
  final String fieldId;
  final String treeNumber;
  final String pest;
  final DateTime date;
  final LatLng position;
  final bool found;
  final Map<String, double> stages;
  final String foundAt;
  final bool pending;

  double get total => stages.values.fold(0, (sum, value) => sum + value);

  factory MonitoringRecord.fromJson(Map<String, dynamic> json) {
    const stageKeys = [
      'huevos',
      'ninfas_1',
      'ninfas_2',
      'ninfas_3',
      'adultos',
      'larvas',
      'pupas',
    ];
    return MonitoringRecord(
      id: _text(json['id']),
      clientOperationId: _text(json['id_operacion_cliente']),
      correlative: int.tryParse('${json['correlativo']}') ?? 0,
      treeId: _text(json['arbol_id']),
      fieldId: _text(json['campo_id']),
      treeNumber: _text(json['numero_arbol']),
      pest: _text(json['tipo_plaga']),
      date: DateTime.tryParse(_text(json['fecha'])) ?? DateTime.now(),
      position: LatLng(_number(json['latitud']), _number(json['longitud'])),
      found: json['encontrada'] != false,
      stages: {for (final key in stageKeys) key: _number(json[key])},
      foundAt: _text(json['encontrado_en']),
      pending: json['pending'] == true,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'id_operacion_cliente': clientOperationId,
    'correlativo': correlative,
    'arbol_id': treeId,
    'campo_id': fieldId,
    'numero_arbol': treeNumber,
    'tipo_plaga': pest,
    'fecha': date.toIso8601String().split('T').first,
    'latitud': position.latitude,
    'longitud': position.longitude,
    'encontrada': found,
    'encontrado_en': foundAt,
    ...stages,
    'pending': pending,
  };
}

class DashboardData {
  const DashboardData({
    required this.fields,
    required this.trees,
    required this.pests,
    required this.monitorings,
    required this.fromCache,
  });

  final List<FieldBlock> fields;
  final List<TreeRecord> trees;
  final List<PestCatalog> pests;
  final List<MonitoringRecord> monitorings;
  final bool fromCache;
}

enum MonitoringMapMode { heat, points }
