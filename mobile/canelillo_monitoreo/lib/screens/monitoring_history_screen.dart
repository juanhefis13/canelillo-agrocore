import 'dart:async';

import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../core/app_theme.dart';
import '../models/models.dart';
import '../services/protocol_monitoring_repository.dart';

class MonitoringHistoryScreen extends StatefulWidget {
  const MonitoringHistoryScreen({
    required this.fields,
    required this.catalog,
    required this.repository,
    super.key,
  });

  final List<FieldBlock> fields;
  final ProtocolCatalogBundle catalog;
  final ProtocolMonitoringRepository repository;

  @override
  State<MonitoringHistoryScreen> createState() =>
      _MonitoringHistoryScreenState();
}

class _MonitoringHistoryScreenState extends State<MonitoringHistoryScreen> {
  static const _pageSize = 25;
  final _visits = <MonitoringVisitSummary>[];
  List<MonitorOption> _monitors = const [];
  late DateTime _from;
  late DateTime _to;
  String? _fieldId;
  String? _pestId;
  String? _monitorId;
  int _page = 0;
  bool _loading = false;
  bool _hasMore = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _to = DateTime.now();
    _from = _to.subtract(const Duration(days: 30));
    unawaited(_initialize());
  }

  Future<void> _initialize() async {
    try {
      _monitors = await widget.repository.listMonitors();
    } catch (_) {
      _monitors = const [];
    }
    await _reload();
  }

  MonitoringHistoryFilter get _filter => MonitoringHistoryFilter(
    from: _from,
    to: _to,
    fieldId: _fieldId,
    pestId: _pestId,
    monitorId: _monitorId,
  );

  Future<void> _reload() async {
    _page = 0;
    _hasMore = true;
    _visits.clear();
    await _loadMore();
  }

  Future<void> _loadMore() async {
    if (_loading || !_hasMore) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final rows = await widget.repository.loadHistoryPage(
        _filter,
        page: _page,
        pageSize: _pageSize,
      );
      if (!mounted) return;
      setState(() {
        _visits.addAll(rows);
        _page += 1;
        _hasMore = rows.length == _pageSize;
      });
    } catch (error) {
      if (mounted) setState(() => _error = '$error');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _pickDate(bool from) async {
    final value = await showDatePicker(
      context: context,
      firstDate: DateTime(2020),
      lastDate: DateTime.now().add(const Duration(days: 1)),
      initialDate: from ? _from : _to,
    );
    if (value == null || !mounted) return;
    setState(() {
      if (from) {
        _from = value;
        if (_from.isAfter(_to)) _to = value;
      } else {
        _to = value;
        if (_to.isBefore(_from)) _from = value;
      }
    });
    await _reload();
  }

  Future<void> _showFilters() async {
    var fieldId = _fieldId;
    var pestId = _pestId;
    var monitorId = _monitorId;
    final applied = await showModalBottomSheet<bool>(
      context: context,
      useSafeArea: true,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (context) => StatefulBuilder(
        builder: (context, setSheetState) => Padding(
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
                const Text(
                  'Filtrar historial',
                  style: TextStyle(
                    fontSize: 21,
                    fontWeight: FontWeight.w900,
                    color: AppColors.navy,
                  ),
                ),
                const SizedBox(height: 14),
                DropdownButtonFormField<String?>(
                  initialValue: fieldId,
                  isExpanded: true,
                  decoration: const InputDecoration(
                    labelText: 'Potrero / bloque',
                  ),
                  items: [
                    const DropdownMenuItem(value: null, child: Text('Todos')),
                    for (final field in widget.fields)
                      DropdownMenuItem(
                        value: field.id,
                        child: Text(
                          '${field.label} · ${field.species} · ${field.variety}',
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                  ],
                  onChanged: (value) => setSheetState(() => fieldId = value),
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String?>(
                  initialValue: pestId,
                  isExpanded: true,
                  decoration: const InputDecoration(labelText: 'Plaga'),
                  items: [
                    const DropdownMenuItem(value: null, child: Text('Todas')),
                    for (final pest in widget.catalog.pests)
                      DropdownMenuItem(value: pest.id, child: Text(pest.name)),
                  ],
                  onChanged: (value) => setSheetState(() => pestId = value),
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String?>(
                  initialValue: monitorId,
                  isExpanded: true,
                  decoration: const InputDecoration(labelText: 'Monitor'),
                  items: [
                    const DropdownMenuItem(value: null, child: Text('Todos')),
                    for (final monitor in _monitors)
                      DropdownMenuItem(
                        value: monitor.id,
                        child: Text(monitor.name),
                      ),
                  ],
                  onChanged: (value) => setSheetState(() => monitorId = value),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {
                          setSheetState(() {
                            fieldId = null;
                            pestId = null;
                            monitorId = null;
                          });
                        },
                        child: const Text('Limpiar'),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: FilledButton(
                        onPressed: () => Navigator.pop(context, true),
                        child: const Text('Aplicar'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
    if (applied != true || !mounted) return;
    setState(() {
      _fieldId = fieldId;
      _pestId = pestId;
      _monitorId = monitorId;
    });
    await _reload();
  }

  String _fieldLabel(String id) =>
      widget.fields
          .cast<FieldBlock?>()
          .firstWhere((item) => item?.id == id, orElse: () => null)
          ?.label ??
      'Campo sin referencia';

  String _monitorName(String id) =>
      _monitors
          .cast<MonitorOption?>()
          .firstWhere((item) => item?.id == id, orElse: () => null)
          ?.name ??
      'Monitor';

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Historial de monitoreo')),
    body: Column(
      children: [
        Container(
          padding: const EdgeInsets.fromLTRB(12, 8, 12, 10),
          decoration: const BoxDecoration(
            color: Colors.white,
            border: Border(bottom: BorderSide(color: AppColors.line)),
          ),
          child: Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => _pickDate(true),
                  icon: const Icon(Icons.calendar_today_outlined, size: 18),
                  label: Text(_shortDate(_from)),
                ),
              ),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 6),
                child: Icon(Icons.arrow_forward, size: 17),
              ),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => _pickDate(false),
                  icon: const Icon(Icons.event_outlined, size: 18),
                  label: Text(_shortDate(_to)),
                ),
              ),
              const SizedBox(width: 8),
              IconButton.filledTonal(
                tooltip: 'Filtros',
                onPressed: _showFilters,
                icon: Badge(
                  isLabelVisible: [
                    _fieldId,
                    _pestId,
                    _monitorId,
                  ].whereType<String>().isNotEmpty,
                  child: const Icon(Icons.tune),
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: RefreshIndicator(
            onRefresh: _reload,
            child: _HistoryList(
              visits: _visits,
              loading: _loading,
              hasMore: _hasMore,
              error: _error,
              fieldLabel: _fieldLabel,
              monitorName: _monitorName,
              onLoadMore: _loadMore,
              onOpen: (visit) => Navigator.push<void>(
                context,
                MaterialPageRoute(
                  builder: (_) => MonitoringVisitDetailScreen(
                    visit: visit,
                    fieldLabel: _fieldLabel(visit.fieldId),
                    monitorName: _monitorName(visit.monitorId),
                    repository: widget.repository,
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    ),
  );
}

class _HistoryList extends StatelessWidget {
  const _HistoryList({
    required this.visits,
    required this.loading,
    required this.hasMore,
    required this.error,
    required this.fieldLabel,
    required this.monitorName,
    required this.onLoadMore,
    required this.onOpen,
  });

  final List<MonitoringVisitSummary> visits;
  final bool loading;
  final bool hasMore;
  final String? error;
  final String Function(String) fieldLabel;
  final String Function(String) monitorName;
  final Future<void> Function() onLoadMore;
  final ValueChanged<MonitoringVisitSummary> onOpen;

  @override
  Widget build(BuildContext context) {
    if (loading && visits.isEmpty) {
      return ListView(
        children: [
          const SizedBox(height: 180),
          Center(child: CircularProgressIndicator()),
        ],
      );
    }
    if (visits.isEmpty) {
      return ListView(
        padding: const EdgeInsets.all(24),
        children: [
          const Icon(Icons.search_off, size: 46, color: AppColors.forest),
          const SizedBox(height: 10),
          Text(
            error ?? 'No hay visitas para el período y filtros seleccionados.',
            textAlign: TextAlign.center,
          ),
        ],
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(12, 10, 12, 18),
      itemCount: visits.length + (hasMore || loading ? 1 : 0),
      itemBuilder: (context, index) {
        if (index == visits.length) {
          if (!loading) unawaited(onLoadMore());
          return const Padding(
            padding: EdgeInsets.all(18),
            child: Center(child: CircularProgressIndicator()),
          );
        }
        final visit = visits[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            onTap: () => onOpen(visit),
            leading: const CircleAvatar(
              backgroundColor: AppColors.mint,
              child: Icon(Icons.route_outlined, color: AppColors.forest),
            ),
            title: Text(
              fieldLabel(visit.fieldId),
              style: const TextStyle(fontWeight: FontWeight.w900),
            ),
            subtitle: Text(
              '${_dateTime(visit.startedAt)} · ${monitorName(visit.monitorId)}\n'
              '${visit.treeCount} árboles · ${visit.pestCount} plagas',
            ),
            isThreeLine: true,
            trailing: const Icon(Icons.chevron_right),
          ),
        );
      },
    );
  }
}

class MonitoringVisitDetailScreen extends StatefulWidget {
  const MonitoringVisitDetailScreen({
    required this.visit,
    required this.fieldLabel,
    required this.monitorName,
    required this.repository,
    super.key,
  });

  final MonitoringVisitSummary visit;
  final String fieldLabel;
  final String monitorName;
  final ProtocolMonitoringRepository repository;

  @override
  State<MonitoringVisitDetailScreen> createState() =>
      _MonitoringVisitDetailScreenState();
}

class _MonitoringVisitDetailScreenState
    extends State<MonitoringVisitDetailScreen> {
  late final Future<MonitoringVisitDetail> _future;

  @override
  void initState() {
    super.initState();
    _future = widget.repository.loadVisitDetail(widget.visit.id);
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: Text(widget.fieldLabel)),
    body: FutureBuilder<MonitoringVisitDetail>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Text('No se pudo cargar la visita: ${snapshot.error}'),
            ),
          );
        }
        final detail = snapshot.data!;
        final groups = <String, List<HistoryPestMonitoring>>{};
        for (final monitoring in detail.monitorings) {
          groups.putIfAbsent(monitoring.treeId, () => []).add(monitoring);
        }
        return ListView(
          padding: const EdgeInsets.fromLTRB(12, 10, 12, 20),
          children: [
            _VisitHeader(visit: widget.visit, monitorName: widget.monitorName),
            if (detail.monitorings.isNotEmpty) ...[
              const SizedBox(height: 10),
              _VisitMap(monitorings: detail.monitorings),
            ],
            const SizedBox(height: 10),
            for (final entry in groups.entries)
              _TreeHistoryCard(
                monitorings: entry.value,
                photoUrls: detail.photoPaths,
              ),
          ],
        );
      },
    ),
  );
}

class _VisitHeader extends StatelessWidget {
  const _VisitHeader({required this.visit, required this.monitorName});
  final MonitoringVisitSummary visit;
  final String monitorName;

  @override
  Widget build(BuildContext context) => Card(
    child: Padding(
      padding: const EdgeInsets.all(13),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            _dateTime(visit.startedAt),
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
          ),
          Text(
            '$monitorName · ${visit.treeCount} árboles · ${visit.pestCount} plagas',
          ),
          if (visit.phenology.isNotEmpty) Text('Fenología: ${visit.phenology}'),
          if (visit.notes.isNotEmpty) ...[const Divider(), Text(visit.notes)],
        ],
      ),
    ),
  );
}

class _VisitMap extends StatelessWidget {
  const _VisitMap({required this.monitorings});
  final List<HistoryPestMonitoring> monitorings;

  @override
  Widget build(BuildContext context) {
    final valid = monitorings
        .where((item) => item.position.latitude.abs() > .001)
        .toList();
    if (valid.isEmpty) return const SizedBox.shrink();
    return SizedBox(
      height: 220,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(8),
        child: GoogleMap(
          initialCameraPosition: CameraPosition(
            target: valid.first.position,
            zoom: 17,
          ),
          mapType: MapType.hybrid,
          zoomControlsEnabled: false,
          mapToolbarEnabled: false,
          markers: {
            for (final item in valid)
              Marker(
                markerId: MarkerId(item.treeId),
                position: item.position,
                infoWindow: InfoWindow(title: 'Árbol ${item.treeNumber}'),
                icon: BitmapDescriptor.defaultMarkerWithHue(
                  item.positive
                      ? BitmapDescriptor.hueRed
                      : BitmapDescriptor.hueGreen,
                ),
              ),
          },
        ),
      ),
    );
  }
}

class _TreeHistoryCard extends StatelessWidget {
  const _TreeHistoryCard({required this.monitorings, required this.photoUrls});
  final List<HistoryPestMonitoring> monitorings;
  final Map<String, String> photoUrls;

  @override
  Widget build(BuildContext context) => Card(
    margin: const EdgeInsets.only(bottom: 8),
    clipBehavior: Clip.antiAlias,
    child: ExpansionTile(
      leading: const Icon(Icons.park_outlined, color: AppColors.forest),
      title: Text(
        'Árbol ${monitorings.first.treeNumber}',
        style: const TextStyle(fontWeight: FontWeight.w900),
      ),
      subtitle: Text('${monitorings.length} plagas revisadas'),
      children: [
        for (final monitoring in monitorings)
          _PestHistoryTile(monitoring: monitoring, photoUrls: photoUrls),
      ],
    ),
  );
}

class _PestHistoryTile extends StatelessWidget {
  const _PestHistoryTile({required this.monitoring, required this.photoUrls});
  final HistoryPestMonitoring monitoring;
  final Map<String, String> photoUrls;

  @override
  Widget build(BuildContext context) => ExpansionTile(
    tilePadding: const EdgeInsets.symmetric(horizontal: 18),
    title: Text(
      monitoring.pest,
      style: const TextStyle(fontWeight: FontWeight.w800),
    ),
    leading: Icon(
      monitoring.positive
          ? Icons.warning_amber_rounded
          : Icons.check_circle_outline,
      color: monitoring.positive ? AppColors.amber : AppColors.forest,
    ),
    children: [
      for (final structure in monitoring.structures)
        Padding(
          padding: const EdgeInsets.fromLTRB(18, 0, 18, 12),
          child: _StructureHistory(structure: structure, photoUrls: photoUrls),
        ),
    ],
  );
}

class _StructureHistory extends StatelessWidget {
  const _StructureHistory({required this.structure, required this.photoUrls});
  final HistoryStructure structure;
  final Map<String, String> photoUrls;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(11),
    decoration: BoxDecoration(
      color: const Color(0xFFF7FAF8),
      borderRadius: BorderRadius.circular(7),
      border: Border.all(color: AppColors.line),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                structure.name,
                style: const TextStyle(fontWeight: FontWeight.w900),
              ),
            ),
            Text(
              structure.incidence == null
                  ? 'No evaluable'
                  : '${structure.positive}/${structure.reviewed} · ${structure.incidence!.toStringAsFixed(1)}%',
              style: const TextStyle(
                fontWeight: FontWeight.w900,
                color: AppColors.forest,
              ),
            ),
          ],
        ),
        if (structure.notEvaluable)
          Text(structure.notEvaluableReason)
        else
          for (final unit in structure.units.where((item) => item.positive))
            _PositiveUnitRow(unit: unit, photoUrls: photoUrls),
      ],
    ),
  );
}

