import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../core/app_theme.dart';
import '../models/models.dart';
import '../services/photo_evidence_service.dart';

class PhotoEvidenceWidget extends StatefulWidget {
  const PhotoEvidenceWidget({
    required this.photos,
    required this.onChanged,
    super.key,
  });

  final List<PhotoEvidence> photos;
  final ValueChanged<List<PhotoEvidence>> onChanged;

  @override
  State<PhotoEvidenceWidget> createState() => _PhotoEvidenceWidgetState();
}

class _PhotoEvidenceWidgetState extends State<PhotoEvidenceWidget> {
  final _service = PhotoEvidenceService();
  bool _working = false;

  Future<void> _add(ImageSource source) async {
    setState(() => _working = true);
    try {
      final photo = await _service.capture(source);
      if (photo != null) widget.onChanged([...widget.photos, photo]);
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('No se pudo guardar la fotografía: $error')),
      );
    } finally {
      if (mounted) setState(() => _working = false);
    }
  }

  Future<void> _chooseSource() async {
    final source = await showModalBottomSheet<ImageSource>(
      context: context,
      useSafeArea: true,
      showDragHandle: true,
      builder: (context) => Padding(
        padding: const EdgeInsets.fromLTRB(14, 0, 14, 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.photo_camera_outlined),
              title: const Text('Tomar fotografía'),
              onTap: () => Navigator.pop(context, ImageSource.camera),
            ),
            ListTile(
              leading: const Icon(Icons.photo_library_outlined),
              title: const Text('Elegir de galería'),
              onTap: () => Navigator.pop(context, ImageSource.gallery),
            ),
          ],
        ),
      ),
    );
    if (source != null && mounted) await _add(source);
  }

  Future<void> _remove(PhotoEvidence photo) async {
    await _service.delete(photo);
    widget.onChanged(
      widget.photos.where((item) => item.id != photo.id).toList(),
    );
  }

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      Row(
        children: [
          const Expanded(
            child: Text(
              'Evidencia fotográfica',
              style: TextStyle(
                fontWeight: FontWeight.w900,
                color: AppColors.navy,
              ),
            ),
          ),
          TextButton.icon(
            onPressed: _working ? null : _chooseSource,
            icon: _working
                ? const SizedBox.square(
                    dimension: 16,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.add_a_photo_outlined),
            label: const Text('Añadir'),
          ),
        ],
      ),
      if (widget.photos.isNotEmpty)
        SizedBox(
          height: 92,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: widget.photos.length,
            separatorBuilder: (_, _) => const SizedBox(width: 8),
            itemBuilder: (context, index) {
              final photo = widget.photos[index];
              return Stack(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: Image.file(
                      File(photo.localPath),
                      width: 92,
                      height: 92,
                      fit: BoxFit.cover,
                      errorBuilder: (_, _, _) => Container(
                        width: 92,
                        height: 92,
                        color: AppColors.mint,
                        child: const Icon(Icons.broken_image_outlined),
                      ),
                    ),
                  ),
                  Positioned(
                    right: 3,
                    top: 3,
                    child: IconButton.filled(
                      tooltip: 'Quitar fotografía',
                      visualDensity: VisualDensity.compact,
                      iconSize: 16,
                      onPressed: () => _remove(photo),
                      icon: const Icon(Icons.close),
                    ),
                  ),
                ],
              );
            },
          ),
        ),
    ],
  );
}
