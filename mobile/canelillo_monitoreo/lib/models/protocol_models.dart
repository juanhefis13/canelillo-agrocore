double _asDouble(dynamic value) => double.tryParse('$value') ?? 0;
int _asInt(dynamic value) => int.tryParse('$value') ?? 0;
String _asText(dynamic value) => value?.toString().trim() ?? '';
bool _asBool(dynamic value) => value == true;

enum VisitStatus {
  draft('borrador'),
  inProgress('en_progreso'),
  completed('completado'),
  pendingSync('pendiente_sincronizacion'),
  syncError('error_sincronizacion');

  const VisitStatus(this.wireName);
  final String wireName;

  static VisitStatus fromWire(dynamic value) => values.firstWhere(
    (item) => item.wireName == value,
    orElse: () => VisitStatus.draft,
  );
}

enum ProtocolRecordStatus {
  draft('borrador'),
  inProgress('en_progreso'),
  completed('completado'),
  pendingSync('pendiente_sincronizacion'),
  syncError('error_sincronizacion'),
  pendingIdentification('pendiente_identificacion');

  const ProtocolRecordStatus(this.wireName);
  final String wireName;

  static ProtocolRecordStatus fromWire(dynamic value) => values.firstWhere(
    (item) => item.wireName == value,
    orElse: () => ProtocolRecordStatus.draft,
  );
}

class CatalogItem {
  const CatalogItem({required this.id, required this.name});

  final String id;
  final String name;

  factory CatalogItem.fromJson(Map<String, dynamic> json) => CatalogItem(
    id: _asText(json['id']).isNotEmpty
        ? _asText(json['id'])
        : _asText(json['codigo']),
    name: _asText(json['nombre']),
  );

  Map<String, dynamic> toJson() => {'id': id, 'nombre': name};
}

class ProtocolPest {
  const ProtocolPest({
    required this.id,
    required this.name,
    required this.scientificName,
  });

  final String id;
  final String name;
  final String scientificName;

  factory ProtocolPest.fromJson(Map<String, dynamic> json) => ProtocolPest(
    id: _asText(json['id']),
    name: _asText(json['nombre_comun']),
    scientificName: _asText(json['nombre_cientifico']),
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'nombre_comun': name,
    'nombre_cientifico': scientificName,
  };
}

class MonitoringAttributeDefinition {
  const MonitoringAttributeDefinition({
    required this.id,
    required this.code,
    required this.name,
    required this.responseType,
    required this.options,
  });

  final String id;
  final String code;
  final String name;
  final String responseType;
  final List<String> options;

  factory MonitoringAttributeDefinition.fromJson(Map<String, dynamic> json) {
    final options = json['opciones'];
    return MonitoringAttributeDefinition(
      id: _asText(json['id']),
      code: _asText(json['codigo']),
      name: _asText(json['nombre']),
      responseType: _asText(json['tipo_respuesta']),
      options: options is List
          ? options.map((item) => _asText(item)).toList()
          : const [],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'codigo': code,
    'nombre': name,
    'tipo_respuesta': responseType,
    'opciones': options,
  };
}

class MonitoringProtocol {
  const MonitoringProtocol({
    required this.id,
    required this.pestId,
    required this.crop,
    required this.name,
    required this.version,
    required this.requiresMagnifier,
    required this.instructions,
  });

  final String id;
  final String pestId;
  final String crop;
  final String name;
  final int version;
  final bool requiresMagnifier;
  final String instructions;

  factory MonitoringProtocol.fromJson(Map<String, dynamic> json) =>
      MonitoringProtocol(
        id: _asText(json['id']),
        pestId: _asText(json['plaga_id']),
        crop: _asText(json['cultivo_referencia']),
        name: _asText(json['nombre']),
        version: _asInt(json['version']),
        requiresMagnifier: _asBool(json['requiere_lupa']),
        instructions: _asText(json['instrucciones']),
      );

