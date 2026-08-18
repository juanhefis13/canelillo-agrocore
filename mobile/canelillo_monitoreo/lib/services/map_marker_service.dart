import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../core/app_theme.dart';

class MapMarkerService {
  static final Map<String, Future<BitmapDescriptor>> _fieldCache = {};
  static final Map<String, Future<BitmapDescriptor>> _treeCache = {};
  static Future<ui.Image>? _treeImage;

  static Future<BitmapDescriptor> fieldLabel(String label) =>
      _fieldCache.putIfAbsent(label, () => _buildFieldLabel(label));

  static Future<BitmapDescriptor> treeWithNumber(String number) =>
      _treeCache.putIfAbsent(number, () => _buildTreeMarker(number));

  static Future<BitmapDescriptor> _buildFieldLabel(String label) async {
    final text = TextPainter(
      text: TextSpan(
        text: label,
        style: const TextStyle(
          color: AppColors.navy,
          fontSize: 14,
          fontWeight: FontWeight.w900,
        ),
      ),
      textDirection: TextDirection.ltr,
      maxLines: 1,
    )..layout();
    final width = (text.width + 20).ceilToDouble();
    const height = 31.0;
    final recorder = ui.PictureRecorder();
    final canvas = Canvas(recorder);
    final rect = RRect.fromRectAndRadius(
      Rect.fromLTWH(1, 1, width - 2, height - 4),
      const Radius.circular(6),
    );
    canvas.drawShadow(Path()..addRRect(rect), Colors.black, 3, true);
    canvas.drawRRect(
      rect,
      Paint()..color = Colors.white.withValues(alpha: .94),
    );
    canvas.drawRRect(
      rect,
      Paint()
        ..color = AppColors.forest
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.5,
    );
    text.paint(canvas, Offset(10, (height - 4 - text.height) / 2));
    return _descriptor(recorder, width.ceil(), height.ceil(), width, height);
  }

  static Future<BitmapDescriptor> _buildTreeMarker(String number) async {
    final image = await (_treeImage ??= _loadTreeImage());
    const width = 62.0;
    const height = 70.0;
    final recorder = ui.PictureRecorder();
    final canvas = Canvas(recorder);
    final iconRect = const Rect.fromLTWH(11, 2, 40, 40);
    canvas.drawImageRect(
      image,
      Rect.fromLTWH(0, 0, image.width.toDouble(), image.height.toDouble()),
      iconRect,
      Paint(),
    );
    final pill = RRect.fromRectAndRadius(
      const Rect.fromLTWH(5, 43, 52, 22),
      const Radius.circular(7),
    );
    canvas.drawShadow(Path()..addRRect(pill), Colors.black, 3, true);
    canvas.drawRRect(pill, Paint()..color = Colors.white);
    canvas.drawRRect(
      pill,
      Paint()
        ..color = AppColors.forest
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2,
    );
    final text = TextPainter(
      text: TextSpan(
        text: number,
        style: const TextStyle(
          color: AppColors.navy,
          fontSize: 13,
          fontWeight: FontWeight.w900,
        ),
      ),
      textDirection: TextDirection.ltr,
      maxLines: 1,
      ellipsis: '…',
    )..layout(maxWidth: 44);
    text.paint(canvas, Offset((width - text.width) / 2, 46));
    return _descriptor(recorder, width.toInt(), height.toInt(), 44, 50);
  }

  static Future<ui.Image> _loadTreeImage() async {
    final bytes = await rootBundle.load('assets/markers/tree.png');
    final codec = await ui.instantiateImageCodec(bytes.buffer.asUint8List());
    final frame = await codec.getNextFrame();
    codec.dispose();
    return frame.image;
  }

  static Future<BitmapDescriptor> _descriptor(
    ui.PictureRecorder recorder,
    int pixelWidth,
    int pixelHeight,
    double displayWidth,
    double displayHeight,
  ) async {
    final image = await recorder.endRecording().toImage(
      pixelWidth,
      pixelHeight,
    );
    final bytes = await image.toByteData(format: ui.ImageByteFormat.png);
    image.dispose();
    if (bytes == null) return BitmapDescriptor.defaultMarker;
    return BitmapDescriptor.bytes(
      bytes.buffer.asUint8List(),
      width: displayWidth,
      height: displayHeight,
    );
  }
}
