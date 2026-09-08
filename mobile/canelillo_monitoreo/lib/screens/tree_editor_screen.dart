import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:uuid/uuid.dart';

import '../models/models.dart';
import '../services/geo_service.dart';
import '../services/map_marker_service.dart';
import '../widgets/loading_overlay.dart';

class TreeEditorScreen extends StatefulWidget {
  const TreeEditorScreen({
    required this.fields,
    required this.geoData,
    required this.initialPosition,
    this.tree,
    super.key,
  });

  final List<FieldBlock> fields;
  final GeoData geoData;
  final LatLng initialPosition;
  final TreeRecord? tree;

  @override
  State<TreeEditorScreen> createState() => _TreeEditorScreenState();
}

class _TreeEditorScreenState extends State<TreeEditorScreen> {
  final _formKey = GlobalKey<FormState>();
  final _number = TextEditingController();
  final _row = TextEditingController();
  final _sector = TextEditingController();
  late LatLng _position;
  FieldBlock? _field;
  String? _selectedPotrero;
  List<FieldBlock> _fieldCandidates = const [];
  bool _locating = false;
  bool _locationGranted = false;
  String _locationSource = 'manual';
  double? _accuracyMeters;
  BitmapDescriptor? _treeIcon;
  Map<String, BitmapDescriptor> _blockLabelIcons = const {};
  Map<String, BitmapDescriptor> _potreroLabelIcons = const {};
  double _mapZoom = 18;
  double _pendingMapZoom = 18;

  @override
  void initState() {
    super.initState();
    final tree = widget.tree;
    _position = tree?.position ?? widget.initialPosition;
    _number.text = tree?.number ?? '';
    _row.text = tree?.row ?? '';
    _sector.text = tree?.monitoringSector ?? '';
    _locationSource = tree?.locationSource ?? 'manual';
    _accuracyMeters = tree?.accuracyMeters;
    _fieldCandidates = widget.geoData.fieldsAt(_position, widget.fields);
    _field = tree == null
        ? (_fieldCandidates.isEmpty ? null : _fieldCandidates.first)
        : widget.fields.cast<FieldBlock?>().firstWhere(
            (field) => field?.id == tree.fieldId,
            orElse: () =>
                _fieldCandidates.isEmpty ? null : _fieldCandidates.first,
          );
    _selectedPotrero = _field?.potrero;
    _prepareMap();
  }

  Future<void> _prepareMap() async {
    final icon = await BitmapDescriptor.asset(
      const ImageConfiguration(size: Size(46, 46)),
      'assets/markers/tree.png',
      width: 46,
      height: 46,
    );
    final permission = await Geolocator.checkPermission();
    final blockIcons = <String, BitmapDescriptor>{};
    final potreroIcons = <String, BitmapDescriptor>{};
    await Future.wait([
      ...widget.geoData.blockLabels.map((label) async {
        blockIcons[label.text] = await MapMarkerService.blockLabel(label.text);
      }),
      ...widget.geoData.potreroLabels.map((label) async {
        potreroIcons[label.text] = await MapMarkerService.potreroLabel(
          label.text,
        );
      }),
    ]);
    if (!mounted) return;
    setState(() {
      _treeIcon = icon;
      _blockLabelIcons = blockIcons;
      _potreroLabelIcons = potreroIcons;
      _locationGranted =
          permission == LocationPermission.always ||
          permission == LocationPermission.whileInUse;
    });
  }

  @override
  void dispose() {
    _number.dispose();
    _row.dispose();
    _sector.dispose();
    super.dispose();
  }

  void _move(
    LatLng position, {
    String locationSource = 'manual',
    double? accuracyMeters,
  }) {
    final candidates = widget.geoData.fieldsAt(position, widget.fields);
    setState(() {
      _position = position;
      _locationSource = locationSource;
      _accuracyMeters = accuracyMeters;
      _fieldCandidates = candidates;
      _field = candidates.cast<FieldBlock?>().firstWhere(
        (field) => field?.id == _field?.id,
        orElse: () => candidates.isEmpty ? null : candidates.first,
      );
      _selectedPotrero = _field?.potrero;
    });
  }

  List<String> get _potreroOptions {
    final values = widget.fields.map((field) => field.potrero).toSet().toList();
    values.sort(_naturalCompare);
    return values;
  }

  List<FieldBlock> get _blockOptions {
    final potrero = _selectedPotrero;
    if (potrero == null) return const [];
    final values = widget.fields
        .where((field) => field.potrero == potrero)
        .toList();
    values.sort((left, right) => _naturalCompare(left.block, right.block));
    return values;
  }

  Set<Marker> get _mapLabels {
    final markers = <Marker>{};
    if (_mapZoom >= 15) {
      for (final label in widget.geoData.blockLabels) {
        final icon = _blockLabelIcons[label.text];
        if (icon == null) continue;
        markers.add(
          Marker(
            markerId: MarkerId('editor_${label.id}'),
            position: label.position,
            icon: icon,
            anchor: const Offset(.5, .5),
            flat: true,
            zIndexInt: 21,
          ),
        );
      }
    }
    if (_mapZoom <= 16) {
      for (final label in widget.geoData.potreroLabels) {
        final icon = _potreroLabelIcons[label.text];
        if (icon == null) continue;
        markers.add(
          Marker(
            markerId: MarkerId('editor_${label.id}'),
            position: label.position,
            icon: icon,
            anchor: const Offset(.5, .5),
            flat: true,
            zIndexInt: 20,
          ),
        );
      }
    }
    return markers;
  }