  Map<String, dynamic> toJson() => {
    'id': id,
    'plaga_id': pestId,
    'cultivo_referencia': crop,
    'nombre': name,
    'version': version,
    'requiere_lupa': requiresMagnifier,
    'instrucciones': instructions,
  };
}

class ProtocolStructureRule {
  const ProtocolStructureRule({
    required this.id,
    required this.protocolId,
    required this.structureId,
    required this.quantity,
    required this.order,
    required this.required,
    required this.instructions,
  });

  final String id;
  final String protocolId;
  final String structureId;
  final int quantity;
  final int order;
  final bool required;
  final String instructions;

  factory ProtocolStructureRule.fromJson(Map<String, dynamic> json) =>
      ProtocolStructureRule(
        id: _asText(json['id']),
        protocolId: _asText(json['protocolo_id']),
        structureId: _asText(json['estructura_id']),
        quantity: _asInt(json['cantidad_revisar']),
        order: _asInt(json['orden']),
        required: json['obligatorio'] != false,
        instructions: _asText(json['instrucciones']),
      );

  Map<String, dynamic> toJson() => {
    'id': id,
    'protocolo_id': protocolId,
    'estructura_id': structureId,
    'cantidad_revisar': quantity,
    'orden': order,
    'obligatorio': required,
    'instrucciones': instructions,
  };
}

class ProtocolAttributeRule {
  const ProtocolAttributeRule({
    required this.id,
    required this.protocolId,
    required this.structureId,
    required this.attributeId,
    required this.required,
    required this.order,
  });

  final String id;
  final String protocolId;
  final String? structureId;
  final String attributeId;
  final bool required;
  final int order;

  factory ProtocolAttributeRule.fromJson(Map<String, dynamic> json) =>
      ProtocolAttributeRule(
        id: _asText(json['id']),
        protocolId: _asText(json['protocolo_id']),
        structureId: _asText(json['estructura_id']).isEmpty
            ? null
            : _asText(json['estructura_id']),
        attributeId: _asText(json['atributo_id']),
        required: _asBool(json['obligatorio']),
        order: _asInt(json['orden']),
      );

  Map<String, dynamic> toJson() => {
    'id': id,
    'protocolo_id': protocolId,
    'estructura_id': structureId,
    'atributo_id': attributeId,
    'obligatorio': required,
    'orden': order,
  };
}

class PestBiologicalState {
  const PestBiologicalState({
    required this.pestId,
    required this.stateId,
    required this.order,
  });

  final String pestId;
  final String stateId;
  final int order;

  factory PestBiologicalState.fromJson(Map<String, dynamic> json) =>
      PestBiologicalState(
        pestId: _asText(json['plaga_id']),
        stateId: _asText(json['estado_biologico_id']),
        order: _asInt(json['orden']),
      );

  Map<String, dynamic> toJson() => {
    'plaga_id': pestId,
    'estado_biologico_id': stateId,
    'orden': order,
  };
}

class ProtocolCatalogBundle {
  const ProtocolCatalogBundle({
    required this.pests,
    required this.structures,
    required this.biologicalStates,
    required this.damageTypes,
    required this.naturalEnemies,
    required this.attributes,
    required this.protocols,
    required this.structureRules,
    required this.attributeRules,
    required this.pestStates,
    required this.phenologies,
    required this.fromCache,
  });

  final List<ProtocolPest> pests;
  final List<CatalogItem> structures;
  final List<CatalogItem> biologicalStates;
  final List<CatalogItem> damageTypes;
  final List<CatalogItem> naturalEnemies;
  final List<MonitoringAttributeDefinition> attributes;
  final List<MonitoringProtocol> protocols;
  final List<ProtocolStructureRule> structureRules;
  final List<ProtocolAttributeRule> attributeRules;
  final List<PestBiologicalState> pestStates;
  final List<CatalogItem> phenologies;
  final bool fromCache;

  bool get isEmpty => protocols.isEmpty || pests.isEmpty;

