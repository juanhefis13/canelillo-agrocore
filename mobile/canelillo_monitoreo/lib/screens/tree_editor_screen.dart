import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:uuid/uuid.dart';

import '../models/models.dart';
import '../services/geo_service.dart';
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
  bool _locating = false;
  bool _locationGranted = false;
  BitmapDescriptor? _treeIcon;

  @override
  void initState() {
    super.initState();
    final tree = widget.tree;
    _position = tree?.position ?? widget.initialPosition;
    _number.text = tree?.number ?? '';
    _row.text = tree?.row ?? '';
    _sector.text = tree?.monitoringSector ?? '';
    _field = tree == null
        ? widget.geoData.fieldAt(_position, widget.fields)
        : widget.fields.cast<FieldBlock?>().firstWhere(
            (field) => field?.id == tree.fieldId,
            orElse: () => widget.geoData.fieldAt(_position, widget.fields),
          );
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
    if (!mounted) return;
    setState(() {
      _treeIcon = icon;
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

  void _move(LatLng position) {
    setState(() {
      _position = position;
      _field = widget.geoData.fieldAt(position, widget.fields) ?? _field;
    });
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
      _move(LatLng(position.latitude, position.longitude));
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

  void _save() {
    if (!_formKey.currentState!.validate()) return;
    if (_field == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Selecciona el potrero y bloque.')),
      );
      return;
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
              onTap: _move,
              markers: {
                Marker(
                  markerId: const MarkerId('tree_edit'),
                  position: _position,
                  draggable: true,
                  onDragEnd: _move,
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
                      DropdownButtonFormField<FieldBlock>(
                        initialValue: _field,
                        isExpanded: true,
                        decoration: const InputDecoration(
                          labelText: 'Potrero y bloque',
                          prefixIcon: Icon(Icons.grid_view),
                        ),
                        items: widget.fields
                            .map(
                              (field) => DropdownMenuItem(
                                value: field,
                                child: Text(
                                  '${field.label} · ${field.species} · ${field.variety}',
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            )
                            .toList(),
                        onChanged: (value) => setState(() => _field = value),
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
