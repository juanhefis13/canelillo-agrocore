import 'package:flutter/material.dart';

import '../core/app_theme.dart';
import '../models/models.dart';
import '../services/protocol_admin_repository.dart';
import '../widgets/loading_overlay.dart';

class ProtocolAdminScreen extends StatefulWidget {
  const ProtocolAdminScreen({super.key, required this.repository});

  final ProtocolAdminRepository repository;

  @override
  State<ProtocolAdminScreen> createState() => _ProtocolAdminScreenState();
}

class _ProtocolAdminScreenState extends State<ProtocolAdminScreen> {
  AdminProtocolEditorData? _data;
  bool _loading = true;
  bool _saving = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      if (!await widget.repository.isCurrentUserAdmin()) {
        throw StateError('Esta sección requiere rol de administrador.');
      }
      final data = await widget.repository.loadEditorData();
      if (mounted) setState(() => _data = data);
    } catch (error) {
      if (mounted) setState(() => _error = '$error');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _editProtocol([AdminProtocolRecord? protocol]) async {
    final data = _data;
    if (data == null) return;
    if (protocol == null &&
        (!data.pests.any((item) => item.active) ||
            !data.structures.any((item) => item.active))) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Activa al menos una plaga y una estructura antes de crear el protocolo.',
          ),
        ),
      );
      return;
    }
    final saved = await Navigator.push<bool>(
      context,
      MaterialPageRoute(
        builder: (_) => ProtocolVersionEditorScreen(
          repository: widget.repository,
          data: data,
          protocol: protocol,
        ),
      ),
    );
    if (saved == true) await _load();
  }

  Future<void> _toggleProtocol(
    AdminProtocolRecord protocol,
    bool active,
  ) async {
    setState(() => _saving = true);
    try {
      await widget.repository.setProtocolActive(protocol.id, active);
      await _load();
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('No se pudo actualizar: $error')),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) => DefaultTabController(
    length: 2,
    child: LoadingOverlay(
      loading: _saving,
      message: 'Actualizando configuración...',
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Configuración de monitoreo'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Protocolos', icon: Icon(Icons.fact_check_outlined)),
              Tab(text: 'Catálogos', icon: Icon(Icons.tune_outlined)),
            ],
          ),
        ),
        body: _body(),
      ),
    ),
  );

  Widget _body() {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_error != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.admin_panel_settings_outlined, size: 52),
              const SizedBox(height: 12),
              Text(_error!, textAlign: TextAlign.center),
              const SizedBox(height: 16),
              FilledButton(onPressed: _load, child: const Text('Reintentar')),
            ],
          ),
        ),
      );
    }
    final data = _data!;
    return TabBarView(
      children: [
        _ProtocolList(
          data: data,
          onEdit: _editProtocol,
          onToggle: _toggleProtocol,
          onRefresh: _load,
          onCreate: () => _editProtocol(),
        ),
        _CatalogManager(repository: widget.repository),
      ],
    );
  }
}

class _ProtocolList extends StatelessWidget {
  const _ProtocolList({
    required this.data,
    required this.onEdit,
    required this.onToggle,
    required this.onRefresh,
    required this.onCreate,
  });

  final AdminProtocolEditorData data;
  final ValueChanged<AdminProtocolRecord> onEdit;
  final void Function(AdminProtocolRecord, bool) onToggle;
  final Future<void> Function() onRefresh;
  final VoidCallback onCreate;