  List<ProtocolStructureRule> structuresFor(String protocolId) =>
      structureRules.where((item) => item.protocolId == protocolId).toList()
        ..sort((a, b) => a.order.compareTo(b.order));

  Map<String, dynamic> toJson() => {
    'plagas': pests.map((item) => item.toJson()).toList(),
    'estructuras': structures.map((item) => item.toJson()).toList(),
    'estados': biologicalStates.map((item) => item.toJson()).toList(),
    'danos': damageTypes.map((item) => item.toJson()).toList(),
    'enemigos': naturalEnemies.map((item) => item.toJson()).toList(),
    'atributos': attributes.map((item) => item.toJson()).toList(),
    'protocolos': protocols.map((item) => item.toJson()).toList(),
    'reglas_estructura': structureRules.map((item) => item.toJson()).toList(),
    'reglas_atributo': attributeRules.map((item) => item.toJson()).toList(),
    'plaga_estados': pestStates.map((item) => item.toJson()).toList(),
    'fenologias': phenologies.map((item) => item.toJson()).toList(),
  };

  factory ProtocolCatalogBundle.fromJson(
    Map<String, dynamic> json, {
    bool fromCache = true,
  }) => ProtocolCatalogBundle(
    pests: _maps(json['plagas']).map(ProtocolPest.fromJson).toList(),
    structures: _maps(json['estructuras']).map(CatalogItem.fromJson).toList(),
    biologicalStates: _maps(json['estados']).map(CatalogItem.fromJson).toList(),
    damageTypes: _maps(json['danos']).map(CatalogItem.fromJson).toList(),
    naturalEnemies: _maps(json['enemigos']).map(CatalogItem.fromJson).toList(),
    attributes: _maps(
      json['atributos'],
    ).map(MonitoringAttributeDefinition.fromJson).toList(),
    protocols: _maps(
      json['protocolos'],
    ).map(MonitoringProtocol.fromJson).toList(),
    structureRules: _maps(
      json['reglas_estructura'],
    ).map(ProtocolStructureRule.fromJson).toList(),
    attributeRules: _maps(
      json['reglas_atributo'],
    ).map(ProtocolAttributeRule.fromJson).toList(),
    pestStates: _maps(
      json['plaga_estados'],
    ).map(PestBiologicalState.fromJson).toList(),
    phenologies: _maps(json['fenologias']).map(CatalogItem.fromJson).toList(),
    fromCache: fromCache,
  );

  static List<Map<String, dynamic>> _maps(dynamic value) => value is List
      ? value.map((item) => Map<String, dynamic>.from(item as Map)).toList()
      : const [];
}

class BiologicalStateCount {
  const BiologicalStateCount({required this.stateId, required this.quantity});
  final String stateId;
  final double quantity;

  factory BiologicalStateCount.fromJson(Map<String, dynamic> json) =>
      BiologicalStateCount(
        stateId: _asText(json['estado_biologico_id']),
        quantity: _asDouble(json['cantidad']),
      );

  Map<String, dynamic> toJson() => {
    'estado_biologico_id': stateId,
    'cantidad': quantity,
  };
}

class DamageObservation {
  const DamageObservation({required this.damageTypeId, required this.severity});
  final String damageTypeId;
  final String severity;

  factory DamageObservation.fromJson(Map<String, dynamic> json) =>
      DamageObservation(
        damageTypeId: _asText(json['tipo_dano_id']),
        severity: _asText(json['severidad']),
      );

  Map<String, dynamic> toJson() => {
    'tipo_dano_id': damageTypeId,
    'severidad': severity,
  };
}

class NaturalEnemyObservation {
  const NaturalEnemyObservation({
    required this.enemyId,
    required this.present,
    this.quantity,
  });
  final String enemyId;
  final bool present;
  final double? quantity;

