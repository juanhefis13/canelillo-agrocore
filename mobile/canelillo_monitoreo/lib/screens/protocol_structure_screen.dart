import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';

import '../core/app_theme.dart';
import '../models/models.dart';
import '../services/photo_evidence_service.dart';
import '../widgets/photo_evidence_widget.dart';
import '../widgets/protocol_attributes_sheet.dart';
import '../widgets/sampling_unit_grid.dart';

class ProtocolStructureScreen extends StatefulWidget {
  const ProtocolStructureScreen({
    required this.sample,
    required this.pestId,
    required this.protocolId,
    required this.catalog,
    super.key,
  });

  final StructureSample sample;
  final String pestId;
  final String protocolId;
  final ProtocolCatalogBundle catalog;

  @override
  State<ProtocolStructureScreen> createState() =>
      _ProtocolStructureScreenState();
}

class _ProtocolStructureScreenState extends State<ProtocolStructureScreen> {
  final _uuid = const Uuid();
  late final Map<int, SamplingUnit> _units;
  late List<AttributeObservation> _attributes;

  List<ProtocolAttributeRule> get _attributeRules => widget
      .catalog
      .attributeRules
      .where(
        (item) =>
            item.protocolId == widget.protocolId &&
            item.structureId == widget.sample.structureId,
      )
      .toList();

  Set<int> get _positiveUnits => _units.values
      .where((unit) => unit.hasPestPresence)
      .map((unit) => unit.number)
      .toSet();

  List<CatalogItem> get _allowedStates {
    final stateIds =
        widget.catalog.pestStates
            .where((item) => item.pestId == widget.pestId)
            .toList()
          ..sort((a, b) => a.order.compareTo(b.order));
    final states = {
      for (final state in widget.catalog.biologicalStates) state.id: state,
    };
    return stateIds
        .map((item) => states[item.stateId])
        .whereType<CatalogItem>()
        .toList();
  }

  @override
  void initState() {
    super.initState();
    _units = {for (final unit in widget.sample.units) unit.number: unit};
    _attributes = [...widget.sample.attributes];
  }

  Future<void> _editAttributes() async {
    final result = await showProtocolAttributesSheet(
      context: context,
      title: '${widget.sample.structureNameSnapshot} · datos complementarios',
      rules: _attributeRules,
      definitions: widget.catalog.attributes,
      initial: _attributes,
      structureSampleId: widget.sample.id,
    );
    if (result != null && mounted) setState(() => _attributes = result);
  }

  Future<void> _editUnit(int number) async {
    final existing = _units[number];
    final result = await showModalBottomSheet<_UnitDetailResult>(
      context: context,
      useSafeArea: true,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (context) => _UnitDetailSheet(
        number: number,
        existing: existing,
        allowedStates: _allowedStates,
        damageTypes: widget.catalog.damageTypes,
        naturalEnemies: widget.catalog.naturalEnemies,
      ),
    );
    if (result == null || !mounted) return;
    setState(() {
      if (!result.positive) {
        _units.remove(number);
        return;
      }
      _units[number] = SamplingUnit(
        id: existing?.id ?? _uuid.v4(),
        clientOperationId: existing?.clientOperationId ?? _uuid.v4(),
        number: number,
        positive: true,
        stateCounts: [
          for (final stateId in result.stateIds)
            BiologicalStateCount(stateId: stateId, quantity: 1),
        ],
        damages: [
          for (final damageId in result.damageIds)
            DamageObservation(
              damageTypeId: damageId,
              severity: result.severity,
            ),
        ],
        naturalEnemies: [
          for (final enemyId in result.enemyIds)
            NaturalEnemyObservation(enemyId: enemyId, present: true),
        ],
        attributes: existing?.attributes ?? const [],
        photos: result.photos,
        abundanceCategory: result.abundance,
        severity: result.damageIds.isEmpty ? null : result.severity,
        notes: result.notes,
      );
    });
  }

