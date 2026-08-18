import 'package:flutter/widgets.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../models/models.dart';

class PestIconSet {
  const PestIconSet(this.icons);

  final List<BitmapDescriptor> icons;

  BitmapDescriptor forTotal(double total, double maximum) {
    if (total <= 0) return icons[0];
    final ratio = maximum <= 0 ? 1.0 : (total / maximum).clamp(0, 1);
    if (ratio <= .25) return icons[1];
    if (ratio <= .5) return icons[2];
    if (ratio <= .75) return icons[3];
    return icons[4];
  }
}

class PestIconService {
  static const _slugs = {
    'aranitaroja': 'aranita_roja',
    'chanchitoblanco': 'chanchito_blanco',
    'conchuelablanca': 'conchuela_blanca',
    'escama': 'escama',
    'mosquitablanca': 'mosquita_blanca',
    'pulgon': 'pulgon',
  };

  static Future<Map<String, PestIconSet>> loadAll(
    List<PestCatalog> pests,
  ) async {
    final result = <String, PestIconSet>{};
    await Future.wait(
      pests.map((pest) async {
        final slug = _slugFor(pest.name);
        if (slug == null) return;
        final icons = await Future.wait(
          List.generate(
            5,
            (band) => BitmapDescriptor.asset(
              const ImageConfiguration(size: Size(48, 48)),
              'assets/pests/${slug}_$band.png',
              width: 48,
              height: 48,
            ),
          ),
        );
        result[pest.name] = PestIconSet(icons);
      }),
    );
    return result;
  }

  static String? assetFor(String pest) {
    final slug = _slugFor(pest);
    return slug == null ? null : 'assets/pests/$slug.svg';
  }

  static String? _slugFor(String pest) {
    final normalized = _normalize(pest);
    for (final entry in _slugs.entries) {
      if (normalized.contains(entry.key) || entry.key.contains(normalized)) {
        return entry.value;
      }
    }
    return null;
  }
}

String _normalize(String value) => value
    .toLowerCase()
    .replaceAll('á', 'a')
    .replaceAll('é', 'e')
    .replaceAll('í', 'i')
    .replaceAll('ó', 'o')
    .replaceAll('ú', 'u')
    .replaceAll('ñ', 'n')
    .replaceAll(RegExp(r'[^a-z0-9]'), '');
