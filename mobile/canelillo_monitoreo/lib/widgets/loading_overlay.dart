import 'package:flutter/material.dart';

import '../core/app_theme.dart';

class LoadingOverlay extends StatelessWidget {
  const LoadingOverlay({
    required this.loading,
    required this.child,
    this.message = 'Procesando...',
    super.key,
  });

  final bool loading;
  final String message;
  final Widget child;

  @override
  Widget build(BuildContext context) => Stack(
    children: [
      child,
      if (loading) ...[
        const Positioned.fill(
          child: ModalBarrier(dismissible: false, color: Color(0x5C061E18)),
        ),
        Center(
          child: Container(
            constraints: const BoxConstraints(minWidth: 180),
            padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
              boxShadow: const [
                BoxShadow(color: Color(0x33000000), blurRadius: 20),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const SizedBox(
                  width: 34,
                  height: 34,
                  child: CircularProgressIndicator(
                    color: AppColors.forest,
                    strokeWidth: 3,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  message,
                  style: const TextStyle(
                    fontWeight: FontWeight.w800,
                    color: AppColors.navy,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    ],
  );
}
