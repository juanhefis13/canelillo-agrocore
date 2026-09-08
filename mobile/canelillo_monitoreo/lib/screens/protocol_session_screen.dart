import 'dart:async';

import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:uuid/uuid.dart';

import '../core/app_theme.dart';
import '../models/models.dart';
import '../services/geo_service.dart';
import '../services/photo_evidence_service.dart';
import '../services/protocol_monitoring_repository.dart';
import '../widgets/loading_overlay.dart';
import '../widgets/monitoring_status_widgets.dart';
import 'protocol_visit_screen.dart';
import 'tree_picker_screen.dart';

class ProtocolSessionScreen extends StatefulWidget {
  const ProtocolSessionScreen({
    required this.field,
    required this.availableTrees,
    required this.geoData,
    required this.treeIcons,
    required this.fieldIcons,
    required this.fieldCenters,
    required this.locationGranted,
    required this.catalog,
    required this.repository,
    this.initialTree,
    this.initialDraft,
    this.createdBy,
    super.key,
  });

  final FieldBlock field;
  final List<TreeRecord> availableTrees;
  final GeoData geoData;
  final Map<String, BitmapDescriptor> treeIcons;
  final Map<String, BitmapDescriptor> fieldIcons;
  final Map<String, LatLng> fieldCenters;
  final bool locationGranted;
  final ProtocolCatalogBundle catalog;
  final ProtocolMonitoringRepository repository;
  final TreeRecord? initialTree;
  final VisitDraft? initialDraft;
  final String? createdBy;

  @override
  State<ProtocolSessionScreen> createState() => _ProtocolSessionScreenState();
}

class _ProtocolSessionScreenState extends State<ProtocolSessionScreen> {
  final _uuid = const Uuid();
  late VisitDraft _draft;
  bool _saving = false;
  bool _finishing = false;

  List<TreeMonitoringDraft> get _trees => _draft.treeMonitorings;
  int get _positiveTrees => _trees
      .where(
        (tree) => tree.pestObservations.any(
          (monitoring) => monitoring.structures.any(
            (structure) => structure.positiveQuantity > 0,
          ),
        ),
      )
      .length;

