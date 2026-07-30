import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/app_theme.dart';

/// A monospaced stat card for displaying metrics like XP, time, accuracy.
///
/// Used on summary/results screens and the dashboard stats row.
/// Features a 1px border, 8px radius, and monospaced value display
/// aligned with the kurlydeer.com design language.
///
/// ```dart
/// ClaveStatCard(
///   icon: '⭐',
///   label: 'XP Earned',
///   value: '+120 XP',
///   highlight: true,
/// )
/// ```
class ClaveStatCard extends StatelessWidget {
  const ClaveStatCard({
    super.key,
    required this.icon,
    required this.label,
    required this.value,
    this.isSenior = false,
    this.highlight = false,
    this.highlightColor,
    this.compact = false,
  });

  final String icon;
  final String label;
  final String value;
  final bool isSenior;
  final bool highlight;
  final Color? highlightColor;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final accentColor = highlightColor ?? AppColors.emerald;
    final bodySize = isSenior ? AppFontSizes.bodyLarge : AppFontSizes.body;

    if (compact) {
      return _buildCompact(accentColor, bodySize);
    }
    return _buildFull(accentColor, bodySize);
  }

  /// Full-width horizontal layout (for results/summary screens).
  Widget _buildFull(Color accentColor, double bodySize) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: highlight
            ? accentColor.withValues(alpha: 0.08)
            : AppColors.cardSurface,
        borderRadius: AppRadius.mdBr,
        border: Border.all(
          color: highlight
              ? accentColor.withValues(alpha: 0.4)
              : AppColors.cardBorder,
          width: highlight ? 1.5 : 1.0,
        ),
      ),
      child: Row(
        children: [
          Text(icon, style: TextStyle(fontSize: isSenior ? 28 : 24)),
          const SizedBox(width: 14),
          Expanded(
            child: Text(
              label,
              style: TextStyle(
                fontSize: bodySize - 2,
                color: AppColors.textSub,
              ),
            ),
          ),
          Text(
            value,
            style: GoogleFonts.jetBrainsMono(
              fontSize: bodySize,
              fontWeight: FontWeight.w700,
              color: highlight ? accentColor : AppColors.text,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }

  /// Compact vertical layout (for dashboard stat tiles).
  Widget _buildCompact(Color accentColor, double bodySize) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
        color: AppColors.cardSurface,
        borderRadius: AppRadius.mdBr,
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        children: [
          Text(icon, style: TextStyle(fontSize: isSenior ? 26 : 22)),
          const SizedBox(height: 6),
          Text(
            value,
            style: GoogleFonts.jetBrainsMono(
              fontSize: isSenior ? AppFontSizes.titleLarge : AppFontSizes.title,
              fontWeight: FontWeight.w800,
              color: AppColors.text,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label.toUpperCase(),
            style: GoogleFonts.jetBrainsMono(
              fontSize: 10,
              fontWeight: FontWeight.w600,
              color: AppColors.textDim,
              letterSpacing: 1.2,
            ),
          ),
        ],
      ),
    );
  }
}
