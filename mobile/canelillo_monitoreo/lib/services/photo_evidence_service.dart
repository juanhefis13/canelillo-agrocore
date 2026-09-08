import 'dart:io';

import 'package:image_picker/image_picker.dart';
import 'package:path/path.dart' as path;
import 'package:path_provider/path_provider.dart';
import 'package:uuid/uuid.dart';

import '../models/models.dart';

class PhotoEvidenceService {
  PhotoEvidenceService({ImagePicker? picker})
    : _picker = picker ?? ImagePicker();

  final ImagePicker _picker;
  final _uuid = const Uuid();

  Future<PhotoEvidence?> capture(ImageSource source) async {
    final selected = await _picker.pickImage(
      source: source,
      imageQuality: 82,
      maxWidth: 1920,
    );
    if (selected == null) return null;

    final root = await getApplicationDocumentsDirectory();
    final directory = Directory(path.join(root.path, 'monitoring_photos'));
    await directory.create(recursive: true);
    final id = _uuid.v4();
    final extension = _normalizedExtension(selected.path);
    final destination = path.join(directory.path, '$id$extension');
    final file = await File(selected.path).copy(destination);
    return PhotoEvidence(
      id: id,
      clientOperationId: _uuid.v4(),
      localPath: file.path,
      mimeType: _mimeType(extension),
      sizeBytes: await file.length(),
      createdAt: DateTime.now(),
    );
  }

  Future<void> delete(PhotoEvidence photo) async {
    final file = File(photo.localPath);
    if (await file.exists()) await file.delete();
  }

  String _normalizedExtension(String sourcePath) {
    final extension = path.extension(sourcePath).toLowerCase();
    return switch (extension) {
      '.png' => '.png',
      '.heic' || '.heif' => '.heic',
      _ => '.jpg',
    };
  }

  String _mimeType(String extension) => switch (extension) {
    '.png' => 'image/png',
    '.heic' => 'image/heic',
    _ => 'image/jpeg',
  };
}
