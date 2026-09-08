import 'dart:async';

import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../core/app_theme.dart';
import '../models/models.dart';
import '../services/geo_service.dart';
import '../services/protocol_monitoring_repository.dart';

class MonitoringDashboardScreen extends StatefulWidget {
  const MonitoringDashboardScreen({
    required this.fields,
    required this.geoData,
    required this.catalog,
    required this.repository,
    super.key,
  });

  final List<FieldBlock> fields;
  final GeoData geoData;
  final ProtocolCatalogBundle catalog;
  final ProtocolMonitoringRepository repository;

  @override
  State<MonitoringDashboardScreen> createState() =>
      _MonitoringDashboardScreenState();
}

class _MonitoringDashboardScreenState extends State<MonitoringDashboardScreen> {
  late DateTime _from;
  late DateTime _to;
  String? _fieldId;
  String? _pestId;
  String? _structureId;
  String? _monitorId;
  String? _mapGroupKey;
  List<MonitorOption> _monitors = const [];
  List<ProtocolizedResultRow> _rows = const [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _to = DateTime.now();
    _from = _to.subtract(const Duration(days: 30));
    unawaited(_initialize());
  }

  MonitoringHistoryFilter get _filter => MonitoringHistoryFilter(
    from: _from,
    to: _to,
    fieldId: _fieldId,
    pestId: _pestId,
    structureId: _structureId,
    monitorId: _monitorId,
  );

  List<ProtocolizedAggregate> get _aggregates =>
      aggregateProtocolizedRows(_rows);

  Future<void> _initialize() async {
    try {
      _monitors = await widget.repository.listMonitors();
    } catch (_) {
      _monitors = const [];
    }
    await _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final rows = await widget.repository.loadProtocolizedResults(_filter);
      if (!mounted) return;
      setState(() {
        _rows = rows;
        final keys = aggregateProtocolizedRows(
          rows,
        ).map((item) => item.key).toSet();
        if (!keys.contains(_mapGroupKey)) {
          _mapGroupKey = keys.isEmpty ? null : keys.first;
        }
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
    await _load();
  }

  Future<void> _showFilters() async {
    var fieldId = _fieldId;
    var pestId = _pestId;
    var structureId = _structureId;
    var monitorId = _monitorId;
    final applied = await showModalBottomSheet<bool>(
      context: context,
      useSafeArea: true,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (context) => StatefulBuilder(
        builder: (context, setSheetState) => Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 18),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Filtros del resumen',
                  style: TextStyle(
                    fontSize: 21,
                    fontWeight: FontWeight.w900,
                    color: AppColors.navy,
                  ),
                ),
                const SizedBox(height: 14),
                _NullableDropdown(
                  label: 'Potrero / bloque',
                  value: fieldId,
                  options: {
                    for (final field in widget.fields)
                      field.id:
                          '${field.label} · ${field.species} · ${field.variety}',
                  },
                  onChanged: (value) => setSheetState(() => fieldId = value),
                ),
                const SizedBox(height: 10),
                _NullableDropdown(
                  label: 'Plaga',
                  value: pestId,
                  options: {
                    for (final pest in widget.catalog.pests) pest.id: pest.name,
                  },
                  onChanged: (value) => setSheetState(() => pestId = value),
                ),
                const SizedBox(height: 10),
                _NullableDropdown(
                  label: 'Estructura',
                  value: structureId,
                  options: {
                    for (final structure in widget.catalog.structures)
                      structure.id: structure.name,
                  },
                  onChanged: (value) =>
                      setSheetState(() => structureId = value),
                ),
                const SizedBox(height: 10),
                _NullableDropdown(
                  label: 'Monitor',
                  value: monitorId,
                  options: {
                    for (final monitor in _monitors) monitor.id: monitor.name,
                  },
                  onChanged: (value) => setSheetState(() => monitorId = value),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => setSheetState(() {
                          fieldId = null;
                          pestId = null;
                          structureId = null;
                          monitorId = null;
                        }),
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
      _structureId = structureId;
      _monitorId = monitorId;
    });
    await _load();
  }

  @override
  Widget build(BuildContext context) => DefaultTabController(
    length: 2,
    child: Scaffold(
      appBar: AppBar(
        title: const Text('Resumen de monitoreo'),
        bottom: const TabBar(
          tabs: [
            Tab(icon: Icon(Icons.analytics_outlined), text: 'Resumen'),
            Tab(icon: Icon(Icons.map_outlined), text: 'Mapa'),
          ],
        ),
      ),
      body: Column(
        children: [
          _DashboardToolbar(
            from: _from,
            to: _to,
            filterCount: [
              _fieldId,
              _pestId,
              _structureId,
              _monitorId,
            ].whereType<String>().length,
            onFrom: () => _pickDate(true),
            onTo: () => _pickDate(false),
            onFilters: _showFilters,
          ),
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _error != null
                ? _DashboardError(message: _error!, onRetry: _load)
                : _rows.isEmpty
                ? const Center(
                    child: Text(
                      'No hay resultados protocolizados para el período.',
                    ),
                  )
                : TabBarView(
                    children: [
                      _SummaryTab(rows: _rows, aggregates: _aggregates),
                      _IncidenceMapTab(
                        fields: widget.fields,
                        geoData: widget.geoData,
                        rows: _rows,
                        aggregates: _aggregates,
                        selectedKey: _mapGroupKey,
                        onSelected: (value) =>
                            setState(() => _mapGroupKey = value),
                      ),
                    ],
                  ),
          ),
        ],
      ),
    ),
  );
}