  factory NaturalEnemyObservation.fromJson(Map<String, dynamic> json) =>
      NaturalEnemyObservation(
        enemyId: _asText(json['enemigo_natural_id']),
        present: json['presente'] != false,
        quantity: json['cantidad'] == null ? null : _asDouble(json['cantidad']),
      );

  Map<String, dynamic> toJson() => {
    'enemigo_natural_id': enemyId,
    'presente': present,
    'cantidad': quantity,
  };
}

class AttributeObservation {
  const AttributeObservation({
    required this.id,
    required this.attributeId,
    required this.value,
    this.structureSampleId,
    this.unitId,
  });

  final String id;
  final String attributeId;
  final dynamic value;
  final String? structureSampleId;
  final String? unitId;

  factory AttributeObservation.fromJson(Map<String, dynamic> json) =>
      AttributeObservation(
        id: _asText(json['id']),
        attributeId: _asText(json['atributo_id']),
        value: json['valor'],
        structureSampleId: _nullableText(json['monitoreo_estructura_id']),
        unitId: _nullableText(json['unidad_id']),
      );

  Map<String, dynamic> toJson() => {
    'id': id,
    'atributo_id': attributeId,
    'valor': value,
    'monitoreo_estructura_id': structureSampleId,
    'unidad_id': unitId,
  };
}

class PhotoEvidence {
  const PhotoEvidence({
    required this.id,
    required this.clientOperationId,
    required this.localPath,
    required this.mimeType,
    required this.sizeBytes,
    required this.createdAt,
  });

  final String id;
  final String clientOperationId;
  final String localPath;
  final String mimeType;
  final int sizeBytes;
  final DateTime createdAt;

  factory PhotoEvidence.fromJson(Map<String, dynamic> json) => PhotoEvidence(
    id: _asText(json['id']),
    clientOperationId: _asText(json['id_operacion_cliente']),
    localPath: _asText(json['ruta_local']),
    mimeType: _asText(json['mime_type']),
    sizeBytes: _asInt(json['tamano_bytes']),
    createdAt: DateTime.tryParse(_asText(json['creado_en'])) ?? DateTime.now(),
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'id_operacion_cliente': clientOperationId,
    'ruta_local': localPath,
    'mime_type': mimeType,
    'tamano_bytes': sizeBytes,
    'creado_en': createdAt.toIso8601String(),
  };
}

class SamplingUnit {
  const SamplingUnit({
    required this.id,
    required this.clientOperationId,
    required this.number,
    required this.positive,
    required this.stateCounts,
    required this.damages,
    required this.naturalEnemies,
    required this.attributes,
    this.photos = const [],
    this.abundanceCategory,
    this.severity,
    this.notes,
  });

  final String id;
  final String clientOperationId;
  final int number;
  final bool positive;
  final List<BiologicalStateCount> stateCounts;
  final List<DamageObservation> damages;
  final List<NaturalEnemyObservation> naturalEnemies;
  final List<AttributeObservation> attributes;
  final List<PhotoEvidence> photos;
  final String? abundanceCategory;
  final String? severity;
  final String? notes;

  bool get hasPestPresence =>
      positive || stateCounts.any((state) => state.quantity > 0);

