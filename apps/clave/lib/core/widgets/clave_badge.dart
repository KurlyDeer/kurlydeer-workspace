import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/app_theme.dart';

/// A monospaced badge/chip component for status, difficulty, and metadata tags.
///
/// Aligned with kurlydeer.com aesthetic: monospace font, 1px border,
/// subtle tinted background, compact sizing.
///
/// ```dart
/// ClaveBadge(label: 'A1', color: AppColors.difficultyA1)
/// ClaveBadge(label: 'PRO', color: AppColors.gold)
/// ClaveBadge(label: 'COMPLETED', color: AppColors.success)
/// ```
class ClaveBadge extends StatelessWidget {
  const ClaveBadge({
    super.key,
    required this.label,
    required this.color,
    this.fontSize = 11.0,
  });

  final String label;
  final Color color;
  final double fontSize;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: AppRadius.smBr,
        border: Border.all(
          color: color.withValues(alpha: 0.4),
          width: 1.0,
        ),
      ),
      child: Text(
        label.toUpperCase(),
        style: GoogleFonts.jetBrainsMono(
          fontSize: fontSize,
          fontWeight: FontWeight.w700,
          color: color,
          letterSpacing: 0.8,
        ),
      ),
    );
  }
}