class _DashboardToolbar extends StatelessWidget {
  const _DashboardToolbar({
    required this.from,
    required this.to,
    required this.filterCount,
    required this.onFrom,
    required this.onTo,
    required this.onFilters,
  });
  final DateTime from;
  final DateTime to;
  final int filterCount;
  final VoidCallback onFrom;
  final VoidCallback onTo;
  final VoidCallback onFilters;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.fromLTRB(12, 8, 12, 9),
    decoration: const BoxDecoration(
      color: Colors.white,
      border: Border(bottom: BorderSide(color: AppColors.line)),
    ),
    child: Row(
      children: [
        Expanded(
          child: OutlinedButton(
            onPressed: onFrom,
            child: Text(_shortDate(from)),
          ),
        ),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 6),
          child: Icon(Icons.arrow_forward, size: 17),
        ),
        Expanded(
          child: OutlinedButton(onPressed: onTo, child: Text(_shortDate(to))),
        ),
        const SizedBox(width: 8),
        IconButton.filledTonal(
          tooltip: 'Filtros',
          onPressed: onFilters,
          icon: Badge(
            isLabelVisible: filterCount > 0,
            label: Text('$filterCount'),
            child: const Icon(Icons.tune),
          ),
        ),
      ],
    ),
  );
}

class _SummaryTab extends StatelessWidget {
  const _SummaryTab({required this.rows, required this.aggregates});
  final List<ProtocolizedResultRow> rows;
  final List<ProtocolizedAggregate> aggregates;

  @override
  Widget build(BuildContext context) {
    final evaluable = rows.where((item) => !item.notEvaluable).toList();
    final points = evaluable.map((item) => item.treeId).toSet().length;
    final positives = evaluable
        .where((item) => item.positive > 0)
        .map((item) => item.treeId)
        .toSet()
        .length;
    final reviewed = aggregates.fold(
      0,
      (sum, item) => sum + item.reviewedUnits,
    );
    final positiveUnits = aggregates.fold(
      0,
      (sum, item) => sum + item.positiveUnits,
    );
    return ListView(
      padding: const EdgeInsets.fromLTRB(12, 10, 12, 20),
      children: [
        GridView.count(
          crossAxisCount: 2,
          childAspectRatio: 2.25,
          crossAxisSpacing: 8,
          mainAxisSpacing: 8,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          children: [
            _Kpi(label: 'Puntos revisados', value: '$points'),
            _Kpi(label: 'Puntos positivos', value: '$positives'),
            _Kpi(label: 'Unidades revisadas', value: '$reviewed'),
            _Kpi(
              label: 'Incidencia ponderada',
              value: reviewed == 0
                  ? 'Sin datos'
                  : '${(positiveUnits * 100 / reviewed).toStringAsFixed(1)}%',
            ),
          ],
        ),
        const SizedBox(height: 12),
        for (final item in aggregates) _AggregateCard(item: item),
      ],
    );
  }
}

class _Kpi extends StatelessWidget {
  const _Kpi({required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(11),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(7),
      border: Border.all(color: AppColors.line),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
        ),
        Text(
          value,
          style: const TextStyle(
            fontSize: 19,
            fontWeight: FontWeight.w900,
            color: AppColors.forest,
          ),
        ),
      ],
    ),
  );
}

class _AggregateCard extends StatelessWidget {
  const _AggregateCard({required this.item});
  final ProtocolizedAggregate item;

  @override
  Widget build(BuildContext context) => Card(
    margin: const EdgeInsets.only(bottom: 8),
    child: Padding(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            item.pest,
            style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w900),
          ),
          Text(
            item.structure,
            style: const TextStyle(
              color: Color(0xFF60736C),
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 9),
          Row(
            children: [
              Expanded(
                child: Text(
                  '${item.positivePoints}/${item.monitoredPoints} puntos',
                ),
              ),
              Text(
                item.positivePointPercentage == null
                    ? 'Sin datos'
                    : '${item.positivePointPercentage!.toStringAsFixed(1)}% puntos positivos',
                style: const TextStyle(fontWeight: FontWeight.w900),
              ),
            ],
          ),
          const SizedBox(height: 5),
          LinearProgressIndicator(value: (item.incidence ?? 0) / 100),
          const SizedBox(height: 5),
          Text(
            '${item.positiveUnits}/${item.reviewedUnits} unidades · '
            '${item.incidence == null ? 'Sin incidencia' : '${item.incidence!.toStringAsFixed(1)}%'}',
          ),
        ],
      ),
    ),
  );
}