  @override
  Widget build(BuildContext context) {
    final pestNames = {for (final pest in data.pests) pest.id: pest.name};
    return RefreshIndicator(
      onRefresh: onRefresh,
      child: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: data.protocols.length + 1,
        itemBuilder: (context, index) {
          if (index == 0) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: FilledButton.icon(
                onPressed: onCreate,
                icon: const Icon(Icons.add),
                label: const Text('Nuevo protocolo'),
              ),
            );
          }
          final protocol = data.protocols[index - 1];
          final rules = data.structureRules[protocol.id] ?? const [];
          return Card(
            margin: const EdgeInsets.only(bottom: 8),
            child: Padding(
              padding: const EdgeInsets.fromLTRB(14, 12, 10, 12),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 42,
                    height: 42,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: protocol.active
                          ? const Color(0xFFE1F3EA)
                          : const Color(0xFFF0F2F1),
                      borderRadius: BorderRadius.circular(7),
                    ),
                    child: Text(
                      'v${protocol.version}',
                      style: const TextStyle(
                        fontWeight: FontWeight.w900,
                        color: AppColors.forest,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          protocol.name,
                          style: const TextStyle(
                            fontWeight: FontWeight.w900,
                            color: AppColors.navy,
                          ),
                        ),
                        Text(
                          '${pestNames[protocol.pestId] ?? 'Plaga'} · ${protocol.crop} · ${rules.length} estructuras',
                          style: const TextStyle(
                            fontSize: 12,
                            color: Color(0xFF60736C),
                          ),
                        ),
                        if (protocol.frequencyDays != null)
                          Text(
                            'Frecuencia: cada ${protocol.frequencyDays} días',
                            style: const TextStyle(fontSize: 12),
                          ),
                        const SizedBox(height: 7),
                        OutlinedButton.icon(
                          onPressed: () => onEdit(protocol),
                          icon: const Icon(Icons.copy_all_outlined, size: 18),
                          label: const Text('Crear nueva versión'),
                        ),
                      ],
                    ),
                  ),
                  Switch(
                    value: protocol.active,
                    onChanged: (value) => onToggle(protocol, value),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class ProtocolVersionEditorScreen extends StatefulWidget {
  const ProtocolVersionEditorScreen({
    super.key,
    required this.repository,
    required this.data,
    this.protocol,
  });

  final ProtocolAdminRepository repository;
  final AdminProtocolEditorData data;
  final AdminProtocolRecord? protocol;

  @override
  State<ProtocolVersionEditorScreen> createState() =>
      _ProtocolVersionEditorScreenState();
}

class _ProtocolVersionEditorScreenState
    extends State<ProtocolVersionEditorScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _name;
  late final TextEditingController _description;
  late final TextEditingController _instructions;
  late final TextEditingController _frequency;
  late String _pestId;
  late String _crop;
  late bool _magnifier;
  late Map<String, _EditableStructure> _rules;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    final protocol = widget.protocol;
    _name = TextEditingController(text: protocol?.name);
    _description = TextEditingController(text: protocol?.description);
    _instructions = TextEditingController(text: protocol?.instructions);
    _frequency = TextEditingController(
      text: protocol?.frequencyDays?.toString() ?? '',
    );
    _pestId =
        protocol?.pestId ??
        widget.data.pests.where((item) => item.active).first.id;
    _crop = protocol?.crop ?? 'CITRICO';
    _magnifier = protocol?.requiresMagnifier ?? false;
    final existing = protocol == null
        ? const <AdminStructureRule>[]
        : widget.data.structureRules[protocol.id] ?? const [];
    _rules = {
      for (final structure in widget.data.structures)
        structure.id: _EditableStructure.fromRule(
          existing
              .where((rule) => rule.structureId == structure.id)
              .firstOrNull,
        ),
    };
  }

