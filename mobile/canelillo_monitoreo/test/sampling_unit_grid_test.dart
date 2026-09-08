import 'package:canelillo_monitoreo/widgets/sampling_unit_grid.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('la grilla muestra todas las unidades y permite seleccionar', (
    tester,
  ) async {
    var selected = 0;
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: SizedBox(
            width: 360,
            child: SamplingUnitGrid(
              quantity: 10,
              positiveUnits: const {3, 5},
              onUnitTap: (number) => selected = number,
            ),
          ),
        ),
      ),
    );

    expect(find.text('1'), findsOneWidget);
    expect(find.text('10'), findsOneWidget);
    expect(find.byKey(const ValueKey('sampling-unit-3')), findsOneWidget);
    expect(find.byKey(const ValueKey('sampling-unit-4')), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('sampling-unit-4')));
    expect(selected, 4);
  });
}