  Future<void> _markNotEvaluable() async {
    const reasons = [
      'Sin frutos',
      'Sin brotes',
      'Árbol ausente',
      'Árbol muerto',
      'Acceso imposible',
      'Daño físico',
    ];
    final selected = await showModalBottomSheet<String>(
      context: context,
      useSafeArea: true,
      showDragHandle: true,
      builder: (context) => Padding(
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 18),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'No se pudo evaluar',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w900,
                color: AppColors.navy,
              ),
            ),
            const SizedBox(height: 8),
            for (final reason in reasons)
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.radio_button_unchecked),
                title: Text(reason),
                onTap: () => Navigator.pop(context, reason),
              ),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.edit_outlined),
              title: const Text('Otro motivo'),
              onTap: () => Navigator.pop(context, '__other__'),
            ),
          ],
        ),
      ),
    );
    if (selected == null || !mounted) return;
    var reason = selected;
    if (selected == '__other__') {
      final controller = TextEditingController();
      reason =
          await showDialog<String>(
            context: context,
            builder: (context) => AlertDialog(
              title: const Text('Motivo'),
              content: TextField(
                controller: controller,
                autofocus: true,
                maxLines: 2,
                decoration: const InputDecoration(
                  hintText: 'Describe por qué no se pudo evaluar',
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cancelar'),
                ),
                FilledButton(
                  onPressed: () {
                    final value = controller.text.trim();
                    if (value.isNotEmpty) Navigator.pop(context, value);
                  },
                  child: const Text('Aceptar'),
                ),
              ],
            ),
          ) ??
          '';
      controller.dispose();
    }
    if (reason.trim().isEmpty || !mounted) return;
    final photoService = PhotoEvidenceService();
    for (final unit in _units.values) {
      for (final photo in unit.photos) {
        await photoService.delete(photo);
      }
    }
    if (!mounted) return;
    Navigator.pop(
      context,
      StructureSample(
        id: widget.sample.id,
        structureId: widget.sample.structureId,
        plannedQuantity: widget.sample.plannedQuantity,
        structureNameSnapshot: widget.sample.structureNameSnapshot,
        units: const [],
        attributes: _attributes,
        instructionsSnapshot: widget.sample.instructionsSnapshot,
        notEvaluable: true,
        notEvaluableReason: reason,
      ),
    );
  }

  void _confirm() {
    final units = <SamplingUnit>[];
    for (var number = 1; number <= widget.sample.plannedQuantity; number += 1) {
      final positive = _units[number];
      units.add(
        positive ??
            SamplingUnit(
              id: _uuid.v4(),
              clientOperationId: _uuid.v4(),
              number: number,
              positive: false,
              stateCounts: const [],
              damages: const [],
              naturalEnemies: const [],
              attributes: const [],
            ),
      );
    }
    Navigator.pop(
      context,
      StructureSample(
        id: widget.sample.id,
        structureId: widget.sample.structureId,
        plannedQuantity: widget.sample.plannedQuantity,
        structureNameSnapshot: widget.sample.structureNameSnapshot,
        units: units,
        attributes: _attributes,
        instructionsSnapshot: widget.sample.instructionsSnapshot,
      ),
    );
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(widget.sample.structureNameSnapshot),
          Text(
            '${_positiveUnits.length} de ${widget.sample.plannedQuantity} positivas',
            style: const TextStyle(fontSize: 12, color: Color(0xFF60736C)),
          ),
        ],
      ),
    ),
    body: SafeArea(
      top: false,
      child: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(16, 14, 16, 18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.mint,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppColors.line),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.touch_app_outlined,
                          color: AppColors.forest,
                        ),
                        const SizedBox(width: 9),
                        Expanded(
                          child: Text(
                            'Toca solo las unidades positivas. Las demás se '
                            'guardarán como negativas al confirmar.',
                            style: Theme.of(context).textTheme.bodyMedium
                                ?.copyWith(fontWeight: FontWeight.w700),
                          ),
                        ),
                      ],
                    ),
                  ),
                  if ((widget.sample.instructionsSnapshot ?? '').isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 10),
                      child: Text(widget.sample.instructionsSnapshot!),
                    ),
                  const SizedBox(height: 14),
                  SamplingUnitGrid(
                    quantity: widget.sample.plannedQuantity,
                    positiveUnits: _positiveUnits,
                    onUnitTap: _editUnit,
                  ),
                  if (_attributeRules.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    OutlinedButton.icon(
                      onPressed: _editAttributes,
                      icon: const Icon(Icons.tune),
                      label: Text(
                        _attributes.isEmpty
                            ? 'Datos complementarios'
                            : 'Datos complementarios · ${_attributes.length}',
                      ),
                    ),
                  ],
                  const SizedBox(height: 14),
                  OutlinedButton.icon(
                    onPressed: _markNotEvaluable,
                    icon: const Icon(Icons.block_outlined),
                    label: const Text('No se pudo evaluar'),
                  ),
                ],
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.fromLTRB(16, 10, 16, 12),
            decoration: const BoxDecoration(
              color: Colors.white,
              border: Border(top: BorderSide(color: AppColors.line)),
            ),
            child: FilledButton.icon(
              onPressed: _confirm,
              icon: const Icon(Icons.check),
              label: Text(
                'Confirmar ${widget.sample.plannedQuantity} unidades',
              ),
            ),
          ),
        ],
      ),
    ),
  );
}

