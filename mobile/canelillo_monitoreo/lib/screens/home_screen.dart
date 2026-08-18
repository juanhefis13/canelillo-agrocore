import 'dart:async';

import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart' show Supabase;
import 'package:flutter_svg/flutter_svg.dart';

import '../core/app_theme.dart';
import '../models/models.dart';
import '../services/geo_service.dart';
import '../services/map_marker_service.dart';
import '../services/monitoring_repository.dart';
import '../services/pest_icon_service.dart';
import '../widgets/loading_overlay.dart';
import 'monitoring_form_sheet.dart';
import 'tree_editor_screen.dart';
import 'tree_picker_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final MonitoringRepository _repository;
  DashboardData? _data;
  GeoData? _geoData;
  GoogleMapController? _mapController;
  BitmapDescriptor? _treeIcon;
  Map<String, BitmapDescriptor> _treeNumberIcons = const {};
  Map<String, BitmapDescriptor> _fieldLabelIcons = const {};
  Map<String, LatLng> _fieldCenters = const {};
  Map<String, PestIconSet> _pestIcons = const {};
  MonitoringMapMode _mode = MonitoringMapMode.heat;
  bool _showTrees = true;
  bool _showTreeNumbers = true;
  bool _showPestIcons = true;
  bool _showFieldLabels = true;
  bool _filtersExpanded = true;
  bool _locationGranted = false;
  String _species = 'Todas';
  String _potrero = 'Todos';
  String _block = 'Todos';
  double _mapZoom = 15.2;
  double _pendingMapZoom = 15.2;
  String? _pest;
  DateTime? _from;
  DateTime? _to;
  bool _loading = true;
  bool _operationLoading = false;
  String _operationMessage = 'Procesando...';
  String? _error;
  int _pendingCount = 0;

  @override
  void initState() {
    super.initState();
    _repository = MonitoringRepository(Supabase.instance.client);
    _bootstrap();
    unawaited(_prepareLocation());
  }

  Future<void> _bootstrap({bool force = false}) async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final results = await Future.wait([
        _repository.loadDashboard(force: force),
        GeoService.load(),
      ]);
      final data = results[0] as DashboardData;
      final monitorings = [...data.monitorings]
        ..sort((a, b) => a.date.compareTo(b.date));
      final latest = monitorings.isEmpty
          ? DateTime.now()
          : monitorings.last.date;
      _treeIcon ??= await BitmapDescriptor.asset(
        const ImageConfiguration(size: Size(38, 38)),
        'assets/markers/tree.png',
        width: 38,
        height: 38,
      );
      final pestIcons = await PestIconService.loadAll(data.pests);
      final treeNumbers = data.trees.map((tree) => tree.number).toSet();
      final treeNumberIcons = <String, BitmapDescriptor>{};
      await Future.wait(
        treeNumbers.map((number) async {
          treeNumberIcons[number] = await MapMarkerService.treeWithNumber(
            number,
          );
        }),
      );
      final fieldLabelIcons = <String, BitmapDescriptor>{};
      await Future.wait(
        data.fields.map((field) async {
          fieldLabelIcons[field.id] = await MapMarkerService.fieldLabel(
            field.label,
          );
        }),
      );
      final geoData = results[1] as GeoData;
      if (!mounted) return;
      setState(() {
        _data = data;
        _geoData = geoData;
        _pest ??= data.pests.isEmpty ? null : data.pests.first.name;
        _to ??= latest;
        _from ??= latest.subtract(const Duration(days: 30));
        _pestIcons = pestIcons;
        _treeNumberIcons = treeNumberIcons;
        _fieldLabelIcons = fieldLabelIcons;
        _fieldCenters = geoData.fieldCenters(data.fields);
      });
      _pendingCount = await _repository.pendingCount();
    } catch (error) {
      if (mounted) setState(() => _error = '$error');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  List<MonitoringRecord> get _filteredMonitorings {
    final data = _data;
    if (data == null) return [];
    final fields = {for (final field in data.fields) field.id: field};
    return data.monitorings.where((record) {
      if (_pest != null && record.pest != _pest) return false;
      if (!_matchesField(fields[record.fieldId])) return false;
      final day = DateTime(
        record.date.year,
        record.date.month,
        record.date.day,
      );
      if (_from != null &&
          day.isBefore(DateTime(_from!.year, _from!.month, _from!.day))) {
        return false;
      }
      if (_to != null &&
          day.isAfter(DateTime(_to!.year, _to!.month, _to!.day))) {
        return false;
      }
      return true;
    }).toList();
  }

  bool _matchesField(FieldBlock? field) {
    if (field == null) {
      return _species == 'Todas' && _potrero == 'Todos' && _block == 'Todos';
    }
    if (_species != 'Todas' && field.species != _species) return false;
    if (_potrero != 'Todos' && field.potrero != _potrero) return false;
    if (_block != 'Todos' && field.block != _block) return false;
    return true;
  }

  List<TreeRecord> get _filteredTrees {
    final data = _data;
    if (data == null) return [];
    final fields = {for (final field in data.fields) field.id: field};
    return data.trees
        .where((tree) => _matchesField(fields[tree.fieldId]))
        .toList();
  }

  _RiskScale get _riskScale => _RiskScale.fromRecords(_filteredMonitorings);

  Map<String, Color> get _blockHeatColors {
    if (_mode != MonitoringMapMode.heat) return const {};
    final scale = _riskScale;
    final grouped = <String, List<double>>{};
    for (final record in _filteredMonitorings) {
      if (record.fieldId.isEmpty) continue;
      grouped.putIfAbsent(record.fieldId, () => []).add(record.total);
    }
    return grouped.map((fieldId, values) {
      final average =
          values.fold<double>(0, (sum, value) => sum + value) / values.length;
      return MapEntry(
        fieldId,
        _RiskScale.colors[scale.level(average)].withValues(alpha: .68),
      );
    });
  }

  Set<Marker> get _treeMarkers {
    final data = _data;
    if (!_showTrees || data == null) return {};
    return _filteredTrees
        .map(
          (tree) => Marker(
            markerId: MarkerId('tree_${tree.id}'),
            position: tree.position,
            icon: _showTreeNumbers
                ? (_treeNumberIcons[tree.number] ??
                      _treeIcon ??
                      BitmapDescriptor.defaultMarker)
                : (_treeIcon ??
                      BitmapDescriptor.defaultMarkerWithHue(
                        BitmapDescriptor.hueGreen,
                      )),
            anchor: _showTreeNumbers
                ? const Offset(.5, .78)
                : const Offset(.5, .9),
            zIndexInt: tree.pending ? 30 : 20,
            infoWindow: InfoWindow(
              title: 'Árbol ${tree.number}',
              snippet: tree.pending
                  ? 'Pendiente de sincronización'
                  : 'Toca para abrir',
            ),
            onTap: () => _showTree(tree),
          ),
        )
        .toSet();
  }

  Set<Marker> get _pestMarkers {
    if (_mode != MonitoringMapMode.points || !_showPestIcons) return {};
    final catalog = _data?.pests.cast<PestCatalog?>().firstWhere(
      (item) => item?.name == _pest,
      orElse: () => null,
    );
    return _filteredMonitorings.asMap().entries.map((entry) {
      final record = entry.value;
      final iconSet = _pestIcons[record.pest];
      return Marker(
        markerId: MarkerId(
          'pest_${record.id}_${record.clientOperationId}_${entry.key}',
        ),
        position: record.position,
        icon:
            iconSet?.forTotal(record.total, catalog?.maximum ?? 10) ??
            BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange),
        anchor: const Offset(.5, .5),
        zIndexInt: 60,
        infoWindow: InfoWindow(
          title: '${record.pest} · Total ${record.total.toStringAsFixed(0)}',
          snippet: 'Árbol ${record.treeNumber} · ${_shortDate(record.date)}',
        ),
        onTap: () => _showMonitoring(record),
      );
    }).toSet();
  }

  Set<Marker> get _fieldLabelMarkers {
    final data = _data;
    if (!_showFieldLabels || _mapZoom < 14.6 || data == null) return {};
    return data.fields
        .where(_matchesField)
        .map((field) {
          final position = _fieldCenters[field.id];
          final icon = _fieldLabelIcons[field.id];
          if (position == null || icon == null) return null;
          return Marker(
            markerId: MarkerId('field_label_${field.id}'),
            position: position,
            icon: icon,
            anchor: const Offset(.5, .5),
            flat: true,
            zIndexInt: 12,
          );
        })
        .whereType<Marker>()
        .toSet();
  }

  Set<Marker> get _mapMarkers => {
    ..._fieldLabelMarkers,
    ..._treeMarkers,
    ..._pestMarkers,
  };

  Future<void> _prepareLocation() async {
    try {
      if (!await Geolocator.isLocationServiceEnabled()) return;
      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      final granted =
          permission == LocationPermission.whileInUse ||
          permission == LocationPermission.always;
      if (mounted) setState(() => _locationGranted = granted);
    } catch (_) {
      if (mounted) setState(() => _locationGranted = false);
    }
  }

  Future<T?> _run<T>(String message, Future<T> Function() action) async {
    setState(() {
      _operationLoading = true;
      _operationMessage = message;
    });
    try {
      return await action();
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('$error')));
      }
      return null;
    } finally {
      if (mounted) setState(() => _operationLoading = false);
    }
  }

  Future<LatLng?> _currentLocation() async {
    try {
      if (!await Geolocator.isLocationServiceEnabled()) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Activa la ubicación del teléfono para continuar.'),
            ),
          );
        }
        return null;
      }
      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text(
                'Autoriza la ubicación para mostrar tu posición actual.',
              ),
            ),
          );
        }
        return null;
      }
      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 15),
        ),
      );
      if (mounted && !_locationGranted) {
        setState(() => _locationGranted = true);
      }
      return LatLng(position.latitude, position.longitude);
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('No fue posible obtener una posición GPS válida.'),
          ),
        );
      }
      return null;
    }
  }

  Future<void> _createTree() async {
    final data = _data;
    final geo = _geoData;
    if (data == null || geo == null) return;
    final position = await _run('Buscando ubicación...', _currentLocation);
    if (!mounted || position == null) return;
    final draft = await Navigator.push<TreeRecord>(
      context,
      MaterialPageRoute(
        builder: (_) => TreeEditorScreen(
          fields: data.fields,
          geoData: geo,
          initialPosition: position,
        ),
      ),
    );
    if (draft == null) return;
    final saved = await _run(
      'Guardando árbol...',
      () => _repository.saveTree(draft),
    );
    if (saved == null || !mounted) return;
    setState(() {
      final trees = [...data.trees]
        ..removeWhere(
          (item) =>
              item.id == saved.id ||
              item.clientOperationId == saved.clientOperationId,
        );
      _data = DashboardData(
        fields: data.fields,
        trees: [...trees, saved],
        pests: data.pests,
        monitorings: data.monitorings,
        fromCache: data.fromCache,
      );
      _mode = MonitoringMapMode.points;
      _showTrees = true;
    });
    _pendingCount = await _repository.pendingCount();
    if (mounted) {
      _showSavedMessage(
        saved.pending ? 'Árbol guardado en el equipo' : 'Árbol sincronizado',
      );
    }
  }

  Future<void> _createMonitoringPoint() async {
    final data = _data;
    final geo = _geoData;
    if (data == null || geo == null) return;
    final trees = _filteredTrees;
    if (trees.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('No hay árboles disponibles con los filtros actuales.'),
        ),
      );
      return;
    }
    final tree = await Navigator.push<TreeRecord>(
      context,
      MaterialPageRoute(
        builder: (_) => TreePickerScreen(
          fields: data.fields.where(_matchesField).toList(),
          trees: trees,
          geoData: geo,
          treeIcons: _treeNumberIcons,
          fieldIcons: _fieldLabelIcons,
          fieldCenters: _fieldCenters,
          locationGranted: _locationGranted,
        ),
      ),
    );
    if (tree != null && mounted) await _addMonitoring(tree);
  }

  Future<void> _showAddOptions() async {
    final choice = await showModalBottomSheet<String>(
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
              '¿Qué quieres añadir?',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w900,
                color: AppColors.navy,
              ),
            ),
            const SizedBox(height: 12),
            _AddOption(
              icon: Image.asset('assets/markers/tree.png'),
              title: 'Árbol',
              description: 'Ubica una nueva estación y arrastra el marcador.',
              onTap: () => Navigator.pop(context, 'tree'),
            ),
            const SizedBox(height: 8),
            _AddOption(
              icon: const Icon(
                Icons.bug_report_outlined,
                color: AppColors.danger,
              ),
              title: 'Monitoreo de plaga',
              description: 'Selecciona el árbol y registra sus etapas.',
              onTap: () => Navigator.pop(context, 'pest'),
            ),
          ],
        ),
      ),
    );
    if (!mounted) return;
    if (choice == 'tree') await _createTree();
    if (choice == 'pest') await _createMonitoringPoint();
  }

  Future<void> _editTree(TreeRecord tree) async {
    final data = _data;
    final geo = _geoData;
    if (data == null || geo == null) return;
    final draft = await Navigator.push<TreeRecord>(
      context,
      MaterialPageRoute(
        builder: (_) => TreeEditorScreen(
          fields: data.fields,
          geoData: geo,
          initialPosition: tree.position,
          tree: tree,
        ),
      ),
    );
    if (draft == null) return;
    final saved = await _run(
      'Actualizando árbol...',
      () => _repository.saveTree(draft),
    );
    if (saved == null || !mounted) return;
    setState(() {
      final trees = [...data.trees]
        ..removeWhere(
          (item) =>
              item.id == tree.id ||
              item.clientOperationId == saved.clientOperationId,
        );
      _data = DashboardData(
        fields: data.fields,
        trees: [...trees, saved],
        pests: data.pests,
        monitorings: data.monitorings,
        fromCache: data.fromCache,
      );
    });
    _pendingCount = await _repository.pendingCount();
    if (mounted) {
      _showSavedMessage(
        saved.pending ? 'Cambio guardado en el equipo' : 'Árbol actualizado',
      );
    }
  }

  Future<void> _addMonitoring(TreeRecord tree) async {
    final data = _data;
    if (data == null || data.pests.isEmpty) return;
    final draft = await showModalBottomSheet<MonitoringRecord>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (_) => MonitoringFormSheet(
        tree: tree,
        pests: data.pests,
        initialPest: _pest,
      ),
    );
    if (draft == null) return;
    final saved = await _run(
      'Guardando monitoreo...',
      () => _repository.saveMonitoring(draft),
    );
    if (saved == null || !mounted) return;
    setState(() {
      final rows = [...data.monitorings]
        ..removeWhere(
          (item) =>
              item.id == saved.id ||
              item.clientOperationId == saved.clientOperationId,
        );
      _data = DashboardData(
        fields: data.fields,
        trees: data.trees,
        pests: data.pests,
        monitorings: [...rows, saved],
        fromCache: data.fromCache,
      );
      _pest = saved.pest;
      _mode = MonitoringMapMode.points;
      _showPestIcons = true;
    });
    _pendingCount = await _repository.pendingCount();
    if (mounted) {
      _showSavedMessage(
        saved.pending
            ? 'Monitoreo guardado en el equipo'
            : 'Monitoreo sincronizado',
      );
    }
  }

  void _showSavedMessage(String message) =>
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const Icon(Icons.check_circle, color: Colors.white),
              const SizedBox(width: 9),
              Expanded(child: Text(message)),
            ],
          ),
        ),
      );

  Future<void> _sync() async {
    await _run('Sincronizando...', () async {
      await _repository.syncPending();
      await _bootstrap(force: true);
    });
  }

  Future<void> _logout() async {
    final preferences = await SharedPreferences.getInstance();
    await preferences.setBool('remember_session', false);
    await Supabase.instance.client.auth.signOut();
  }

  int get _fieldFilterCount => [
    _species != 'Todas',
    _potrero != 'Todos',
    _block != 'Todos',
  ].where((active) => active).length;

  int get _activeLayerCount => [
    _showFieldLabels,
    _showTrees,
    _showTreeNumbers,
    _showPestIcons,
  ].where((active) => active).length;

  Future<void> _showFieldFilters() async {
    final data = _data;
    if (data == null) return;
    var species = _species;
    var potrero = _potrero;
    var block = _block;
    final result = await showModalBottomSheet<List<String>>(
      context: context,
      useSafeArea: true,
      isScrollControlled: true,
      showDragHandle: true,
      builder: (context) => StatefulBuilder(
        builder: (context, setSheetState) {
          final speciesOptions =
              data.fields
                  .map((field) => field.species)
                  .where((value) => value.isNotEmpty)
                  .toSet()
                  .toList()
                ..sort();
          final potreros =
              data.fields
                  .where(
                    (field) => species == 'Todas' || field.species == species,
                  )
                  .map((field) => field.potrero)
                  .toSet()
                  .toList()
                ..sort(_naturalCompare);
          final blocks =
              data.fields
                  .where(
                    (field) =>
                        (species == 'Todas' || field.species == species) &&
                        (potrero == 'Todos' || field.potrero == potrero),
                  )
                  .map((field) => field.block)
                  .toSet()
                  .toList()
                ..sort(_naturalCompare);
          return Padding(
            padding: const EdgeInsets.fromLTRB(18, 0, 18, 18),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Filtros de campo',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: AppColors.navy,
                  ),
                ),
                const SizedBox(height: 14),
                DropdownButtonFormField<String>(
                  initialValue: species,
                  decoration: const InputDecoration(labelText: 'Especie'),
                  items: ['Todas', ...speciesOptions]
                      .map(
                        (value) =>
                            DropdownMenuItem(value: value, child: Text(value)),
                      )
                      .toList(),
                  onChanged: (value) => setSheetState(() {
                    species = value ?? 'Todas';
                    potrero = 'Todos';
                    block = 'Todos';
                  }),
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  key: ValueKey('potrero_$species'),
                  initialValue: potreros.contains(potrero) ? potrero : 'Todos',
                  decoration: const InputDecoration(labelText: 'Potrero'),
                  items: ['Todos', ...potreros]
                      .map(
                        (value) => DropdownMenuItem(
                          value: value,
                          child: Text(_potreroLabel(value)),
                        ),
                      )
                      .toList(),
                  onChanged: (value) => setSheetState(() {
                    potrero = value ?? 'Todos';
                    block = 'Todos';
                  }),
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  key: ValueKey('block_${species}_$potrero'),
                  initialValue: blocks.contains(block) ? block : 'Todos',
                  decoration: const InputDecoration(labelText: 'Bloque'),
                  items: ['Todos', ...blocks]
                      .map(
                        (value) => DropdownMenuItem(
                          value: value,
                          child: Text(value == 'Todos' ? value : 'B$value'),
                        ),
                      )
                      .toList(),
                  onChanged: (value) =>
                      setSheetState(() => block = value ?? 'Todos'),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => Navigator.pop(context, const [
                          'Todas',
                          'Todos',
                          'Todos',
                        ]),
                        child: const Text('Limpiar'),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: FilledButton(
                        onPressed: () =>
                            Navigator.pop(context, [species, potrero, block]),
                        child: const Text('Aplicar'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
    if (result == null || !mounted) return;
    setState(() {
      _species = result[0];
      _potrero = result[1];
      _block = result[2];
    });
  }

  Future<void> _showLayerSettings() async {
    await showModalBottomSheet<void>(
      context: context,
      useSafeArea: true,
      showDragHandle: true,
      builder: (context) => StatefulBuilder(
        builder: (context, setSheetState) {
          void update(VoidCallback change) {
            setState(change);
            setSheetState(() {});
          }

          return Padding(
            padding: const EdgeInsets.fromLTRB(12, 0, 12, 18),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 8),
                  child: Text(
                    'Capas del mapa',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      color: AppColors.navy,
                    ),
                  ),
                ),
                SwitchListTile(
                  value: _showFieldLabels,
                  secondary: const Icon(Icons.label_outline),
                  title: const Text('Potrero y bloque'),
                  onChanged: (value) => update(() => _showFieldLabels = value),
                ),
                SwitchListTile(
                  value: _showTrees,
                  secondary: Image.asset(
                    'assets/markers/tree.png',
                    width: 28,
                    height: 28,
                  ),
                  title: const Text('Árboles'),
                  onChanged: (value) => update(() => _showTrees = value),
                ),
                SwitchListTile(
                  value: _showTreeNumbers,
                  secondary: const Icon(Icons.numbers),
                  title: const Text('Número del árbol'),
                  onChanged: _showTrees
                      ? (value) => update(() => _showTreeNumbers = value)
                      : null,
                ),
                SwitchListTile(
                  value: _showPestIcons,
                  secondary: const Icon(Icons.bug_report_outlined),
                  title: const Text('Iconos de plagas'),
                  subtitle: const Text('Visible en el modo Puntos'),
                  onChanged: (value) => update(() => _showPestIcons = value),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  void _showTree(TreeRecord tree) {
    final data = _data!;
    final field = data.fields.cast<FieldBlock?>().firstWhere(
      (item) => item?.id == tree.fieldId,
      orElse: () => null,
    );
    final history =
        data.monitorings
            .where(
              (row) =>
                  row.treeId == tree.id ||
                  row.treeNumber == tree.number && row.fieldId == tree.fieldId,
            )
            .toList()
          ..sort((a, b) => b.date.compareTo(a.date));
    showModalBottomSheet<void>(
      context: context,
      useSafeArea: true,
      showDragHandle: true,
      builder: (sheetContext) => Padding(
        padding: const EdgeInsets.fromLTRB(18, 0, 18, 18),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  padding: const EdgeInsets.all(7),
                  decoration: BoxDecoration(
                    color: AppColors.mint,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Image.asset('assets/markers/tree.png'),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Árbol ${tree.number}',
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: AppColors.navy,
                        ),
                      ),
                      Text(
                        field == null
                            ? 'Campo pendiente'
                            : '${field.label} · ${field.species} · ${field.variety}',
                        style: const TextStyle(
                          color: Color(0xFF60736C),
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ),
                if (tree.pending) const Chip(label: Text('Pendiente')),
              ],
            ),
            const SizedBox(height: 12),
            if (history.isEmpty)
              const Text(
                'Sin monitoreos registrados para este árbol.',
                style: TextStyle(color: Color(0xFF60736C)),
              )
            else
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0xFFF7FAF8),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppColors.line),
                ),
                child: Column(
                  children: history
                      .take(3)
                      .map(
                        (row) => Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4),
                          child: Row(
                            children: [
                              Icon(
                                row.total > 0
                                    ? Icons.warning_amber_rounded
                                    : Icons.check_circle_outline,
                                size: 18,
                                color: row.total > 0
                                    ? AppColors.amber
                                    : AppColors.forest,
                              ),
                              const SizedBox(width: 7),
                              Expanded(
                                child: Text(
                                  row.pest,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ),
                              Text('Total ${row.total.toStringAsFixed(0)}'),
                            ],
                          ),
                        ),
                      )
                      .toList(),
                ),
              ),
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      Navigator.pop(sheetContext);
                      _editTree(tree);
                    },
                    icon: const Icon(Icons.edit_location_alt_outlined),
                    label: const Text('Editar punto'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: FilledButton.icon(
                    onPressed: () {
                      Navigator.pop(sheetContext);
                      _addMonitoring(tree);
                    },
                    icon: const Icon(Icons.bug_report_outlined),
                    label: const Text('Monitorear'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showMonitoring(MonitoringRecord record) {
    final data = _data!;
    final tree = data.trees.cast<TreeRecord?>().firstWhere(
      (item) =>
          item?.id == record.treeId ||
          (item?.number == record.treeNumber &&
              item?.fieldId == record.fieldId),
      orElse: () => null,
    );
    final asset = PestIconService.assetFor(record.pest);
    final stages = record.stages.entries
        .where((entry) => entry.value > 0)
        .toList();
    showModalBottomSheet<void>(
      context: context,
      useSafeArea: true,
      showDragHandle: true,
      isScrollControlled: true,
      builder: (sheetContext) => Padding(
        padding: const EdgeInsets.fromLTRB(18, 0, 18, 18),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Container(
                  width: 54,
                  height: 54,
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFF3D7),
                    borderRadius: BorderRadius.circular(27),
                  ),
                  child: asset == null
                      ? const Icon(Icons.bug_report, color: AppColors.danger)
                      : SvgPicture.asset(asset),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        record.pest,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: AppColors.navy,
                        ),
                      ),
                      Text(
                        '${_shortDate(record.date)} · Árbol ${record.treeNumber}',
                        style: const TextStyle(
                          color: Color(0xFF60736C),
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 11,
                    vertical: 7,
                  ),
                  decoration: BoxDecoration(
                    color: record.total > 0
                        ? const Color(0xFFFFE8DC)
                        : AppColors.mint,
                    borderRadius: BorderRadius.circular(7),
                  ),
                  child: Text(
                    'Total ${record.total.toStringAsFixed(0)}',
                    style: TextStyle(
                      fontWeight: FontWeight.w900,
                      color: record.total > 0
                          ? AppColors.danger
                          : AppColors.forest,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            if (!record.found)
              const ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Icon(Icons.check_circle, color: AppColors.forest),
                title: Text(
                  'Sin presencia',
                  style: TextStyle(fontWeight: FontWeight.w800),
                ),
              )
            else
              Wrap(
                spacing: 7,
                runSpacing: 7,
                children: stages
                    .map(
                      (entry) => Chip(
                        label: Text(
                          '${_stageLabel(entry.key)} ${entry.value.toStringAsFixed(0)}',
                        ),
                      ),
                    )
                    .toList(),
              ),
            if (record.foundAt.isNotEmpty) ...[
              const SizedBox(height: 11),
              Text(
                'Encontrado en: ${record.foundAt}',
                style: const TextStyle(
                  color: Color(0xFF52655E),
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
            const SizedBox(height: 16),
            if (tree != null)
              FilledButton.icon(
                onPressed: () {
                  Navigator.pop(sheetContext);
                  _showTree(tree);
                },
                icon: const Icon(Icons.park_outlined),
                label: const Text('Abrir árbol y editar punto'),
              ),
          ],
        ),
      ),
    );
  }

  Future<void> _pickDate(bool from) async {
    final current = from ? _from : _to;
    final picked = await showDatePicker(
      context: context,
      firstDate: DateTime(2020),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      initialDate: current ?? DateTime.now(),
    );
    if (picked != null) {
      setState(() {
        if (from) {
          _from = picked;
        } else {
          _to = picked;
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading && _data == null) {
      return const Scaffold(
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(),
              SizedBox(height: 14),
              Text(
                'Preparando monitoreo...',
                style: TextStyle(fontWeight: FontWeight.w800),
              ),
            ],
          ),
        ),
      );
    }
    if (_error != null && _data == null) {
      return Scaffold(
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.cloud_off, size: 52, color: AppColors.danger),
                const SizedBox(height: 12),
                Text(_error!, textAlign: TextAlign.center),
                const SizedBox(height: 16),
                FilledButton(
                  onPressed: _bootstrap,
                  child: const Text('Reintentar'),
                ),
              ],
            ),
          ),
        ),
      );
    }
    final data = _data!;
    final geo = _geoData!;
    final records = _filteredMonitorings;
    final total = records.fold<double>(0, (sum, row) => sum + row.total);
    return LoadingOverlay(
      loading: _operationLoading,
      message: _operationMessage,
      child: Scaffold(
        appBar: AppBar(
          titleSpacing: 14,
          title: const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Monitoreo de plagas',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
              ),
              Text(
                'Agrícola El Canelillo',
                style: TextStyle(
                  fontSize: 11,
                  color: Color(0xFF60736C),
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          actions: [
            IconButton(
              onPressed: _sync,
              tooltip: 'Sincronizar',
              icon: Badge(
                isLabelVisible: _pendingCount > 0,
                label: Text('$_pendingCount'),
                child: const Icon(Icons.sync),
              ),
            ),
            PopupMenuButton<String>(
              onSelected: (value) {
                if (value == 'logout') _logout();
              },
              itemBuilder: (_) => const [
                PopupMenuItem(
                  value: 'logout',
                  child: ListTile(
                    leading: Icon(Icons.logout),
                    title: Text('Cerrar sesión'),
                    contentPadding: EdgeInsets.zero,
                  ),
                ),
              ],
            ),
          ],
        ),
        body: Column(
          children: [
            AnimatedSize(
              duration: const Duration(milliseconds: 220),
              curve: Curves.easeOutCubic,
              child: _FilterBar(
                pests: data.pests,
                pest: _pest,
                mode: _mode,
                from: _from,
                to: _to,
                count: records.length,
                total: total,
                fromCache: data.fromCache,
                expanded: _filtersExpanded,
                showTrees: _showTrees,
                fieldFilterCount: _fieldFilterCount,
                activeLayerCount: _activeLayerCount,
                onToggleExpanded: () =>
                    setState(() => _filtersExpanded = !_filtersExpanded),
                onOpenFieldFilters: _showFieldFilters,
                onOpenLayers: _showLayerSettings,
                onPestChanged: (value) => setState(() => _pest = value),
                onModeChanged: (value) => setState(() => _mode = value),
                onFrom: () => _pickDate(true),
                onTo: () => _pickDate(false),
              ),
            ),
            Expanded(
              child: SafeArea(
                top: false,
                minimum: const EdgeInsets.only(bottom: 6),
                child: Stack(
                  children: [
                    Positioned.fill(
                      child: GoogleMap(
                        initialCameraPosition: CameraPosition(
                          target: geo.center,
                          zoom: 15.2,
                        ),
                        mapType: MapType.hybrid,
                        myLocationEnabled: _locationGranted,
                        myLocationButtonEnabled: false,
                        compassEnabled: true,
                        zoomControlsEnabled: false,
                        mapToolbarEnabled: false,
                        padding: const EdgeInsets.only(bottom: 92),
                        polygons: geo.polygons(
                          data.fields,
                          fillColors: _blockHeatColors,
                        ),
                        markers: _mapMarkers,
                        onMapCreated: (controller) =>
                            _mapController = controller,
                        onCameraMove: (position) =>
                            _pendingMapZoom = position.zoom,
                        onCameraIdle: () {
                          if ((_pendingMapZoom - _mapZoom).abs() >= .15) {
                            setState(() => _mapZoom = _pendingMapZoom);
                          }
                        },
                      ),
                    ),
                    Positioned(
                      left: 12,
                      right: 12,
                      bottom: 88,
                      child: Align(
                        alignment: Alignment.bottomLeft,
                        child: _MapLegend(
                          mode: _mode,
                          showTrees: _showTrees,
                          pest: _pest,
                          riskScale: _riskScale,
                        ),
                      ),
                    ),
                    Positioned(
                      right: 12,
                      bottom: 14,
                      child: Column(
                        children: [
                          FloatingActionButton.small(
                            heroTag: 'location',
                            backgroundColor: Colors.white,
                            foregroundColor: _locationGranted
                                ? AppColors.forest
                                : AppColors.amber,
                            tooltip: 'Mi ubicación',
                            onPressed: () async {
                              await _prepareLocation();
                              final position = await _currentLocation();
                              if (position == null) return;
                              await _mapController?.animateCamera(
                                CameraUpdate.newLatLngZoom(position, 18),
                              );
                            },
                            child: const Icon(Icons.my_location),
                          ),
                          const SizedBox(height: 10),
                          FloatingActionButton.extended(
                            heroTag: 'new_tree',
                            onPressed: _showAddOptions,
                            icon: const Icon(Icons.add_location_alt_outlined),
                            label: const Text('Añadir'),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _AddOption extends StatelessWidget {
  const _AddOption({
    required this.icon,
    required this.title,
    required this.description,
    required this.onTap,
  });

  final Widget icon;
  final String title;
  final String description;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => InkWell(
    onTap: onTap,
    borderRadius: BorderRadius.circular(8),
    child: Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF5FAF7),
        border: Border.all(color: AppColors.line),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          SizedBox(width: 42, height: 42, child: icon),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.w900,
                    color: AppColors.navy,
                  ),
                ),
                Text(
                  description,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFF60736C),
                  ),
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right),
        ],
      ),
    ),
  );
}

class _FilterBar extends StatelessWidget {
  const _FilterBar({
    required this.pests,
    required this.pest,
    required this.mode,
    required this.from,
    required this.to,
    required this.count,
    required this.total,
    required this.fromCache,
    required this.expanded,
    required this.showTrees,
    required this.fieldFilterCount,
    required this.activeLayerCount,
    required this.onToggleExpanded,
    required this.onOpenFieldFilters,
    required this.onOpenLayers,
    required this.onPestChanged,
    required this.onModeChanged,
    required this.onFrom,
    required this.onTo,
  });

  final List<PestCatalog> pests;
  final String? pest;
  final MonitoringMapMode mode;
  final DateTime? from;
  final DateTime? to;
  final int count;
  final double total;
  final bool fromCache;
  final bool expanded;
  final bool showTrees;
  final int fieldFilterCount;
  final int activeLayerCount;
  final VoidCallback onToggleExpanded;
  final VoidCallback onOpenFieldFilters;
  final VoidCallback onOpenLayers;
  final ValueChanged<String?> onPestChanged;
  final ValueChanged<MonitoringMapMode> onModeChanged;
  final VoidCallback onFrom;
  final VoidCallback onTo;

  String _date(DateTime? value) => value == null
      ? '--/--'
      : '${value.day.toString().padLeft(2, '0')}/${value.month.toString().padLeft(2, '0')}';

  @override
  Widget build(BuildContext context) {
    final selectedAsset = pest == null ? null : PestIconService.assetFor(pest!);
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onVerticalDragEnd: (details) {
        final velocity = details.primaryVelocity ?? 0;
        if ((velocity < -120 && expanded) || (velocity > 120 && !expanded)) {
          onToggleExpanded();
        }
      },
      child: Material(
        color: Colors.white,
        elevation: 2,
        child: expanded
            ? Padding(
                padding: const EdgeInsets.fromLTRB(12, 8, 12, 7),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            initialValue: pest,
                            isExpanded: true,
                            decoration: InputDecoration(
                              labelText: 'Plaga',
                              prefixIcon: selectedAsset == null
                                  ? const Icon(Icons.bug_report_outlined)
                                  : Padding(
                                      padding: const EdgeInsets.all(10),
                                      child: SvgPicture.asset(selectedAsset),
                                    ),
                            ),
                            items: pests
                                .map(
                                  (item) => DropdownMenuItem(
                                    value: item.name,
                                    child: Text(
                                      item.name,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                )
                                .toList(),
                            onChanged: onPestChanged,
                          ),
                        ),
                        IconButton(
                          onPressed: onOpenFieldFilters,
                          tooltip: 'Especie, potrero y bloque',
                          icon: Badge(
                            isLabelVisible: fieldFilterCount > 0,
                            label: Text('$fieldFilterCount'),
                            child: const Icon(Icons.tune),
                          ),
                        ),
                        IconButton(
                          onPressed: onToggleExpanded,
                          tooltip: 'Ocultar filtros',
                          icon: const Icon(Icons.keyboard_arrow_up),
                        ),
                      ],
                    ),
                    const SizedBox(height: 7),
                    Row(
                      children: [
                        Expanded(
                          child: SegmentedButton<MonitoringMapMode>(
                            showSelectedIcon: false,
                            segments: const [
                              ButtonSegment(
                                value: MonitoringMapMode.heat,
                                icon: Icon(Icons.gradient, size: 18),
                                label: Text('Calor'),
                              ),
                              ButtonSegment(
                                value: MonitoringMapMode.points,
                                icon: Icon(
                                  Icons.location_on_outlined,
                                  size: 18,
                                ),
                                label: Text('Puntos'),
                              ),
                            ],
                            selected: {mode},
                            onSelectionChanged: (selection) =>
                                onModeChanged(selection.first),
                          ),
                        ),
                        const SizedBox(width: 8),
                        OutlinedButton.icon(
                          onPressed: onOpenLayers,
                          icon: const Icon(Icons.layers_outlined, size: 18),
                          label: Text('Capas $activeLayerCount'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 7),
                    Row(
                      children: [
                        _DateButton(
                          label: 'Desde',
                          value: _date(from),
                          onTap: onFrom,
                        ),
                        const SizedBox(width: 6),
                        _DateButton(
                          label: 'Hasta',
                          value: _date(to),
                          onTap: onTo,
                        ),
                        const Spacer(),
                        Flexible(
                          child: Text(
                            '$count registros · ${total.toStringAsFixed(0)} total',
                            textAlign: TextAlign.end,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: AppColors.navy,
                            ),
                          ),
                        ),
                        if (fromCache)
                          const Padding(
                            padding: EdgeInsets.only(left: 5),
                            child: Icon(
                              Icons.offline_bolt,
                              size: 17,
                              color: AppColors.amber,
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              )
            : InkWell(
                onTap: onToggleExpanded,
                child: SizedBox(
                  height: 42,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: Row(
                      children: [
                        Icon(
                          mode == MonitoringMapMode.heat
                              ? Icons.gradient
                              : Icons.location_on_outlined,
                          size: 19,
                          color: AppColors.forest,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            '${mode == MonitoringMapMode.heat ? 'Calor' : 'Puntos'} · ${pest ?? 'Plaga'}',
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontWeight: FontWeight.w800,
                              color: AppColors.navy,
                            ),
                          ),
                        ),
                        if (showTrees)
                          Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: Image.asset(
                              'assets/markers/tree.png',
                              width: 21,
                              height: 21,
                            ),
                          ),
                        Text(
                          '$count reg.',
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF60736C),
                          ),
                        ),
                        const SizedBox(width: 4),
                        const Icon(Icons.keyboard_arrow_down),
                      ],
                    ),
                  ),
                ),
              ),
      ),
    );
  }
}

class _DateButton extends StatelessWidget {
  const _DateButton({
    required this.label,
    required this.value,
    required this.onTap,
  });
  final String label;
  final String value;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => InkWell(
    onTap: onTap,
    borderRadius: BorderRadius.circular(7),
    child: Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 6),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.line),
        borderRadius: BorderRadius.circular(7),
      ),
      child: Row(
        children: [
          const Icon(Icons.calendar_month_outlined, size: 16),
          const SizedBox(width: 5),
          Text(
            '$label $value',
            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
          ),
        ],
      ),
    ),
  );
}