  factory SamplingUnit.fromJson(Map<String, dynamic> json) => SamplingUnit(
    id: _asText(json['id']),
    clientOperationId: _asText(json['id_operacion_cliente']),
    number: _asInt(json['numero_unidad']),
    positive: _asBool(json['positivo']),
    stateCounts: ProtocolCatalogBundle._maps(
      json['estados'],
    ).map(BiologicalStateCount.fromJson).toList(),
    damages: ProtocolCatalogBundle._maps(
      json['danos'],
    ).map(DamageObservation.fromJson).toList(),
    naturalEnemies: ProtocolCatalogBundle._maps(
      json['enemigos'],
    ).map(NaturalEnemyObservation.fromJson).toList(),
    attributes: ProtocolCatalogBundle._maps(
      json['atributos'],
    ).map(AttributeObservation.fromJson).toList(),
    photos: ProtocolCatalogBundle._maps(
      json['fotografias'],
    ).map(PhotoEvidence.fromJson).toList(),
    abundanceCategory: _nullableText(json['abundancia_categoria']),
    severity: _nullableText(json['severidad']),
    notes: _nullableText(json['observaciones']),
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'id_operacion_cliente': clientOperationId,
    'numero_unidad': number,
    'positivo': hasPestPresence,
    'abundancia_categoria': abundanceCategory,
    'severidad': severity,
    'observaciones': notes,
    'estados': stateCounts.map((item) => item.toJson()).toList(),
    'danos': damages.map((item) => item.toJson()).toList(),
    'enemigos': naturalEnemies.map((item) => item.toJson()).toList(),
    'atributos': attributes.map((item) => item.toJson()).toList(),
    'fotografias': photos.map((item) => item.toJson()).toList(),
  };
}

class StructureSample {
  const StructureSample({
    required this.id,
    required this.structureId,
    required this.plannedQuantity,
    required this.structureNameSnapshot,
    required this.units,
    required this.attributes,
    this.instructionsSnapshot,
    this.notEvaluable = false,
    this.notEvaluableReason,
  });

  final String id;
  final String structureId;
  final int plannedQuantity;
  final String structureNameSnapshot;
  final List<SamplingUnit> units;
  final List<AttributeObservation> attributes;
  final String? instructionsSnapshot;
  final bool notEvaluable;
  final String? notEvaluableReason;

  int get reviewedQuantity => notEvaluable ? 0 : units.length;
  int get positiveQuantity =>
      notEvaluable ? 0 : units.where((unit) => unit.hasPestPresence).length;
  double? get incidencePercentage => notEvaluable || reviewedQuantity == 0
      ? null
      : positiveQuantity * 100 / reviewedQuantity;

  factory StructureSample.fromJson(Map<String, dynamic> json) =>
      StructureSample(
        id: _asText(json['id']),
        structureId: _asText(json['estructura_id']),
        plannedQuantity: _asInt(json['cantidad_programada']),
        structureNameSnapshot: _asText(json['estructura_nombre_snapshot']),
        units: ProtocolCatalogBundle._maps(
          json['unidades'],
        ).map(SamplingUnit.fromJson).toList(),
        attributes: ProtocolCatalogBundle._maps(
          json['atributos'],
        ).map(AttributeObservation.fromJson).toList(),
        instructionsSnapshot: _nullableText(json['instrucciones_snapshot']),
        notEvaluable: _asBool(json['no_evaluable']),
        notEvaluableReason: _nullableText(json['motivo_no_evaluable']),
      );

  Map<String, dynamic> toJson() => {
    'id': id,
    'estructura_id': structureId,
    'cantidad_programada': plannedQuantity,
    'cantidad_revisada': reviewedQuantity,
    'cantidad_positiva': positiveQuantity,
    'estructura_nombre_snapshot': structureNameSnapshot,
    'instrucciones_snapshot': instructionsSnapshot,
    'no_evaluable': notEvaluable,
    'motivo_no_evaluable': notEvaluableReason,
    'unidades': units.map((item) => item.toJson()).toList(),
    'atributos': attributes.map((item) => item.toJson()).toList(),
  };
}

class ProtocolPestObservation {
  const ProtocolPestObservation({
    required this.id,
    required this.clientOperationId,
    required this.pestId,
    required this.pestName,
    required this.protocolId,
    required this.protocolVersion,
    required this.structures,
    required this.attributes,
    this.notes,
  });

  final String id;
  final String clientOperationId;
  final String pestId;
  final String pestName;
  final String protocolId;
  final int protocolVersion;
  final List<StructureSample> structures;
  final List<AttributeObservation> attributes;
  final String? notes;

  bool get found => structures.any((item) => item.positiveQuantity > 0);