class _PositiveUnitRow extends StatelessWidget {
  const _PositiveUnitRow({required this.unit, required this.photoUrls});
  final HistoryUnit unit;
  final Map<String, String> photoUrls;

  @override
  Widget build(BuildContext context) {
    final details = [
      ...unit.states,
      ...unit.damages,
      ...unit.enemies,
      if (unit.abundance.isNotEmpty) 'Abundancia ${unit.abundance}',
      if (unit.notes.isNotEmpty) unit.notes,
    ];
    return Padding(
      padding: const EdgeInsets.only(top: 9),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text('Unidad ${unit.number} · ${details.join(' · ')}'),
          if (unit.photos.isNotEmpty)
            SizedBox(
              height: 74,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: unit.photos.length,
                separatorBuilder: (_, _) => const SizedBox(width: 6),
                itemBuilder: (context, index) {
                  final url = photoUrls[unit.photos[index]] ?? '';
                  return ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: url.isEmpty
                        ? const SizedBox.square(
                            dimension: 74,
                            child: Icon(Icons.broken_image_outlined),
                          )
                        : Image.network(
                            url,
                            width: 74,
                            height: 74,
                            fit: BoxFit.cover,
                          ),
                  );
                },
              ),
            ),
        ],
      ),
    );
  }
}

String _shortDate(DateTime value) =>
    '${value.day.toString().padLeft(2, '0')}-${value.month.toString().padLeft(2, '0')}-${value.year}';

String _dateTime(DateTime value) =>
    '${_shortDate(value)} · ${value.hour.toString().padLeft(2, '0')}:${value.minute.toString().padLeft(2, '0')}';
