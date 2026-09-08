import 'dart:async';

import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';

import '../core/app_theme.dart';
import '../models/models.dart';
import '../services/photo_evidence_service.dart';
import '../services/protocol_monitoring_repository.dart';
import '../widgets/loading_overlay.dart';
import '../widgets/monitoring_status_widgets.dart';
import '../widgets/protocol_attributes_sheet.dart';
import 'protocol_structure_screen.dart';

class ProtocolVisitScreen extends StatefulWidget {
  const ProtocolVisitScreen({
    required this.tree,
    required this.field,
    required this.catalog,
    required this.repository,
    this.initialDraft,
    this.createdBy,
    this.onDraftChanged,
    super.key,
  });

  final TreeRecord tree;
  final FieldBlock field;
  final ProtocolCatalogBundle catalog;
  final ProtocolMonitoringRepository repository;
  final VisitDraft? initialDraft;
  final String? createdBy;
  final Future<void> Function(VisitDraft draft)? onDraftChanged;

  @override
  State<ProtocolVisitScreen> createState() => _ProtocolVisitScreenState();
}

class _ProtocolVisitScreenState extends State<ProtocolVisitScreen> {
  final _uuid = const Uuid();
  final _notes = TextEditingController();
  Timer? _saveTimer;
  late VisitDraft _draft;
  bool _saving = false;
  bool _finishing = false;

  String get _cropReference {
    final species = widget.field.species.toUpperCase();
    return species.contains('PALTO') || species.contains('PALTA')
        ? 'PALTO'
        : 'CITRICO';
  }

  List<MonitoringProtocol> get _availableProtocols => widget.catalog.protocols
      .where((protocol) => protocol.crop == _cropReference)
      .toList();

  int get _totalStructures => _draft.pestObservations.fold(
    0,
    (sum, monitoring) => sum + monitoring.structures.length,
  );

  int get _completedStructures => _draft.pestObservations.fold(
    0,
    (sum, monitoring) =>
        sum + monitoring.structures.where(_isStructureComplete).length,
  );

  bool _isStructureComplete(StructureSample sample) =>
      sample.notEvaluable || sample.units.length == sample.plannedQuantity;

  @override
  void initState() {
    super.initState();
    final initial = widget.initialDraft;
    _draft =
        initial ??
        VisitDraft(
          id: _uuid.v4(),
          clientOperationId: _uuid.v4(),
          fieldId: widget.field.id,
          treeId: widget.tree.id,
          treeNumber: widget.tree.number,
          startedAt: DateTime.now(),
          latitude: widget.tree.position.latitude,
          longitude: widget.tree.position.longitude,
          phenology: widget.catalog.phenologies.isEmpty
              ? ''
              : widget.catalog.phenologies.first.id,
          status: VisitStatus.inProgress,
          observations: '',
          pestObservations: const [],
          updatedAt: DateTime.now(),
          createdBy: widget.createdBy,
        );
    _notes.text = _draft.observations;
    unawaited(_persist());
  }

  @override
  void dispose() {
    _saveTimer?.cancel();
    _notes.dispose();
    super.dispose();
  }

