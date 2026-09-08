import 'package:flutter/material.dart';

import '../core/app_theme.dart';

class SamplingUnitGrid extends StatelessWidget {
  const SamplingUnitGrid({
    required this.quantity,
    required this.positiveUnits,
    required this.onUnitTap,
    super.key,
  });

  final int quantity;
  final Set<int> positiveUnits;
  final ValueChanged<int> onUnitTap;

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, constraints) {
      final columns = constraints.maxWidth >= 600 ? 10 : 5;
      return GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: quantity,
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: columns,
          mainAxisSpacing: 8,
          crossAxisSpacing: 8,
          childAspectRatio: 1,
        ),
        itemBuilder: (context, index) {
          final number = index + 1;
          final positive = positiveUnits.contains(number);
          return Semantics(
            button: true,
            selected: positive,
            label: 'Unidad $number, ${positive ? 'positiva' : 'negativa'}',
            child: InkWell(
              key: ValueKey('sampling-unit-$number'),
              onTap: () => onUnitTap(number),
              borderRadius: BorderRadius.circular(8),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 140),
                decoration: BoxDecoration(
                  color: positive ? const Color(0xFFFFE7E2) : Colors.white,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: positive ? AppColors.danger : AppColors.line,
                    width: positive ? 2 : 1,
                  ),
                  boxShadow: positive
                      ? const [
                          BoxShadow(color: Color(0x20D84A3A), blurRadius: 7),
                        ]
                      : null,
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      positive ? Icons.close_rounded : Icons.circle_outlined,
                      color: positive
                          ? AppColors.danger
                          : const Color(0xFF789087),
                      size: 24,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '$number',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        color: positive ? AppColors.danger : AppColors.navy,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      );
    },
  );
}