  factory ProtocolPestObservation.fromJson(Map<String, dynamic> json) =>
      ProtocolPestObservation(
        id: _asText(json['id']),
        clientOperationId: _asText(json['id_operacion_cliente']),
        pestId: _asText(json['plaga_id']),
        pestName: _asText(json['tipo_plaga']),
        protocolId: _asText(json['protocolo_id']),
        protocolVersion: _asInt(json['protocolo_version']),
        structures: ProtocolCatalogBundle._maps(
          json['estructuras'],
        ).map(StructureSample.fromJson).toList(),
        attributes: ProtocolCatalogBundle._maps(
          json['atributos'],
        ).map(AttributeObservation.fromJson).toList(),
        notes: _nullableText(json['observaciones']),
      );

  Map<String, dynamic> toJson() => {
    'id': id,
    'id_operacion_cliente': clientOperationId,
    'plaga_id': pestId,
    'tipo_plaga': pestName,
    'protocolo_id': protocolId,
    'protocolo_version': protocolVersion,
    'encontrada': found,
    'observaciones': notes,
    'estructuras': structures.map((item) => item.toJson()).toList(),
    'atributos': attributes.map((item) => item.toJson()).toList(),
  };
}

class TreeMonitoringDraft {
  const TreeMonitoringDraft({
    required this.treeId,
    required this.treeNumber,
    required this.latitude,
    required this.longitude,
    required this.pestObservations,
    required this.completedAt,
  });

  final String treeId;
  final String treeNumber;
  final double latitude;
  final double longitude;
  final List<ProtocolPestObservation> pestObservations;
  final DateTime? completedAt;

  bool get isComplete =>
      pestObservations.isNotEmpty &&
      pestObservations.every(
        (monitoring) => monitoring.structures.every(
          (structure) =>
              structure.notEvaluable ||
              structure.units.length == structure.plannedQuantity,
        ),
      );

  factory TreeMonitoringDraft.fromJson(Map<String, dynamic> json) =>
      TreeMonitoringDraft(
        treeId: _asText(json['arbol_id']),
        treeNumber: _asText(json['numero_arbol']),
        latitude: _asDouble(json['latitud']),
        longitude: _asDouble(json['longitud']),
        pestObservations: ProtocolCatalogBundle._maps(
          json['monitoreos'],
        ).map(ProtocolPestObservation.fromJson).toList(),
        completedAt: DateTime.tryParse(_asText(json['finalizado_en'])),
      );

  Map<String, dynamic> toJson() => {
    'arbol_id': treeId,
    'numero_arbol': treeNumber,
    'latitud': latitude,
    'longitud': longitude,
    'monitoreos': pestObservations.map((item) => item.toJson()).toList(),
    'finalizado_en': completedAt?.toIso8601String(),
  };
}

class VisitDraft {
  const VisitDraft({
    required this.id,
    required this.clientOperationId,
    required this.fieldId,
    required this.treeId,
    required this.treeNumber,
    required this.startedAt,
    required this.latitude,
    required this.longitude,
    required this.phenology,
    required this.status,
    required this.observations,
    required this.pestObservations,
    required this.updatedAt,
    this.treeMonitorings = const [],
    this.finishedAt,
    this.deviceId,
    this.createdBy,
  });

  final String id;
  final String clientOperationId;
  final String fieldId;
  final String treeId;
  final String treeNumber;
  final DateTime startedAt;
  final DateTime? finishedAt;
  final double latitude;
  final double longitude;
  final String phenology;
  final VisitStatus status;
  final String observations;
  final List<ProtocolPestObservation> pestObservations;
  final List<TreeMonitoringDraft> treeMonitorings;
  final DateTime updatedAt;
  final String? deviceId;
  final String? createdBy;