class _UnitDetailResult {
  const _UnitDetailResult({
    required this.positive,
    required this.stateIds,
    required this.damageIds,
    required this.enemyIds,
    required this.photos,
    required this.abundance,
    required this.severity,
    required this.notes,
  });

  final bool positive;
  final Set<String> stateIds;
  final Set<String> damageIds;
  final Set<String> enemyIds;
  final List<PhotoEvidence> photos;
  final String? abundance;
  final String severity;
  final String? notes;
}

class _UnitDetailSheet extends StatefulWidget {
  const _UnitDetailSheet({
    required this.number,
    required this.existing,
    required this.allowedStates,
    required this.damageTypes,
    required this.naturalEnemies,
  });

  final int number;
  final SamplingUnit? existing;
  final List<CatalogItem> allowedStates;
  final List<CatalogItem> damageTypes;
  final List<CatalogItem> naturalEnemies;

  @override
  State<_UnitDetailSheet> createState() => _UnitDetailSheetState();
}

class _UnitDetailSheetState extends State<_UnitDetailSheet> {
  late final Set<String> _states;
  late final Set<String> _damages;
  late final Set<String> _enemies;
  late final TextEditingController _notes;
  late List<PhotoEvidence> _photos;
  String? _abundance;
  String _severity = 'leve';

  @override
  void initState() {
    super.initState();
    _states =
        widget.existing?.stateCounts.map((item) => item.stateId).toSet() ?? {};
    _damages =
        widget.existing?.damages.map((item) => item.damageTypeId).toSet() ?? {};
    _enemies =
        widget.existing?.naturalEnemies.map((item) => item.enemyId).toSet() ??
        {};
    _abundance = widget.existing?.abundanceCategory;
    _severity = widget.existing?.severity ?? 'leve';
    _notes = TextEditingController(text: widget.existing?.notes);
    _photos = [...?widget.existing?.photos];
  }

  @override
  void dispose() {
    _notes.dispose();
    super.dispose();
  }

