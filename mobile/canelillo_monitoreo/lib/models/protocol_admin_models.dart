class AdminCatalogItem {
  const AdminCatalogItem({
    required this.id,
    required this.name,
    required this.active,
    this.scientificName = '',
  });

  final String id;
  final String name;
  final String scientificName;
  final bool active;

  factory AdminCatalogItem.fromJson(
    Map<String, dynamic> json, {
    String nameColumn = 'nombre',
  }) => AdminCatalogItem(
    id: json['id']?.toString() ?? '',
    name: json[nameColumn]?.toString().trim() ?? '',
    scientificName: json['nombre_cientifico']?.toString().trim() ?? '',
    active: json['activo'] != false,
  );
}

class AdminProtocolRecord {
  const AdminProtocolRecord({
    required this.id,
    required this.pestId,
    required this.crop,
    required this.name,
    required this.description,
    required this.version,
    required this.requiresMagnifier,
    required this.instructions,
    required this.frequencyDays,
    required this.active,
  });

  final String id;
  final String pestId;
  final String crop;
  final String name;
  final String description;
  final int version;
  final bool requiresMagnifier;
  final String instructions;
  final int? frequencyDays;
  final bool active;

  factory AdminProtocolRecord.fromJson(Map<String, dynamic> json) =>
      AdminProtocolRecord(
        id: json['id']?.toString() ?? '',
        pestId: json['plaga_id']?.toString() ?? '',
        crop: json['cultivo_referencia']?.toString() ?? '',
        name: json['nombre']?.toString().trim() ?? '',
        description: json['descripcion']?.toString().trim() ?? '',
        version: int.tryParse('${json['version']}') ?? 1,
        requiresMagnifier: json['requiere_lupa'] == true,
        instructions: json['instrucciones']?.toString().trim() ?? '',
        frequencyDays: int.tryParse('${json['frecuencia_dias']}'),
        active: json['activo'] != false,
      );
}

class AdminStructureRule {
  const AdminStructureRule({
    required this.structureId,
    required this.quantity,
    required this.order,
    required this.required,
    required this.instructions,
  });

  final String structureId;
  final int quantity;
  final int order;
  final bool required;
  final String instructions;

  factory AdminStructureRule.fromJson(Map<String, dynamic> json) =>
      AdminStructureRule(
        structureId: json['estructura_id']?.toString() ?? '',
        quantity: int.tryParse('${json['cantidad_revisar']}') ?? 0,
        order: int.tryParse('${json['orden']}') ?? 0,
        required: json['obligatorio'] != false,
        instructions: json['instrucciones']?.toString().trim() ?? '',
      );

  Map<String, dynamic> toJson() => {
    'estructura_id': structureId,
    'cantidad_revisar': quantity,
    'orden': order,
    'obligatorio': required,
    'instrucciones': instructions.trim().isEmpty ? null : instructions.trim(),
  };
}

class AdminProtocolEditorData {
  const AdminProtocolEditorData({
    required this.protocols,
    required this.pests,
    required this.structures,
    required this.structureRules,
  });

  final List<AdminProtocolRecord> protocols;
  final List<AdminCatalogItem> pests;
  final List<AdminCatalogItem> structures;
  final Map<String, List<AdminStructureRule>> structureRules;
}

class ProtocolVersionInput {
  const ProtocolVersionInput({
    this.sourceProtocolId,
    required this.pestId,
    required this.crop,
    required this.name,
    required this.description,
    required this.requiresMagnifier,
    required this.instructions,
    required this.frequencyDays,
    required this.structures,
  });

  final String? sourceProtocolId;
  final String pestId;
  final String crop;
  final String name;
  final String description;
  final bool requiresMagnifier;
  final String instructions;
  final int? frequencyDays;
  final List<AdminStructureRule> structures;
}