class _MapLegend extends StatelessWidget {
  const _MapLegend({
    required this.mode,
    required this.showTrees,
    required this.pest,
    required this.riskScale,
  });
  final MonitoringMapMode mode;
  final bool showTrees;
  final String? pest;
  final _RiskScale riskScale;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
    decoration: BoxDecoration(
      color: Colors.white.withValues(alpha: .94),
      borderRadius: BorderRadius.circular(7),
      boxShadow: const [BoxShadow(color: Color(0x33000000), blurRadius: 10)],
    ),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (mode == MonitoringMapMode.points)
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (pest != null && PestIconService.assetFor(pest!) != null)
                SvgPicture.asset(
                  PestIconService.assetFor(pest!)!,
                  width: 22,
                  height: 22,
                )
              else
                const Icon(Icons.bug_report, size: 20),
              const SizedBox(width: 6),
              const Text(
                'Toca un punto para ver detalle',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800),
              ),
            ],
          )
        else
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                riskScale.positives == 0
                    ? '${pest ?? 'Plaga'} · sin presencia'
                    : '${pest ?? 'Plaga'} · mín. ${riskScale.minimum.toStringAsFixed(0)} · máx. ${riskScale.maximum.toStringAsFixed(0)}',
                style: const TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(height: 5),
              const Wrap(
                spacing: 7,
                runSpacing: 4,
                children: [
                  _LegendDot(color: Color(0xFF147D64), label: '0'),
                  _LegendDot(color: Color(0xFF78C98B), label: 'Muy baja'),
                  _LegendDot(color: Color(0xFFB8D96B), label: 'Baja'),
                  _LegendDot(color: Color(0xFFF0CF4A), label: 'Media'),
                  _LegendDot(color: Color(0xFFEE9638), label: 'Alta'),
                  _LegendDot(color: Color(0xFFD9362B), label: 'Muy alta'),
                ],
              ),
            ],
          ),
        if (showTrees) ...[
          const SizedBox(height: 5),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Image.asset('assets/markers/tree.png', width: 20, height: 20),
              const SizedBox(width: 6),
              const Text(
                'Árbol editable',
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700),
              ),
            ],
          ),
        ],
      ],
    ),
  );
}