  @override
  void initState() {
    super.initState();
    final initial = widget.initialDraft;
    final firstTree = widget.initialTree;
    _draft =
        initial ??
        VisitDraft(
          id: _uuid.v4(),
          clientOperationId: _uuid.v4(),
          fieldId: widget.field.id,
          treeId: firstTree?.id ?? '',
          treeNumber: firstTree?.number ?? '',
          startedAt: DateTime.now(),
          latitude: firstTree?.position.latitude ?? 0,
          longitude: firstTree?.position.longitude ?? 0,
          phenology: widget.catalog.phenologies.isEmpty
              ? ''
              : widget.catalog.phenologies.first.id,
          status: VisitStatus.inProgress,
          observations: '',
          pestObservations: const [],
          treeMonitorings: const [],
          updatedAt: DateTime.now(),
          createdBy: widget.createdBy,
        );
    unawaited(_saveSession());
    if (initial == null && firstTree != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) unawaited(_openTree(firstTree));
      });
    }
  }

  Future<void> _saveSession() async {
    _draft = _draft.copyWith(updatedAt: DateTime.now());
    if (mounted) setState(() => _saving = true);
    try {
      await widget.repository.saveDraft(_draft);
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  TreeRecord? _treeRecord(String treeId) =>
      widget.availableTrees.cast<TreeRecord?>().firstWhere(
        (tree) => tree?.id == treeId || tree?.clientOperationId == treeId,
        orElse: () => null,
      );

  Future<void> _mergeTreeDraft(VisitDraft child) async {
    final entry = TreeMonitoringDraft(
      treeId: child.treeId,
      treeNumber: child.treeNumber,
      latitude: child.latitude,
      longitude: child.longitude,
      pestObservations: child.pestObservations,
      completedAt: child.finishedAt,
    );
    final trees = [..._draft.treeMonitorings];
    final index = trees.indexWhere((item) => item.treeId == entry.treeId);
    if (index < 0) {
      trees.add(entry);
    } else {
      trees[index] = entry;
    }
    _draft = _draft.copyWith(
      treeId: _draft.treeId.isEmpty ? child.treeId : _draft.treeId,
      treeNumber: _draft.treeNumber.isEmpty
          ? child.treeNumber
          : _draft.treeNumber,
      latitude: _draft.treeId.isEmpty ? child.latitude : _draft.latitude,
      longitude: _draft.treeId.isEmpty ? child.longitude : _draft.longitude,
      phenology: child.phenology,
      observations: child.observations,
      treeMonitorings: trees,
      pestObservations: const [],
    );
    if (mounted) setState(() {});
    await _saveSession();
  }

  Future<void> _openTree(TreeRecord tree) async {
    final existing = _draft.treeMonitorings
        .cast<TreeMonitoringDraft?>()
        .firstWhere(
          (item) =>
              item?.treeId == tree.id || item?.treeId == tree.clientOperationId,
          orElse: () => null,
        );
    final child = VisitDraft(
      id: _draft.id,
      clientOperationId: _draft.clientOperationId,
      fieldId: _draft.fieldId,
      treeId: tree.id,
      treeNumber: tree.number,
      startedAt: _draft.startedAt,
      finishedAt: existing?.completedAt,
      latitude: tree.position.latitude,
      longitude: tree.position.longitude,
      phenology: _draft.phenology,
      status: VisitStatus.inProgress,
      observations: _draft.observations,
      pestObservations: existing?.pestObservations ?? const [],
      updatedAt: DateTime.now(),
      createdBy: _draft.createdBy,
      deviceId: _draft.deviceId,
    );
    final result = await Navigator.push<VisitDraft>(
      context,
      MaterialPageRoute(
        builder: (_) => ProtocolVisitScreen(
          tree: tree,
          field: widget.field,
          catalog: widget.catalog,
          repository: widget.repository,
          initialDraft: child,
          createdBy: _draft.createdBy,
          onDraftChanged: _mergeTreeDraft,
        ),
      ),
    );
    if (result != null && mounted) await _mergeTreeDraft(result);
  }

  Future<void> _addTree() async {
    final usedIds = _draft.treeMonitorings.map((item) => item.treeId).toSet();
    final trees = widget.availableTrees
        .where(
          (tree) =>
              !usedIds.contains(tree.id) &&
              !usedIds.contains(tree.clientOperationId),
        )
        .toList();
    if (trees.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('No quedan árboles disponibles en el bloque.'),
        ),
      );
      return;
    }
    final tree = await Navigator.push<TreeRecord>(
      context,
      MaterialPageRoute(
        builder: (_) => TreePickerScreen(
          fields: [widget.field],
          trees: trees,
          geoData: widget.geoData,
          treeIcons: widget.treeIcons,
          fieldIcons: widget.fieldIcons,
          fieldCenters: widget.fieldCenters,
          locationGranted: widget.locationGranted,
        ),
      ),
    );
    if (tree != null && mounted) await _openTree(tree);
  }

  Future<void> _removeTree(TreeMonitoringDraft tree) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Quitar árbol ${tree.treeNumber}'),
        content: const Text(
          'Se eliminarán del borrador las plagas y unidades de este árbol.',
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
    for (final monitoring in tree.pestObservations) {
      for (final structure in monitoring.structures) {
        for (final unit in structure.units) {
          for (final photo in unit.photos) {
            await photoService.delete(photo);
          }
        }
      }
    }
    if (!mounted) return;
    final trees = [..._draft.treeMonitorings]
      ..removeWhere((item) => item.treeId == tree.treeId);
    setState(() => _draft = _draft.copyWith(treeMonitorings: trees));
    await _saveSession();
  }

  Future<void> _finishSession() async {
    if (_trees.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Añade al menos un árbol monitoreado.')),
      );
      return;
    }
    final incomplete = _trees.where((tree) => !tree.isComplete).toList();
    if (incomplete.isNotEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Completa el árbol ${incomplete.first.treeNumber} antes de finalizar.',
          ),
        ),
      );
      return;
    }
    setState(() => _finishing = true);
    try {
      _draft = _draft.copyWith(
        status: VisitStatus.pendingSync,
        finishedAt: DateTime.now(),
      );
      await widget.repository.queueCompletedVisit(_draft);
      final report = await widget.repository.syncPending();
      if (!mounted) return;
      final message = report.offline || report.remaining > 0
          ? 'Recorrido guardado y pendiente de sincronización.'
          : 'Recorrido sincronizado correctamente.';
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(message)));
      Navigator.pop(context, true);
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
    message: 'Finalizando recorrido...',
    child: Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Visita de monitoreo'),
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
                  _SessionSummary(
                    totalTrees: _trees.length,
                    completedTrees: _trees
                        .where((tree) => tree.isComplete)
                        .length,
                    positiveTrees: _positiveTrees,
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      const Expanded(
                        child: Text(
                          'Árboles del recorrido',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: AppColors.navy,
                          ),
                        ),
                      ),
                      FilledButton.tonalIcon(
                        onPressed: _addTree,
                        icon: const Icon(Icons.add_location_alt_outlined),
                        label: const Text('Añadir'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  if (_trees.isEmpty)
                    const _EmptyTrees()
                  else
                    for (final tree in _trees)
                      _TreeVisitCard(
                        tree: tree,
                        onTap: () {
                          final record = _treeRecord(tree.treeId);
                          if (record != null) unawaited(_openTree(record));
                        },
                        onRemove: () => _removeTree(tree),
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
                onPressed: _finishing ? null : _finishSession,
                icon: const Icon(Icons.flag_outlined),
                label: const Text('Finalizar recorrido'),
              ),
            ),
          ],
        ),
      ),
    ),
  );
}