class _IncidenceMapTab extends StatelessWidget {
  const _IncidenceMapTab({
    required this.fields,
    required this.geoData,
    required this.rows,
    required this.aggregates,
    required this.selectedKey,
    required this.onSelected,
  });
  final List<FieldBlock> fields;
  final GeoData geoData;
  final List<ProtocolizedResultRow> rows;
  final List<ProtocolizedAggregate> aggregates;
  final String? selectedKey;
  final ValueChanged<String?> onSelected;

  @override
  Widget build(BuildContext context) {
    final selectedRows = rows
        .where((row) => row.groupKey == selectedKey && !row.notEvaluable)
        .toList();
    final byTree = <String, List<ProtocolizedResultRow>>{};
    for (final row in selectedRows) {
      byTree.putIfAbsent(row.treeId, () => []).add(row);
    }
    return Stack(
      children: [
        Positioned.fill(
          child: GoogleMap(
            initialCameraPosition: CameraPosition(
              target: geoData.center,
              zoom: 15.4,
            ),
            mapType: MapType.hybrid,
            zoomControlsEnabled: false,
            mapToolbarEnabled: false,
            polygons: geoData.polygons(fields),
            markers: {
              for (final entry in byTree.entries)
                if (entry.value.first.position.latitude.abs() > .001)
                  _treeMarker(entry.key, entry.value),
            },
          ),
        ),
        Positioned(
          top: 10,
          left: 10,
          right: 10,
          child: Material(
            elevation: 2,
            borderRadius: BorderRadius.circular(7),
            child: DropdownButtonFormField<String>(
              initialValue: selectedKey,
              isExpanded: true,
              decoration: const InputDecoration(
                labelText: 'Plaga y estructura del mapa',
                prefixIcon: Icon(Icons.layers_outlined),
              ),
              items: [
                for (final item in aggregates)
                  DropdownMenuItem(
                    value: item.key,
                    child: Text('${item.pest} · ${item.structure}'),
                  ),
              ],
              onChanged: onSelected,
            ),
          ),
        ),
        const Positioned(left: 10, bottom: 10, child: _MapLegend()),
      ],
    );
  }

  Marker _treeMarker(String id, List<ProtocolizedResultRow> values) {
    final reviewed = values.fold(0, (sum, row) => sum + row.reviewed);
    final positive = values.fold(0, (sum, row) => sum + row.positive);
    final incidence = reviewed == 0 ? 0.0 : positive * 100 / reviewed;
    return Marker(
      markerId: MarkerId(id),
      position: values.first.position,
      icon: BitmapDescriptor.defaultMarkerWithHue(_hue(incidence)),
      infoWindow: InfoWindow(
        title: 'Árbol ${values.first.treeNumber}',
        snippet: '$positive/$reviewed · ${incidence.toStringAsFixed(1)}%',
      ),
    );
  }

  double _hue(double value) {
    if (value <= 0) return BitmapDescriptor.hueGreen;
    if (value <= 10) return 90;
    if (value <= 25) return BitmapDescriptor.hueYellow;
    if (value <= 50) return BitmapDescriptor.hueOrange;
    return BitmapDescriptor.hueRed;
  }
}

class _MapLegend extends StatelessWidget {
  const _MapLegend();

  @override
  Widget build(BuildContext context) => Material(
    color: Colors.white,
    borderRadius: BorderRadius.circular(7),
    child: const Padding(
      padding: EdgeInsets.all(9),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Incidencia', style: TextStyle(fontWeight: FontWeight.w900)),
          Text('Verde 0% · Lima 1-10%'),
          Text('Amarillo 11-25% · Naranjo 26-50%'),
          Text('Rojo > 50%'),
        ],
      ),
    ),
  );
}

class _NullableDropdown extends StatelessWidget {
  const _NullableDropdown({
    required this.label,
    required this.value,
    required this.options,
    required this.onChanged,
  });
  final String label;
  final String? value;
  final Map<String, String> options;
  final ValueChanged<String?> onChanged;

  @override
  Widget build(BuildContext context) => DropdownButtonFormField<String?>(
    initialValue: value,
    isExpanded: true,
    decoration: InputDecoration(labelText: label),
    items: [
      const DropdownMenuItem(value: null, child: Text('Todos')),
      for (final entry in options.entries)
        DropdownMenuItem(
          value: entry.key,
          child: Text(entry.value, overflow: TextOverflow.ellipsis),
        ),
    ],
    onChanged: onChanged,
  );
}

class _DashboardError extends StatelessWidget {
  const _DashboardError({required this.message, required this.onRetry});
  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) => Center(
    child: Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(message, textAlign: TextAlign.center),
          const SizedBox(height: 12),
          FilledButton(onPressed: onRetry, child: const Text('Reintentar')),
        ],
      ),
    ),
  );
}

String _shortDate(DateTime value) =>
    '${value.day.toString().padLeft(2, '0')}-${value.month.toString().padLeft(2, '0')}-${value.year}';
