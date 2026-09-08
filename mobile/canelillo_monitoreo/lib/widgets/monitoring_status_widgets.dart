import 'package:flutter/material.dart';

import '../core/app_theme.dart';

class MonitoringProgress extends StatelessWidget {
  const MonitoringProgress({
    required this.completed,
    required this.total,
    super.key,
  });

  final int completed;
  final int total;

  @override
  Widget build(BuildContext context) {
    final progress = total <= 0
        ? 0.0
        : (completed / total).clamp(0, 1).toDouble();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                '$completed de $total estructuras completas',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF60736C),
                ),
              ),
            ),
            Text(
              '${(progress * 100).round()}%',
              style: const TextStyle(
                fontWeight: FontWeight.w900,
                color: AppColors.forest,
              ),
            ),
          ],
        ),
        const SizedBox(height: 5),
        LinearProgressIndicator(
          value: progress,
          minHeight: 7,
          borderRadius: BorderRadius.circular(4),
          backgroundColor: AppColors.line,
        ),
      ],
    );
  }
}

class SyncStatusBadge extends StatelessWidget {
  const SyncStatusBadge({required this.status, super.key});

  final String status;

  @override
  Widget build(BuildContext context) {
    final normalized = status.toLowerCase();
    final isError = normalized.contains('error');
    final isSynced = normalized.contains('sincronizado');
    final color = isError
        ? AppColors.danger
        : isSynced
        ? AppColors.forest
        : const Color(0xFFC47A00);
    final icon = isError
        ? Icons.error_outline
        : isSynced
        ? Icons.cloud_done_outlined
        : Icons.cloud_upload_outlined;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
      decoration: BoxDecoration(
        color: color.withValues(alpha: .1),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: color.withValues(alpha: .35)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 15, color: color),
          const SizedBox(width: 5),
          Text(
            status,
            style: TextStyle(
              color: color,
              fontSize: 11,
              fontWeight: FontWeight.w900,
            ),
          ),
        ],
      ),
    );
  }
}