  VisitDraft copyWith({
    String? id,
    String? clientOperationId,
    String? fieldId,
    String? treeId,
    String? treeNumber,
    DateTime? startedAt,
    DateTime? finishedAt,
    double? latitude,
    double? longitude,
    String? phenology,
    VisitStatus? status,
    String? observations,
    List<ProtocolPestObservation>? pestObservations,
    List<TreeMonitoringDraft>? treeMonitorings,
    DateTime? updatedAt,
    String? deviceId,
    String? createdBy,
  }) => VisitDraft(
    id: id ?? this.id,
    clientOperationId: clientOperationId ?? this.clientOperationId,
    fieldId: fieldId ?? this.fieldId,
    treeId: treeId ?? this.treeId,
    treeNumber: treeNumber ?? this.treeNumber,
    startedAt: startedAt ?? this.startedAt,
    finishedAt: finishedAt ?? this.finishedAt,
    latitude: latitude ?? this.latitude,
    longitude: longitude ?? this.longitude,
    phenology: phenology ?? this.phenology,
    status: status ?? this.status,
    observations: observations ?? this.observations,
    pestObservations: pestObservations ?? this.pestObservations,
    treeMonitorings: treeMonitorings ?? this.treeMonitorings,
    updatedAt: updatedAt ?? this.updatedAt,
    deviceId: deviceId ?? this.deviceId,
    createdBy: createdBy ?? this.createdBy,
  );

  factory VisitDraft.fromJson(Map<String, dynamic> json) {
    final monitorings = ProtocolCatalogBundle._maps(
      json['monitoreos'],
    ).map(ProtocolPestObservation.fromJson).toList();
    final trees = ProtocolCatalogBundle._maps(
      json['arboles'],
    ).map(TreeMonitoringDraft.fromJson).toList();
    final treeId = _asText(json['arbol_id']);
    if (trees.isEmpty && treeId.isNotEmpty && monitorings.isNotEmpty) {
      trees.add(
        TreeMonitoringDraft(
          treeId: treeId,
          treeNumber: _asText(json['numero_arbol']),
          latitude: _asDouble(json['latitud']),
          longitude: _asDouble(json['longitud']),
          pestObservations: monitorings,
          completedAt: DateTime.tryParse(_asText(json['fecha_hora_fin'])),
        ),
      );
    }
    return VisitDraft(
      id: _asText(json['id']),
      clientOperationId: _asText(json['id_operacion_cliente']),
      fieldId: _asText(json['campo_id']),
      treeId: treeId,
      treeNumber: _asText(json['numero_arbol']),
      startedAt:
          DateTime.tryParse(_asText(json['fecha_hora_inicio'])) ??
          DateTime.now(),
      finishedAt: DateTime.tryParse(_asText(json['fecha_hora_fin'])),
      latitude: _asDouble(json['latitud']),
      longitude: _asDouble(json['longitud']),
      phenology: _asText(json['fenologia']),
      status: VisitStatus.fromWire(json['estado']),
      observations: _asText(json['observaciones']),
      pestObservations: monitorings,
      treeMonitorings: trees,
      updatedAt:
          DateTime.tryParse(_asText(json['actualizado_en'])) ?? DateTime.now(),
      deviceId: _nullableText(json['dispositivo_id']),
      createdBy: _nullableText(json['creado_por']),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'id_operacion_cliente': clientOperationId,
    'campo_id': fieldId,
    'arbol_id': treeId,
    'numero_arbol': treeNumber,
    'fecha_hora_inicio': startedAt.toIso8601String(),
    'fecha_hora_fin': finishedAt?.toIso8601String(),
    'latitud': latitude,
    'longitud': longitude,
    'fenologia': phenology,
    'estado': status.wireName,
    'observaciones': observations,
    'monitoreos': pestObservations.map((item) => item.toJson()).toList(),
    'arboles': treeMonitorings.map((item) => item.toJson()).toList(),
    'actualizado_en': updatedAt.toIso8601String(),
    'dispositivo_id': deviceId,
    'creado_por': createdBy,
  };
}

String? _nullableText(dynamic value) {
  final text = _asText(value);
  return text.isEmpty ? null : text;
}
