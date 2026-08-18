import 'package:canelillo_monitoreo/services/pest_icon_service.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('relaciona los nombres de Supabase con sus iconos QGIS', () {
    expect(
      PestIconService.assetFor('Arañita roja'),
      'assets/pests/aranita_roja.svg',
    );
    expect(
      PestIconService.assetFor('CHANCHITO BLANCO'),
      'assets/pests/chanchito_blanco.svg',
    );
    expect(
      PestIconService.assetFor('Mosquita Blanca'),
      'assets/pests/mosquita_blanca.svg',
    );
    expect(PestIconService.assetFor('Plaga desconocida'), isNull);
  });
}
