import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../core/app_theme.dart';
import '../models/models.dart';
import '../services/geo_service.dart';

class TreePickerScreen extends StatefulWidget {
  const TreePickerScreen({
    required this.fields,
    required this.trees,
    required this.geoData,
    required this.treeIcons,
    required this.fieldIcons,
    required this.fieldCenters,
    required this.locationGranted,
    super.key,
  });

  final List<FieldBlock> fields;
  final List<TreeRecord> trees;
  final GeoData geoData;
  final Map<String, BitmapDescriptor> treeIcons;
  final Map<String, BitmapDescriptor> fieldIcons;
  final Map<String, LatLng> fieldCenters;
  final bool locationGranted;

  @override
  State<TreePickerScreen> createState() => _TreePickerScreenState();
}

class _TreePickerScreenState extends State<TreePickerScreen> {
  GoogleMapController? _controller;
  TreeRecord? _selected;

  Set<Marker> get _markers {
    final treeMarkers = widget.trees.map(
      (tree) => Marker(
        markerId: MarkerId('select_tree_${tree.id}'),
        position: tree.position,
        icon: widget.treeIcons[tree.number] ?? BitmapDescriptor.defaultMarker,
        anchor: const Offset(.5, .78),
        zIndexInt: _selected?.id == tree.id ? 70 : 40,
        onTap: () => setState(() => _selected = tree),
      ),
    );
    final fieldMarkers = widget.fields.map((field) {
      final position = widget.fieldCenters[field.id];
      final icon = widget.fieldIcons[field.id];
      if (position == null || icon == null) return null;
      return Marker(
        markerId: MarkerId('select_field_${field.id}'),
        position: position,
        icon: icon,
        flat: true,
        anchor: const Offset(.5, .5),
        zIndexInt: 10,
      );
    }).whereType<Marker>();
    return {...fieldMarkers, ...treeMarkers};
  }

  @override
  Widget build(BuildContext context) {
    final fields = {for (final field in widget.fields) field.id: field};
    final selectedField = _selected == null ? null : fields[_selected!.fieldId];
    return Scaffold(
      appBar: AppBar(
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Añadir monitoreo de plaga'),
            Text(
              'Selecciona el árbol monitoreado',
              style: TextStyle(fontSize: 11, color: Color(0xFF60736C)),
            ),
          ],
        ),
      ),
      body: SafeArea(
        top: false,
        child: Stack(
          children: [
            Positioned.fill(
              child: GoogleMap(
                initialCameraPosition: CameraPosition(
                  target: widget.geoData.center,
                  zoom: 16.5,
                ),
                mapType: MapType.hybrid,
                myLocationEnabled: widget.locationGranted,
                myLocationButtonEnabled: widget.locationGranted,
                compassEnabled: true,
                zoomControlsEnabled: false,
                padding: const EdgeInsets.only(bottom: 130),
                polygons: widget.geoData.polygons(widget.fields),
                markers: _markers,
                onMapCreated: (controller) => _controller = controller,
              ),
            ),
            Positioned(
              left: 12,
              right: 12,
              top: 10,
              child: IgnorePointer(
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 11,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: .94),
                    borderRadius: BorderRadius.circular(7),
                    boxShadow: const [
                      BoxShadow(color: Color(0x33000000), blurRadius: 10),
                    ],
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.touch_app, size: 19, color: AppColors.forest),
                      SizedBox(width: 7),
                      Expanded(
                        child: Text(
                          'Toca un árbol numerado para registrar la plaga.',
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
            ),
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: Material(
                elevation: 14,
                color: Colors.white,
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _selected == null
                                  ? 'Ningún árbol seleccionado'
                                  : 'Árbol ${_selected!.number}',
                              style: const TextStyle(
                                fontWeight: FontWeight.w900,
                                color: AppColors.navy,
                              ),
                            ),
                            Text(
                              selectedField?.label ??
                                  'Selecciona una estación del mapa',
                              style: const TextStyle(
                                fontSize: 12,
                                color: Color(0xFF60736C),
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ),
                      FilledButton.icon(
                        onPressed: _selected == null
                            ? null
                            : () => Navigator.pop(context, _selected),
                        icon: const Icon(Icons.arrow_forward),
                        label: const Text('Continuar'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }
}