  @override
  void dispose() {
    _name.dispose();
    _description.dispose();
    _instructions.dispose();
    _frequency.dispose();
    for (final rule in _rules.values) {
      rule.quantity.dispose();
      rule.instructions.dispose();
    }
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    final selected = _rules.entries.where((entry) => entry.value.selected);
    if (selected.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Selecciona al menos una estructura.')),
      );
      return;
    }
    setState(() => _saving = true);
    try {
      var order = 0;
      final rules = <AdminStructureRule>[];
      for (final entry in selected) {
        rules.add(
          AdminStructureRule(
            structureId: entry.key,
            quantity: int.parse(entry.value.quantity.text),
            order: order++,
            required: entry.value.required,
            instructions: entry.value.instructions.text,
          ),
        );
      }
      await widget.repository.createProtocolVersion(
        ProtocolVersionInput(
          sourceProtocolId: widget.protocol?.id,
          pestId: _pestId,
          crop: _crop,
          name: _name.text,
          description: _description.text,
          requiresMagnifier: _magnifier,
          instructions: _instructions.text,
          frequencyDays: int.tryParse(_frequency.text),
          structures: rules,
        ),
      );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Nueva versión activa creada.')),
      );
      Navigator.pop(context, true);
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('No se pudo guardar: $error')));
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) => LoadingOverlay(
    loading: _saving,
    message: 'Creando versión del protocolo...',
    child: Scaffold(
      appBar: AppBar(
        title: Text(
          widget.protocol == null ? 'Nuevo protocolo' : 'Nueva versión',
        ),
        actions: [
          TextButton.icon(
            onPressed: _saving ? null : _save,
            icon: const Icon(Icons.save_outlined),
            label: const Text('Guardar'),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(14),
          children: [
            DropdownButtonFormField<String>(
              initialValue: _pestId,
              decoration: const InputDecoration(labelText: 'Plaga'),
              items: widget.data.pests
                  .where((item) => item.active || item.id == _pestId)
                  .map(
                    (item) => DropdownMenuItem(
                      value: item.id,
                      child: Text(item.name),
                    ),
                  )
                  .toList(),
              onChanged: widget.protocol == null
                  ? (value) => setState(() => _pestId = value ?? _pestId)
                  : null,
            ),
            const SizedBox(height: 10),
            SegmentedButton<String>(
              segments: const [
                ButtonSegment(value: 'CITRICO', label: Text('Cítrico')),
                ButtonSegment(value: 'PALTO', label: Text('Palto')),
              ],
              selected: {_crop},
              onSelectionChanged: widget.protocol == null
                  ? (value) => setState(() => _crop = value.first)
                  : null,
            ),
            const SizedBox(height: 10),
            TextFormField(
              controller: _name,
              enabled: widget.protocol == null,
              decoration: const InputDecoration(labelText: 'Nombre'),
              validator: (value) => value == null || value.trim().isEmpty
                  ? 'Ingresa un nombre'
                  : null,
            ),
            const SizedBox(height: 10),
            TextFormField(
              controller: _description,
              maxLines: 2,
              decoration: const InputDecoration(labelText: 'Descripción'),
            ),
            const SizedBox(height: 10),
            TextFormField(
              controller: _instructions,
              maxLines: 3,
              decoration: const InputDecoration(labelText: 'Instrucciones'),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _frequency,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Frecuencia (días)',
                    ),
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) return null;
                      final number = int.tryParse(value);
                      return number == null || number <= 0
                          ? 'Debe ser mayor que 0'
                          : null;
                    },
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: SwitchListTile.adaptive(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 8),
                    title: const Text('Requiere lupa'),
                    value: _magnifier,
                    onChanged: (value) => setState(() => _magnifier = value),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),
            const Text(
              'Unidades por estructura',
              style: TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.w900,
                color: AppColors.navy,
              ),
            ),
            const SizedBox(height: 6),
            for (final structure in widget.data.structures)
              if (structure.active || _rules[structure.id]!.selected)
                _StructureEditorTile(
                  name: structure.name,
                  value: _rules[structure.id]!,
                  onChanged: () => setState(() {}),
                ),
            const SizedBox(height: 80),
          ],
        ),
      ),
    ),
  );
}

class _EditableStructure {
  _EditableStructure({
    required this.selected,
    required this.required,
    required this.quantity,
    required this.instructions,
  });

  bool selected;
  bool required;
  final TextEditingController quantity;
  final TextEditingController instructions;

  factory _EditableStructure.fromRule(AdminStructureRule? rule) =>
      _EditableStructure(
        selected: rule != null,
        required: rule?.required ?? true,
        quantity: TextEditingController(
          text: rule == null ? '10' : '${rule.quantity}',
        ),
        instructions: TextEditingController(text: rule?.instructions),
      );
}

class _StructureEditorTile extends StatelessWidget {
  const _StructureEditorTile({
    required this.name,
    required this.value,
    required this.onChanged,
  });

  final String name;
  final _EditableStructure value;
  final VoidCallback onChanged;