class _SessionSummary extends StatelessWidget {
  const _SessionSummary({
    required this.totalTrees,
    required this.completedTrees,
    required this.positiveTrees,
  });

  final int totalTrees;
  final int completedTrees;
  final int positiveTrees;

  @override
  Widget build(BuildContext context) => Card(
    child: Padding(
      padding: const EdgeInsets.all(13),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          MonitoringProgress(completed: completedTrees, total: totalTrees),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _SummaryValue(
                  label: 'Monitoreados',
                  value: '$totalTrees',
                ),
              ),
              Expanded(
                child: _SummaryValue(
                  label: 'Completos',
                  value: '$completedTrees',
                ),
              ),
              Expanded(
                child: _SummaryValue(
                  label: 'Con detección',
                  value: '$positiveTrees',
                ),
              ),
            ],
          ),
        ],
      ),
    ),
  );
}

class _SummaryValue extends StatelessWidget {
  const _SummaryValue({required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) => Column(
    children: [
      Text(
        value,
        style: const TextStyle(
          fontSize: 22,
          fontWeight: FontWeight.w900,
          color: AppColors.forest,
        ),
      ),
      Text(
        label,
        textAlign: TextAlign.center,
        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800),
      ),
    ],
  );
}

class _TreeVisitCard extends StatelessWidget {
  const _TreeVisitCard({
    required this.tree,
    required this.onTap,
    required this.onRemove,
  });

  final TreeMonitoringDraft tree;
  final VoidCallback onTap;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    final detections = tree.pestObservations
        .where((monitoring) => monitoring.found)
        .length;
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.fromLTRB(12, 5, 4, 5),
        leading: CircleAvatar(
          backgroundColor: tree.isComplete
              ? AppColors.mint
              : const Color(0xFFFFF3D8),
          child: Icon(
            tree.isComplete ? Icons.check : Icons.pending_outlined,
            color: tree.isComplete ? AppColors.forest : const Color(0xFFC47A00),
          ),
        ),
        title: Text(
          'Árbol ${tree.treeNumber}',
          style: const TextStyle(fontWeight: FontWeight.w900),
        ),
        subtitle: Text(
          '${tree.pestObservations.length} plagas · $detections con detección',
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              tooltip: 'Quitar árbol',
              onPressed: onRemove,
              icon: const Icon(Icons.delete_outline),
            ),
            const Icon(Icons.chevron_right),
          ],
        ),
      ),
    );
  }
}

class _EmptyTrees extends StatelessWidget {
  const _EmptyTrees();

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(20),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(8),
      border: Border.all(color: AppColors.line),
    ),
    child: const Column(
      children: [
        Icon(Icons.park_outlined, size: 36, color: AppColors.forest),
        SizedBox(height: 8),
        Text(
          'Añade el primer árbol del recorrido.',
          style: TextStyle(fontWeight: FontWeight.w800),
        ),
      ],
    ),
  );
}