class _LegendDot extends StatelessWidget {
  const _LegendDot({required this.color, required this.label});
  final Color color;
  final String label;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(right: 8),
    child: Row(
      children: [
        Container(
          width: 9,
          height: 9,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 3),
        Text(
          label,
          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800),
        ),
      ],
    ),
  );
}

String _shortDate(DateTime value) =>
    '${value.day.toString().padLeft(2, '0')}/'
    '${value.month.toString().padLeft(2, '0')}/${value.year}';

int _naturalCompare(String left, String right) {
  final leftNumber = int.tryParse(left.trim());
  final rightNumber = int.tryParse(right.trim());
  if (leftNumber != null && rightNumber != null) {
    return leftNumber.compareTo(rightNumber);
  }
  if (leftNumber != null) return -1;
  if (rightNumber != null) return 1;
  return left.toLowerCase().compareTo(right.toLowerCase());
}

String _potreroLabel(String value) {
  if (value == 'Todos') return value;
  return RegExp(r'^\d').hasMatch(value) ? 'P$value' : value;
}

String _stageLabel(String value) => switch (value) {
  'huevos' => 'Huevos',
  'ninfas_1' => 'Ninfa 1',
  'ninfas_2' => 'Ninfa 2',
  'ninfas_3' => 'Ninfa 3',
  'adultos' => 'Adultos',
  'larvas' => 'Larvas',
  'pupas' => 'Pupas',
  _ => value,
};