  @override
  Widget build(BuildContext context) => Card(
    margin: const EdgeInsets.only(top: 8),
    child: Padding(
      padding: const EdgeInsets.all(10),
      child: Column(
        children: [
          Row(
            children: [
              Checkbox(
                value: value.selected,
                onChanged: (selected) {
                  value.selected = selected == true;
                  onChanged();
                },
              ),
              Expanded(
                child: Text(
                  name,
                  style: const TextStyle(fontWeight: FontWeight.w900),
                ),
              ),
              SizedBox(
                width: 92,
                child: TextFormField(
                  controller: value.quantity,
                  enabled: value.selected,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(labelText: 'Cantidad'),
                  validator: (text) {
                    if (!value.selected) return null;
                    final quantity = int.tryParse(text ?? '');
                    return quantity == null || quantity <= 0
                        ? 'Inválida'
                        : null;
                  },
                ),
              ),
            ],
          ),
          if (value.selected) ...[
            CheckboxListTile(
              dense: true,
              contentPadding: EdgeInsets.zero,
              title: const Text('Estructura obligatoria'),
              value: value.required,
              onChanged: (required) {
                value.required = required == true;
                onChanged();
              },
            ),
            TextFormField(
              controller: value.instructions,
              decoration: const InputDecoration(
                labelText: 'Instrucción específica',
              ),
            ),
          ],
        ],
      ),
    ),
  );
}

class _CatalogManager extends StatefulWidget {
  const _CatalogManager({required this.repository});
  final ProtocolAdminRepository repository;

  @override
  State<_CatalogManager> createState() => _CatalogManagerState();
}

class _CatalogManagerState extends State<_CatalogManager> {
  static const _tables = {
    'plagas': 'Plagas',
    'estructuras_vegetales': 'Estructuras',
    'estados_biologicos': 'Estados biológicos',
    'tipos_dano': 'Daños',
  };
  String _table = 'plagas';
  List<AdminCatalogItem>? _items;
  bool _loading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final items = await widget.repository.loadCatalog(_table);
      if (mounted) setState(() => _items = items);
    } catch (error) {
      if (mounted) setState(() => _error = '$error');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _add() async {
    final name = TextEditingController();
    final scientific = TextEditingController();
    final accepted = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Agregar ${_tables[_table]}'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: name,
              decoration: const InputDecoration(labelText: 'Nombre'),
            ),
            if (_table == 'plagas') ...[
              const SizedBox(height: 10),
              TextField(
                controller: scientific,
                decoration: const InputDecoration(
                  labelText: 'Nombre científico',
                ),
              ),
            ],
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Agregar'),
          ),
        ],
      ),
    );
    if (accepted == true && name.text.trim().isNotEmpty) {
      try {
        await widget.repository.addCatalogItem(
          _table,
          name.text,
          scientificName: scientific.text,
        );
        await _load();
      } catch (error) {
        if (mounted) {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text('No se pudo agregar: $error')));
        }
      }
    }
    name.dispose();
    scientific.dispose();
  }

  @override
  Widget build(BuildContext context) => Column(
    children: [
      Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            Expanded(
              child: DropdownButtonFormField<String>(
                initialValue: _table,
                decoration: const InputDecoration(labelText: 'Catálogo'),
                items: _tables.entries
                    .map(
                      (item) => DropdownMenuItem(
                        value: item.key,
                        child: Text(item.value),
                      ),
                    )
                    .toList(),
                onChanged: (value) {
                  if (value == null) return;
                  setState(() => _table = value);
                  _load();
                },
              ),
            ),
            const SizedBox(width: 8),
            IconButton.filled(
              onPressed: _loading ? null : _add,
              tooltip: 'Agregar elemento',
              icon: const Icon(Icons.add),
            ),
          ],
        ),
      ),
      Expanded(
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : _error != null
            ? Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.cloud_off_outlined, size: 42),
                    const SizedBox(height: 8),
                    const Text('No se pudo cargar el catálogo.'),
                    const SizedBox(height: 10),
                    OutlinedButton(
                      onPressed: _load,
                      child: const Text('Reintentar'),
                    ),
                  ],
                ),
              )
            : ListView.separated(
                padding: const EdgeInsets.fromLTRB(12, 0, 12, 92),
                itemCount: _items?.length ?? 0,
                separatorBuilder: (_, _) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final item = _items![index];
                  return SwitchListTile.adaptive(
                    title: Text(
                      item.name,
                      style: const TextStyle(fontWeight: FontWeight.w800),
                    ),
                    subtitle: item.scientificName.isEmpty
                        ? null
                        : Text(item.scientificName),
                    value: item.active,
                    onChanged: (active) async {
                      try {
                        await widget.repository.setCatalogActive(
                          _table,
                          item.id,
                          active,
                        );
                        await _load();
                      } catch (error) {
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('No se pudo actualizar: $error'),
                            ),
                          );
                        }
                      }
                    },
                  );
                },
              ),
      ),
    ],
  );
}
