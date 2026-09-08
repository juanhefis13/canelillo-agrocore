import 'package:supabase_flutter/supabase_flutter.dart';

import '../core/app_config.dart';
import '../models/models.dart';

class ProtocolAdminRepository {
  ProtocolAdminRepository(this.client);

  final SupabaseClient client;

  Future<bool> isCurrentUserAdmin() async {
    final user = client.auth.currentUser;
    if (user == null) return false;
    try {
      final result = await client
          .rpc(
            'monitoreo_usuario_tiene_rol',
            params: {
              'roles_permitidos': ['admin'],
            },
          )
          .timeout(AppConfig.networkTimeout);
      return result == true;
    } catch (_) {
      try {
        final row = await client
            .from('usuarios')
            .select('rol,activo')
            .eq('id', user.id)
            .maybeSingle()
            .timeout(AppConfig.networkTimeout);
        return row != null &&
            row['activo'] != false &&
            row['rol']?.toString().toLowerCase() == 'admin';
      } catch (_) {
        return false;
      }
    }
  }

  Future<AdminProtocolEditorData> loadEditorData() async {
    final responses = await Future.wait([
      client
          .from('protocolos_monitoreo')
          .select()
          .order('nombre')
          .order('version', ascending: false),
      client.from('plagas').select().order('nombre_comun'),
      client.from('estructuras_vegetales').select().order('nombre'),
      client.from('protocolo_estructuras').select().order('orden'),
    ]).timeout(AppConfig.networkTimeout);

    final rules = <String, List<AdminStructureRule>>{};
    for (final row in responses[3]) {
      final map = Map<String, dynamic>.from(row);
      final protocolId = map['protocolo_id']?.toString() ?? '';
      if (protocolId.isEmpty) continue;
      rules
          .putIfAbsent(protocolId, () => [])
          .add(AdminStructureRule.fromJson(map));
    }
    return AdminProtocolEditorData(
      protocols: responses[0]
          .map((row) => AdminProtocolRecord.fromJson(row))
          .toList(),
      pests: responses[1]
          .map(
            (row) => AdminCatalogItem.fromJson(row, nameColumn: 'nombre_comun'),
          )
          .toList(),
      structures: responses[2]
          .map((row) => AdminCatalogItem.fromJson(row))
          .toList(),
      structureRules: rules,
    );
  }

  Future<String> createProtocolVersion(ProtocolVersionInput input) async {
    final response = await client
        .rpc(
          'crear_version_protocolo_monitoreo',
          params: {
            'p_protocolo_origen_id': input.sourceProtocolId,
            'p_plaga_id': input.pestId,
            'p_cultivo_referencia': input.crop,
            'p_nombre': input.name,
            'p_descripcion': input.description.trim().isEmpty
                ? null
                : input.description.trim(),
            'p_requiere_lupa': input.requiresMagnifier,
            'p_instrucciones': input.instructions.trim().isEmpty
                ? null
                : input.instructions.trim(),
            'p_frecuencia_dias': input.frequencyDays,
            'p_estructuras': input.structures
                .map((rule) => rule.toJson())
                .toList(),
          },
        )
        .timeout(AppConfig.writeTimeout);
    return response?.toString() ?? '';
  }

  Future<void> setProtocolActive(String id, bool active) => client
      .rpc(
        'establecer_protocolo_monitoreo_activo',
        params: {'p_protocolo_id': id, 'p_activo': active},
      )
      .timeout(AppConfig.writeTimeout);

  Future<List<AdminCatalogItem>> loadCatalog(String table) async {
    _checkCatalogTable(table);
    final nameColumn = table == 'plagas' ? 'nombre_comun' : 'nombre';
    final rows = await client.from(table).select().order(nameColumn);
    return rows
        .map(
          (row) => AdminCatalogItem.fromJson(
            Map<String, dynamic>.from(row),
            nameColumn: nameColumn,
          ),
        )
        .toList();
  }

  Future<void> setCatalogActive(String table, String id, bool active) {
    _checkCatalogTable(table);
    return client
        .from(table)
        .update({'activo': active})
        .eq('id', id)
        .timeout(AppConfig.writeTimeout);
  }

  Future<void> addCatalogItem(
    String table,
    String name, {
    String? scientificName,
  }) {
    _checkCatalogTable(table);
    final row = table == 'plagas'
        ? {
            'nombre_comun': name.trim(),
            'nombre_cientifico': scientificName?.trim().isEmpty == true
                ? null
                : scientificName?.trim(),
          }
        : {'nombre': name.trim()};
    return client.from(table).insert(row).timeout(AppConfig.writeTimeout);
  }

  void _checkCatalogTable(String table) {
    const allowed = {
      'plagas',
      'estructuras_vegetales',
      'estados_biologicos',
      'tipos_dano',
    };
    if (!allowed.contains(table)) {
      throw ArgumentError.value(table, 'table', 'Catalogo no permitido');
    }
  }
}