  Future<void> _persist() async {
    _draft = _draft.copyWith(updatedAt: DateTime.now());
    if (mounted) setState(() => _saving = true);
    try {
      final callback = widget.onDraftChanged;
      if (callback == null) {
        await widget.repository.saveDraft(_draft);
      } else {
        await callback(_draft);
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  void _scheduleNotesSave(String value) {
    _draft = _draft.copyWith(observations: value);
    _saveTimer?.cancel();
    _saveTimer = Timer(const Duration(milliseconds: 450), _persist);
  }

  Future<void> _addPest() async {
    final selectedIds = _draft.pestObservations
        .map((item) => item.protocolId)
        .toSet();
    final protocols = _availableProtocols
        .where((protocol) => !selectedIds.contains(protocol.id))
        .toList();
    if (protocols.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('No hay más protocolos disponibles para esta especie.'),
        ),
      );
      return;
    }
    final pests = {for (final pest in widget.catalog.pests) pest.id: pest};
    final protocol = await showModalBottomSheet<MonitoringProtocol>(
      context: context,
      useSafeArea: true,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (context) => DraggableScrollableSheet(
        expand: false,
        initialChildSize: .62,
        minChildSize: .42,
        maxChildSize: .88,
        builder: (context, controller) => Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Padding(
              padding: EdgeInsets.fromLTRB(18, 0, 18, 10),
              child: Text(
                'Seleccionar plaga',
                style: TextStyle(
                  fontSize: 21,
                  fontWeight: FontWeight.w900,
                  color: AppColors.navy,
                ),
              ),
            ),
            Expanded(
              child: ListView.separated(
                controller: controller,
                padding: const EdgeInsets.fromLTRB(12, 0, 12, 16),
                itemCount: protocols.length,
                separatorBuilder: (_, _) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final item = protocols[index];
                  final pest = pests[item.pestId];
                  final structures = widget.catalog.structuresFor(item.id);
                  return ListTile(
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 5,
                    ),
                    leading: const CircleAvatar(
                      backgroundColor: AppColors.mint,
                      child: Icon(
                        Icons.bug_report_outlined,
                        color: AppColors.forest,
                      ),
                    ),
                    title: Text(
                      pest?.name ?? item.name,
                      style: const TextStyle(fontWeight: FontWeight.w900),
                    ),
                    subtitle: Text(
                      structures
                          .map((rule) => '${rule.quantity} unidades')
                          .join(' · '),
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 17),
                    onTap: () => Navigator.pop(context, item),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
    if (protocol == null || !mounted) return;
    final pest = pests[protocol.pestId];
    final structuresById = {
      for (final item in widget.catalog.structures) item.id: item,
    };
    final structures = widget.catalog
        .structuresFor(protocol.id)
        .map(
          (rule) => StructureSample(
            id: _uuid.v4(),
            structureId: rule.structureId,
            plannedQuantity: rule.quantity,
            structureNameSnapshot:
                structuresById[rule.structureId]?.name ?? 'Estructura',
            units: const [],
            attributes: const [],
            instructionsSnapshot: rule.instructions,
          ),
        )
        .toList();
    final monitoring = ProtocolPestObservation(
      id: _uuid.v4(),
      clientOperationId: _uuid.v4(),
      pestId: protocol.pestId,
      pestName: pest?.name ?? protocol.name,
      protocolId: protocol.id,
      protocolVersion: protocol.version,
      structures: structures,
      attributes: const [],
    );
    setState(() {
      _draft = _draft.copyWith(
        pestObservations: [..._draft.pestObservations, monitoring],
      );
    });
    await _persist();
  }

  Future<void> _editStructure(int monitoringIndex, int structureIndex) async {
    final monitoring = _draft.pestObservations[monitoringIndex];
    final result = await Navigator.push<StructureSample>(
      context,
      MaterialPageRoute(
        builder: (_) => ProtocolStructureScreen(
          sample: monitoring.structures[structureIndex],
          pestId: monitoring.pestId,
          protocolId: monitoring.protocolId,
          catalog: widget.catalog,
        ),
      ),
    );
    if (result == null || !mounted) return;
    final structures = [...monitoring.structures];
    structures[structureIndex] = result;
    final monitorings = [..._draft.pestObservations];
    monitorings[monitoringIndex] = ProtocolPestObservation(
      id: monitoring.id,
      clientOperationId: monitoring.clientOperationId,
      pestId: monitoring.pestId,
      pestName: monitoring.pestName,
      protocolId: monitoring.protocolId,
      protocolVersion: monitoring.protocolVersion,
      structures: structures,
      attributes: monitoring.attributes,
      notes: monitoring.notes,
    );
    setState(() => _draft = _draft.copyWith(pestObservations: monitorings));
    await _persist();
  }

  Future<void> _editProtocolAttributes(int monitoringIndex) async {
    final monitoring = _draft.pestObservations[monitoringIndex];
    final rules = widget.catalog.attributeRules
        .where(
          (item) =>
              item.protocolId == monitoring.protocolId &&
              item.structureId == null,
        )
        .toList();
    final result = await showProtocolAttributesSheet(
      context: context,
      title: '${monitoring.pestName} · datos complementarios',
      rules: rules,
      definitions: widget.catalog.attributes,
      initial: monitoring.attributes,
    );
    if (result == null || !mounted) return;
    final monitorings = [..._draft.pestObservations];
    monitorings[monitoringIndex] = ProtocolPestObservation(
      id: monitoring.id,
      clientOperationId: monitoring.clientOperationId,
      pestId: monitoring.pestId,
      pestName: monitoring.pestName,
      protocolId: monitoring.protocolId,
      protocolVersion: monitoring.protocolVersion,
      structures: monitoring.structures,
      attributes: result,
      notes: monitoring.notes,
    );
    setState(() => _draft = _draft.copyWith(pestObservations: monitorings));
    await _persist();
  }

  bool _attributesComplete(ProtocolPestObservation monitoring) {
    final completedGlobal = monitoring.attributes
        .map((item) => item.attributeId)
        .toSet();
    final requiredGlobal = widget.catalog.attributeRules.where(
      (rule) =>
          rule.protocolId == monitoring.protocolId &&
          rule.structureId == null &&
          rule.required,
    );
    if (requiredGlobal.any(
      (rule) => !completedGlobal.contains(rule.attributeId),
    )) {
      return false;
    }
    for (final structure in monitoring.structures) {
      final completed = structure.attributes
          .map((item) => item.attributeId)
          .toSet();
      final required = widget.catalog.attributeRules.where(
        (rule) =>
            rule.protocolId == monitoring.protocolId &&
            rule.structureId == structure.structureId &&
            rule.required,
      );
      if (required.any((rule) => !completed.contains(rule.attributeId))) {
        return false;
      }
    }
    return true;
  }

  Future<void> _removePest(int index) async {
    final monitoring = _draft.pestObservations[index];
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Quitar plaga'),
        content: Text(
          'Se eliminará la captura local de ${monitoring.pestName}.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Quitar'),
          ),
        ],
      ),
    );
    if (confirmed != true || !mounted) return;
    final photoService = PhotoEvidenceService();
    for (final structure in monitoring.structures) {
      for (final unit in structure.units) {
        for (final photo in unit.photos) {
          await photoService.delete(photo);
        }
      }
    }
    if (!mounted) return;
    final monitorings = [..._draft.pestObservations]..removeAt(index);
    setState(() => _draft = _draft.copyWith(pestObservations: monitorings));
    await _persist();
  }

  Future<void> _finish() async {
    if (_draft.pestObservations.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Añade al menos una plaga.')),
      );
      return;
    }
    if (_completedStructures != _totalStructures) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Completa o marca como no evaluable cada estructura.'),
        ),
      );
      return;
    }
    if (_draft.pestObservations.any((item) => !_attributesComplete(item))) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Completa los datos obligatorios del protocolo.'),
        ),
      );
      return;
    }
    setState(() => _finishing = true);
    try {
      _draft = _draft.copyWith(
        finishedAt: DateTime.now(),
        status: VisitStatus.inProgress,
        observations: _notes.text.trim(),
      );
      await _persist();
      if (!mounted) return;
      Navigator.pop(context, _draft);
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('$error')));
    } finally {
      if (mounted) setState(() => _finishing = false);
    }
  }

  @override
  Widget build(BuildContext context) => LoadingOverlay(
    loading: _finishing,
    message: 'Guardando árbol...',
    child: Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Árbol ${widget.tree.number}'),
            Text(
              widget.field.label,
              style: const TextStyle(fontSize: 12, color: Color(0xFF60736C)),
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: Center(
              child: SyncStatusBadge(
                status: _saving ? 'Guardando' : 'Borrador local',
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        top: false,
        child: Column(
          children: [
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(14, 12, 14, 18),
                children: [
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(13),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  '${widget.field.species} · ${widget.field.variety}',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w900,
                                    color: AppColors.navy,
                                  ),
                                ),
                              ),
                              Text(
                                _cropReference,
                                style: const TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w900,
                                  color: AppColors.forest,
                                ),
                              ),
                            ],
                          ),
                          if (widget.catalog.phenologies.isNotEmpty) ...[
                            const SizedBox(height: 10),
                            DropdownButtonFormField<String>(
                              initialValue:
                                  widget.catalog.phenologies.any(
                                    (item) => item.id == _draft.phenology,
                                  )
                                  ? _draft.phenology
                                  : widget.catalog.phenologies.first.id,
                              decoration: const InputDecoration(
                                labelText: 'Fenología',
                                prefixIcon: Icon(Icons.eco_outlined),
                              ),
                              items: widget.catalog.phenologies
                                  .map(
                                    (item) => DropdownMenuItem(
                                      value: item.id,
                                      child: Text(item.name),
                                    ),
                                  )
                                  .toList(),
                              onChanged: (value) async {
                                if (value == null) return;
                                setState(() {
                                  _draft = _draft.copyWith(phenology: value);
                                });
                                await _persist();
                              },
                            ),
                          ],
                          const SizedBox(height: 11),
                          MonitoringProgress(
                            completed: _completedStructures,
                            total: _totalStructures,
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      const Expanded(
                        child: Text(
                          'Plagas monitoreadas',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: AppColors.navy,
                          ),
                        ),
                      ),
                      FilledButton.tonalIcon(
                        onPressed: _addPest,
                        icon: const Icon(Icons.add),
                        label: const Text('Añadir'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  if (_draft.pestObservations.isEmpty)
                    const _EmptyPests()
                  else
                    for (
                      var monitoringIndex = 0;
                      monitoringIndex < _draft.pestObservations.length;
                      monitoringIndex += 1
                    )
                      _PestCard(
                        monitoring: _draft.pestObservations[monitoringIndex],
                        attributeCount: widget.catalog.attributeRules
                            .where(
                              (rule) =>
                                  rule.protocolId ==
                                      _draft
                                          .pestObservations[monitoringIndex]
                                          .protocolId &&
                                  rule.structureId == null,
                            )
                            .length,
                        onEditAttributes: () =>
                            _editProtocolAttributes(monitoringIndex),
                        onRemove: () => _removePest(monitoringIndex),
                        onStructureTap: (structureIndex) =>
                            _editStructure(monitoringIndex, structureIndex),
                      ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _notes,
                    maxLines: 2,
                    onChanged: _scheduleNotesSave,
                    decoration: const InputDecoration(
                      labelText: 'Observación de la visita',
                      prefixIcon: Icon(Icons.notes_outlined),
                    ),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.fromLTRB(14, 10, 14, 12),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: AppColors.line)),
              ),
              child: FilledButton.icon(
                onPressed: _finishing ? null : _finish,
                icon: const Icon(Icons.flag_outlined),
                label: const Text('Finalizar árbol'),
              ),
            ),
          ],
        ),
      ),
    ),
  );
}