  Future<void> _useGps() async {
    setState(() => _locating = true);
    try {
      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) {
        throw Exception('Permiso de ubicación denegado');
      }
      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 20),
        ),
      );
      if (mounted) setState(() => _locationGranted = true);
      _move(
        LatLng(position.latitude, position.longitude),
        locationSource: 'gps',
        accuracyMeters: position.accuracy,
      );
      if (position.accuracy > 15 && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Precisión GPS ±${position.accuracy.toStringAsFixed(0)} m. '
              'Confirma el bloque o ajusta el punto manualmente.',
            ),
          ),
        );
      }
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('$error')));
      }
    } finally {
      if (mounted) setState(() => _locating = false);
    }
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    if (_field == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Selecciona el potrero y bloque.')),
      );
      return;
    }
    final selectedInsidePolygon = _fieldCandidates.any(
      (candidate) => candidate.id == _field!.id,
    );
    if (!selectedInsidePolygon) {
      final confirmed = await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Confirmar bloque manual'),
          content: Text(
            'El punto está fuera del polígono de ${_field!.label}. '
            '¿Deseas guardar igualmente esta asignación manual?',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Revisar'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text('Confirmar'),
            ),
          ],
        ),
      );
      if (confirmed != true || !mounted) return;
      _locationSource = 'manual';
      _accuracyMeters = null;
    }
    final existing = widget.tree;
    Navigator.pop(
      context,
      TreeRecord(
        id: existing?.id ?? '',
        clientOperationId: existing?.clientOperationId ?? const Uuid().v4(),
        fieldId: _field!.id,
        number: _number.text.trim(),
        row: _row.text.trim(),
        monitoringSector: _sector.text.trim(),
        position: _position,
        active: true,
        referenceDate: existing?.referenceDate ?? DateTime.now(),
        locationSource: _locationSource,
        accuracyMeters: _accuracyMeters,
      ),
    );
  }

  @override
  Widget build(BuildContext context) => LoadingOverlay(
    loading: _locating,
    message: 'Buscando ubicación...',
    child: Scaffold(
      appBar: AppBar(
        title: Text(
          widget.tree == null
              ? 'Nuevo árbol'
              : 'Editar árbol ${widget.tree!.number}',
        ),
        actions: [
          IconButton(
            onPressed: _useGps,
            tooltip: 'Usar GPS',
            icon: const Icon(Icons.my_location),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: GoogleMap(
              initialCameraPosition: CameraPosition(
                target: _position,
                zoom: 18,
              ),
              mapType: MapType.hybrid,
              myLocationButtonEnabled: false,
              myLocationEnabled: _locationGranted,
              compassEnabled: true,
              polygons: widget.geoData.polygons(widget.fields),
              onTap: (position) => _move(position),
              markers: {
                ..._mapLabels,
                Marker(
                  markerId: const MarkerId('tree_edit'),
                  position: _position,
                  draggable: true,
                  onDragEnd: (position) => _move(position),
                  icon:
                      _treeIcon ??
                      BitmapDescriptor.defaultMarkerWithHue(
                        BitmapDescriptor.hueGreen,
                      ),
                  anchor: const Offset(.5, .8),
                  infoWindow: InfoWindow(
                    title: widget.tree == null
                        ? 'Nuevo árbol'
                        : 'Árbol ${widget.tree!.number}',
                    snippet:
                        'Arrastra o toca el mapa para cambiar la ubicación',
                  ),
                ),
              },
              onCameraMove: (position) => _pendingMapZoom = position.zoom,
              onCameraIdle: () {
                if ((_pendingMapZoom - _mapZoom).abs() >= .15) {
                  setState(() => _mapZoom = _pendingMapZoom);
                }
              },
            ),
          ),
          const Material(
            color: Color(0xFFEAF6F1),
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 14, vertical: 7),
              child: Row(
                children: [
                  Icon(Icons.open_with, size: 18),
                  SizedBox(width: 7),
                  Expanded(
                    child: Text(
                      'Arrastra el árbol o toca el mapa para escoger la ubicación.',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Material(
            elevation: 12,
            color: Colors.white,
            child: SafeArea(
              top: false,
              child: Form(
                key: _formKey,
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 14, 16, 12),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _DetectedField(field: _field, matches: _fieldCandidates),
                      const SizedBox(height: 7),
                      _LocationTrace(
                        source: _locationSource,
                        accuracyMeters: _accuracyMeters,
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: DropdownButtonFormField<String>(
                              key: ValueKey(
                                'potrero_${_selectedPotrero ?? ''}',
                              ),
                              initialValue: _selectedPotrero,
                              isExpanded: true,
                              decoration: const InputDecoration(
                                labelText: 'Potrero',
                                prefixIcon: Icon(Icons.landscape_outlined),
                              ),
                              items: _potreroOptions
                                  .map(
                                    (potrero) => DropdownMenuItem(
                                      value: potrero,
                                      child: Text(_potreroLabel(potrero)),
                                    ),
                                  )
                                  .toList(),
                              onChanged: (value) => setState(() {
                                _selectedPotrero = value;
                                if (_field?.potrero != value) _field = null;
                                _locationSource = 'manual';
                                _accuracyMeters = null;
                              }),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: DropdownButtonFormField<String>(
                              key: ValueKey(
                                'block_${_selectedPotrero ?? ''}_${_field?.id ?? ''}',
                              ),
                              initialValue: _field?.id,
                              isExpanded: true,
                              decoration: const InputDecoration(
                                labelText: 'Bloque',
                                prefixIcon: Icon(Icons.grid_view),
                              ),
                              items: _blockOptions
                                  .map(
                                    (field) => DropdownMenuItem(
                                      value: field.id,
                                      child: Text(
                                        'B${field.block}',
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                  )
                                  .toList(),
                              onChanged: _selectedPotrero == null
                                  ? null
                                  : (value) => setState(() {
                                      _field = _blockOptions
                                          .cast<FieldBlock?>()
                                          .firstWhere(
                                            (field) => field?.id == value,
                                            orElse: () => null,
                                          );
                                      if (!_fieldCandidates.any(
                                        (candidate) => candidate.id == value,
                                      )) {
                                        _locationSource = 'manual';
                                        _accuracyMeters = null;
                                      }
                                    }),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _number,
                              decoration: const InputDecoration(
                                labelText: 'Nº árbol',
                                prefixIcon: Icon(Icons.park_outlined),
                              ),
                              validator: (value) =>
                                  value == null || value.trim().isEmpty
                                  ? 'Requerido'
                                  : null,
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: TextFormField(
                              controller: _row,
                              decoration: const InputDecoration(
                                labelText: 'Hilera',
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      TextFormField(
                        controller: _sector,
                        decoration: const InputDecoration(
                          labelText: 'Sector de monitoreo',
                        ),
                      ),
                      const SizedBox(height: 12),
                      FilledButton.icon(
                        onPressed: _save,
                        icon: const Icon(Icons.save),
                        label: const Text('Guardar árbol'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    ),
  );
}

class _LocationTrace extends StatelessWidget {
  const _LocationTrace({required this.source, required this.accuracyMeters});

  final String source;
  final double? accuracyMeters;

  @override
  Widget build(BuildContext context) {
    final isGps = source == 'gps';
    final needsReview = isGps && (accuracyMeters ?? double.infinity) > 15;
    final color = needsReview
        ? const Color(0xFF9A5B00)
        : isGps
        ? const Color(0xFF087A58)
        : const Color(0xFF52665E);
    final background = needsReview
        ? const Color(0xFFFFF3D6)
        : isGps
        ? const Color(0xFFE9F7F0)
        : const Color(0xFFF0F4F2);
    final label = isGps
        ? 'GPS · ±${(accuracyMeters ?? 0).toStringAsFixed(0)} m'
        : source == 'importado'
        ? 'Ubicación importada'
        : 'Ubicación ajustada manualmente';
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
        decoration: BoxDecoration(
          color: background,
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: color.withValues(alpha: .35)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              needsReview
                  ? Icons.gps_not_fixed
                  : isGps
                  ? Icons.gps_fixed
                  : Icons.touch_app_outlined,
              color: color,
              size: 16,
            ),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                color: color,
                fontSize: 11,
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DetectedField extends StatelessWidget {
  const _DetectedField({required this.field, required this.matches});

  final FieldBlock? field;
  final List<FieldBlock> matches;

  @override
  Widget build(BuildContext context) {
    final current = field;
    final detected = matches.isNotEmpty;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: detected ? const Color(0xFFE9F7F0) : const Color(0xFFFFF5E0),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: detected ? const Color(0xFF9DD8BE) : const Color(0xFFF0C36B),
        ),
      ),
      child: current == null
          ? const Row(
              children: [
                Icon(Icons.location_searching, size: 20),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'El punto está fuera de un bloque. Muévelo o selecciona el bloque manualmente.',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
                  ),
                ),
              ],
            )
          : Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(
                  Icons.check_circle,
                  color: Color(0xFF087A58),
                  size: 20,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${current.label} · ${current.species} · ${current.variety}',
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${_number(current.hectares)} ha · ${_number(current.plants, decimals: 0)} plantas'
                        '${matches.length > 1 ? ' · ${matches.length} bloques posibles' : ''}',
                        style: const TextStyle(
                          fontSize: 11,
                          color: Color(0xFF52665E),
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
    );
  }
}

String _number(double value, {int decimals = 2}) {
  if (value == value.roundToDouble()) return value.toStringAsFixed(0);
  return value
      .toStringAsFixed(decimals)
      .replaceFirst(RegExp(r'0+$'), '')
      .replaceFirst(RegExp(r'\.$'), '');
}

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

String _potreroLabel(String value) =>
    RegExp(r'^\d').hasMatch(value) ? 'P$value' : value;