  void _save() {
    if (widget.allowedStates.isNotEmpty && _states.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Selecciona al menos un estado biológico.'),
        ),
      );
      return;
    }
    Navigator.pop(
      context,
      _UnitDetailResult(
        positive: true,
        stateIds: _states,
        damageIds: _damages,
        enemyIds: _enemies,
        photos: _photos,
        abundance: _abundance,
        severity: _severity,
        notes: _notes.text.trim().isEmpty ? null : _notes.text.trim(),
      ),
    );
  }

  Future<void> _markNegative() async {
    final service = PhotoEvidenceService();
    for (final photo in _photos) {
      await service.delete(photo);
    }
    if (!mounted) return;
    Navigator.pop(
      context,
      const _UnitDetailResult(
        positive: false,
        stateIds: {},
        damageIds: {},
        enemyIds: {},
        photos: [],
        abundance: null,
        severity: 'leve',
        notes: null,
      ),
    );
  }

  @override
  Widget build(BuildContext context) => Padding(
    padding: EdgeInsets.fromLTRB(
      16,
      0,
      16,
      16 + MediaQuery.viewInsetsOf(context).bottom,
    ),
    child: SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'Unidad ${widget.number}',
            style: const TextStyle(
              fontSize: 21,
              fontWeight: FontWeight.w900,
              color: AppColors.navy,
            ),
          ),
          const Text('Registra solo lo observado en esta unidad.'),
          if (widget.allowedStates.isNotEmpty) ...[
            const SizedBox(height: 16),
            const _SectionLabel('Estados biológicos'),
            Wrap(
              spacing: 7,
              runSpacing: 7,
              children: [
                for (final state in widget.allowedStates)
                  FilterChip(
                    label: Text(state.name),
                    selected: _states.contains(state.id),
                    onSelected: (selected) => setState(() {
                      selected
                          ? _states.add(state.id)
                          : _states.remove(state.id);
                    }),
                  ),
              ],
            ),
          ],
          const SizedBox(height: 14),
          const _SectionLabel('Abundancia'),
          Wrap(
            spacing: 7,
            children: [
              for (final value in const ['1', '2-5', '6-10', '>10'])
                ChoiceChip(
                  label: Text(value),
                  selected: _abundance == value,
                  onSelected: (selected) =>
                      setState(() => _abundance = selected ? value : null),
                ),
            ],
          ),
          if (widget.damageTypes.isNotEmpty) ...[
            const SizedBox(height: 14),
            const _SectionLabel('Daño observado'),
            Wrap(
              spacing: 7,
              runSpacing: 7,
              children: [
                for (final damage in widget.damageTypes)
                  FilterChip(
                    label: Text(damage.name),
                    selected: _damages.contains(damage.id),
                    onSelected: (selected) => setState(() {
                      selected
                          ? _damages.add(damage.id)
                          : _damages.remove(damage.id);
                    }),
                  ),
              ],
            ),
            if (_damages.isNotEmpty) ...[
              const SizedBox(height: 10),
              SegmentedButton<String>(
                segments: const [
                  ButtonSegment(value: 'leve', label: Text('Leve')),
                  ButtonSegment(value: 'medio', label: Text('Medio')),
                  ButtonSegment(value: 'alto', label: Text('Alto')),
                ],
                selected: {_severity},
                onSelectionChanged: (value) =>
                    setState(() => _severity = value.first),
              ),
            ],
          ],
          if (widget.naturalEnemies.isNotEmpty) ...[
            const SizedBox(height: 14),
            const _SectionLabel('Enemigos naturales'),
            Wrap(
              spacing: 7,
              runSpacing: 7,
              children: [
                for (final enemy in widget.naturalEnemies)
                  FilterChip(
                    label: Text(enemy.name),
                    selected: _enemies.contains(enemy.id),
                    onSelected: (selected) => setState(() {
                      selected
                          ? _enemies.add(enemy.id)
                          : _enemies.remove(enemy.id);
                    }),
                  ),
              ],
            ),
          ],
          const SizedBox(height: 14),
          PhotoEvidenceWidget(
            photos: _photos,
            onChanged: (photos) => setState(() => _photos = photos),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: _notes,
            maxLines: 2,
            decoration: const InputDecoration(
              labelText: 'Observación opcional',
              prefixIcon: Icon(Icons.notes_outlined),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              if (widget.existing?.hasPestPresence == true)
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _markNegative,
                    icon: const Icon(Icons.remove_circle_outline),
                    label: const Text('Marcar negativa'),
                  ),
                ),
              if (widget.existing?.hasPestPresence == true)
                const SizedBox(width: 8),
              Expanded(
                child: FilledButton.icon(
                  onPressed: _save,
                  icon: const Icon(Icons.check),
                  label: const Text('Guardar positiva'),
                ),
              ),
            ],
          ),
        ],
      ),
    ),
  );
}

class _SectionLabel extends StatelessWidget {
  const _SectionLabel(this.text);
  final String text;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 7),
    child: Text(
      text,
      style: const TextStyle(
        fontWeight: FontWeight.w900,
        color: AppColors.navy,
      ),
    ),
  );
}