class _EmptyPests extends StatelessWidget {
  const _EmptyPests();

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(18),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(8),
      border: Border.all(color: AppColors.line),
    ),
    child: const Column(
      children: [
        Icon(Icons.bug_report_outlined, color: AppColors.forest, size: 34),
        SizedBox(height: 8),
        Text(
          'Añade una plaga para cargar su protocolo.',
          textAlign: TextAlign.center,
          style: TextStyle(fontWeight: FontWeight.w800),
        ),
      ],
    ),
  );
}

class _PestCard extends StatelessWidget {
  const _PestCard({
    required this.monitoring,
    required this.attributeCount,
    required this.onEditAttributes,
    required this.onRemove,
    required this.onStructureTap,
  });

  final ProtocolPestObservation monitoring;
  final int attributeCount;
  final VoidCallback onEditAttributes;
  final VoidCallback onRemove;
  final ValueChanged<int> onStructureTap;

  @override
  Widget build(BuildContext context) => Card(
    margin: const EdgeInsets.only(bottom: 9),
    child: Padding(
      padding: const EdgeInsets.fromLTRB(12, 10, 8, 11),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              const Icon(Icons.bug_report_outlined, color: AppColors.forest),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  monitoring.pestName,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    color: AppColors.navy,
                  ),
                ),
              ),
              IconButton(
                tooltip: 'Quitar plaga',
                onPressed: onRemove,
                icon: const Icon(Icons.delete_outline),
              ),
            ],
          ),
          if (attributeCount > 0)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: OutlinedButton.icon(
                onPressed: onEditAttributes,
                icon: const Icon(Icons.tune, size: 18),
                label: Text(
                  monitoring.attributes.isEmpty
                      ? 'Datos complementarios'
                      : 'Datos complementarios · ${monitoring.attributes.length}',
                ),
              ),
            ),
          for (var index = 0; index < monitoring.structures.length; index += 1)
            _StructureRow(
              sample: monitoring.structures[index],
              onTap: () => onStructureTap(index),
            ),
        ],
      ),
    ),
  );
}

