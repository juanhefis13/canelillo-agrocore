import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../core/app_theme.dart';

class MapMarkerService {
  static final Map<String, Future<BitmapDescriptor>> _fieldCache = {};
  static final Map<String, Future<BitmapDescriptor>> _potreroCache = {};
  static final Map<String, Future<BitmapDescriptor>> _casetaCache = {};
  static final Map<String, Future<BitmapDescriptor>> _treeCache = {};
  static Future<ui.Image>? _treeImage;

  static Future<BitmapDescriptor> fieldLabel(String label) =>
      blockLabel(label.replaceFirst(RegExp(r'^.*·\s*'), ''));

  static Future<BitmapDescriptor> blockLabel(String label) =>
      _fieldCache.putIfAbsent(label, () => _buildMapLabel(label, false));

  static Future<BitmapDescriptor> potreroLabel(String label) =>
      _potreroCache.putIfAbsent(label, () => _buildMapLabel(label, true));

  static Future<BitmapDescriptor> casetaLabel(String label) =>
      _casetaCache.putIfAbsent(label, () => _buildCasetaLabel(label));

  static Future<BitmapDescriptor> treeWithNumber(String number) =>
      _treeCache.putIfAbsent(number, () => _buildTreeMarker(number));

  static Future<BitmapDescriptor> _buildMapLabel(
    String label,
    bool potrero,
  ) async {
    final fontSize = potrero ? 20.0 : 13.0;
    final measure = TextPainter(
      text: TextSpan(
        text: label,
        style: TextStyle(fontSize: fontSize, fontWeight: FontWeight.w900),
      ),
      textDirection: TextDirection.ltr,
      maxLines: 1,
    )..layout();
    final width = (measure.width + 12).ceilToDouble();
    final height = (measure.height + 10).ceilToDouble();
    final recorder = ui.PictureRecorder();
    final canvas = Canvas(recorder);
    final offset = Offset((width - measure.width) / 2, 3);
    final outline = TextPainter(
      text: TextSpan(
        text: label,
        style: TextStyle(
          fontSize: fontSize,
          fontWeight: FontWeight.w900,
          foreground: Paint()
            ..style = PaintingStyle.stroke
            ..strokeWidth = potrero ? 5 : 4
            ..color = Colors.black,
        ),
      ),
      textDirection: TextDirection.ltr,
      maxLines: 1,
    )..layout();
    final fill = TextPainter(
      text: TextSpan(
        text: label,
        style: TextStyle(
          color: potrero ? Colors.white : const Color(0xFFFFD21F),
          fontSize: fontSize,
          fontWeight: FontWeight.w900,
        ),
      ),
      textDirection: TextDirection.ltr,
      maxLines: 1,
    )..layout();
    outline.paint(canvas, offset);
    fill.paint(canvas, offset);
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

  static Future<BitmapDescriptor> _buildCasetaLabel(String label) async {
    final caption = TextPainter(
      text: TextSpan(
        text: label,
        style: const TextStyle(
          color: AppColors.navy,
          fontSize: 11,
          fontWeight: FontWeight.w900,
        ),
      ),
      textDirection: TextDirection.ltr,
      maxLines: 1,
      ellipsis: '…',
    )..layout(maxWidth: 104);
    final width = (caption.width + 48).clamp(92, 150).toDouble();
    const height = 38.0;
    final recorder = ui.PictureRecorder();
    final canvas = Canvas(recorder);
    final background = RRect.fromRectAndRadius(
      Rect.fromLTWH(1, 1, width - 2, height - 3),
      const Radius.circular(7),
    );
    canvas.drawShadow(Path()..addRRect(background), Colors.black, 3, true);
    canvas.drawRRect(background, Paint()..color = Colors.white);
    canvas.drawRRect(
      background,
      Paint()
        ..color = const Color(0xFF0A8C78)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2,
    );
    final home = TextPainter(
      text: TextSpan(
        text: String.fromCharCode(Icons.home_rounded.codePoint),
        style: TextStyle(
          color: const Color(0xFF087A58),
          fontSize: 24,
          fontFamily: Icons.home_rounded.fontFamily,
          package: Icons.home_rounded.fontPackage,
        ),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    home.paint(canvas, const Offset(9, 6));
    caption.paint(canvas, Offset(39, (height - caption.height) / 2 - 1));
    return _descriptor(recorder, width.ceil(), height.ceil(), width, height);
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