class _RiskScale {
  const _RiskScale({
    required this.bounds,
    required this.minimum,
    required this.maximum,
    required this.positives,
  });

  static const colors = [
    Color(0xFF147D64),
    Color(0xFF78C98B),
    Color(0xFFB8D96B),
    Color(0xFFF0CF4A),
    Color(0xFFEE9638),
    Color(0xFFD9362B),
  ];

  final List<double> bounds;
  final double minimum;
  final double maximum;
  final int positives;

  factory _RiskScale.fromRecords(List<MonitoringRecord> records) {
    final values =
        records
            .map((record) => record.total)
            .where((value) => value > 0)
            .toList()
          ..sort();
    if (values.isEmpty) {
      return const _RiskScale(bounds: [], minimum: 0, maximum: 0, positives: 0);
    }
    final bounds = <double>[];
    for (final ratio in const [.2, .4, .6, .8, 1.0]) {
      final index = (values.length * ratio).ceil().clamp(1, values.length) - 1;
      final value = values[index];
      if (bounds.isEmpty || value > bounds.last) bounds.add(value);
    }
    return _RiskScale(
      bounds: bounds,
      minimum: values.first,
      maximum: values.last,
      positives: values.length,
    );
  }

  int level(double value) {
    if (value <= 0) return 0;
    if (bounds.isEmpty || bounds.length == 1) return 1;
    final matching = bounds.indexWhere((bound) => value <= bound);
    final index = matching >= 0 ? matching : bounds.length - 1;
    return 1 + (index * 4 / (bounds.length - 1)).round();
  }
}