class _StructureRow extends StatelessWidget {
  const _StructureRow({required this.sample, required this.onTap});
  final StructureSample sample;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final complete =
        sample.notEvaluable || sample.units.length == sample.plannedQuantity;
    final result = sample.notEvaluable
        ? 'No evaluable'
        : complete
        ? '${sample.positiveQuantity}/${sample.reviewedQuantity} positivas · '
              '${sample.incidencePercentage?.toStringAsFixed(1)}%'
        : 'Pendiente · ${sample.plannedQuantity} unidades';
    return Padding(
      padding: const EdgeInsets.only(bottom: 7),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(7),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
          decoration: BoxDecoration(
            color: complete ? AppColors.mint : const Color(0xFFFFF8EA),
            borderRadius: BorderRadius.circular(7),
            border: Border.all(
              color: complete ? AppColors.line : const Color(0xFFF1C870),
            ),
          ),
          child: Row(
            children: [
              Icon(
                complete ? Icons.check_circle : Icons.radio_button_unchecked,
                color: complete ? AppColors.forest : const Color(0xFFC47A00),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      sample.structureNameSnapshot,
                      style: const TextStyle(fontWeight: FontWeight.w900),
                    ),
                    Text(result, style: const TextStyle(fontSize: 12)),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right),
            ],
          ),
        ),
      ),
    );
  }
}
