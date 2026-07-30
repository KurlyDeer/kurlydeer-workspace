import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

/// Shared button primitive with three visual variants:
///
/// - **primary** — Filled emerald accent, white text
/// - **secondary** — 1px border outline, transparent fill
/// - **danger** — Red variant for destructive actions
///
/// All buttons maintain a minimum 48px touch target (accessibility)
/// and use 8px border-radius aligned with the kurlydeer.com design language.
enum ClaveButtonVariant { primary, secondary, danger }

class ClaveButton extends StatelessWidget {
  const ClaveButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.variant = ClaveButtonVariant.primary,
    this.isLoading = false,
    this.icon,
    this.height = 56.0,
    this.fontSize,
    this.fullWidth = true,
  });

  final String label;
  final VoidCallback? onPressed;
  final ClaveButtonVariant variant;
  final bool isLoading;
  final IconData? icon;
  final double height;
  final double? fontSize;
  final bool fullWidth;

  Color get _backgroundColor {
    switch (variant) {
      case ClaveButtonVariant.primary:
        return AppColors.emerald;
      case ClaveButtonVariant.secondary:
        return Colors.transparent;
      case ClaveButtonVariant.danger:
        return AppColors.error;
    }
  }

  Color get _foregroundColor {
    switch (variant) {
      case ClaveButtonVariant.primary:
        return AppColors.white;
      case ClaveButtonVariant.secondary:
        return AppColors.text;
      case ClaveButtonVariant.danger:
        return AppColors.white;
    }
  }

  Color? get _borderColor {
    switch (variant) {
      case ClaveButtonVariant.primary:
        return null;
      case ClaveButtonVariant.secondary:
        return AppColors.cardBorder;
      case ClaveButtonVariant.danger:
        return null;
    }
  }

  List<BoxShadow>? get _boxShadow {
    switch (variant) {
      case ClaveButtonVariant.primary:
        return [
          BoxShadow(
            color: AppColors.emerald.withValues(alpha: 0.25),
            blurRadius: 16,
            spreadRadius: 1,
          ),
        ];
      case ClaveButtonVariant.secondary:
        return null;
      case ClaveButtonVariant.danger:
        return [
          BoxShadow(
            color: AppColors.error.withValues(alpha: 0.25),
            blurRadius: 16,
            spreadRadius: 1,
          ),
        ];
    }
  }

  @override
  Widget build(BuildContext context) {
    final effectiveFontSize = fontSize ?? AppFontSizes.subtitle;

    final buttonChild = isLoading
        ? SizedBox(
            width: 22,
            height: 22,
            child: CircularProgressIndicator(
              color: _foregroundColor,
              strokeWidth: 2.5,
            ),
          )
        : Row(
            mainAxisSize: fullWidth ? MainAxisSize.max : MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (icon != null) ...[
                Icon(icon, color: _foregroundColor, size: effectiveFontSize + 2),
                const SizedBox(width: 8),
              ],
              Text(
                label,
                style: AppTextStyles.buttonLabel(fontSize: effectiveFontSize)
                    .copyWith(color: _foregroundColor),
              ),
            ],
          );

    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: AppRadius.mdBr,
        boxShadow: onPressed != null ? _boxShadow : null,
      ),
      child: SizedBox(
        height: height,
        width: fullWidth ? double.infinity : null,
        child: ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: _backgroundColor,
            foregroundColor: _foregroundColor,
            disabledBackgroundColor: _backgroundColor.withValues(alpha: 0.5),
            shape: RoundedRectangleBorder(
              borderRadius: AppRadius.mdBr,
              side: _borderColor != null
                  ? BorderSide(color: _borderColor!)
                  : BorderSide.none,
            ),
            elevation: 0,
            padding: const EdgeInsets.symmetric(horizontal: 24),
          ),
          child: buttonChild,
        ),
      ),
    );
  }
}
