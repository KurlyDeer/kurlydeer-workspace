import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

/// Shared glassmorphic text field with 1px border and 8px radius.
///
/// Extracted from the login screen's private `_GlassTextField` to be
/// reusable across all forms in the app (login, settings, companero chat input).
class ClaveTextField extends StatelessWidget {
  const ClaveTextField({
    super.key,
    required this.controller,
    required this.hintText,
    this.obscureText = false,
    this.keyboardType,
    this.prefixIcon,
    this.suffixIcon,
    this.onSubmitted,
    this.minLines,
    this.maxLines = 1,
    this.textInputAction,
  });

  final TextEditingController controller;
  final String hintText;
  final bool obscureText;
  final TextInputType? keyboardType;
  final IconData? prefixIcon;
  final Widget? suffixIcon;
  final ValueChanged<String>? onSubmitted;
  final int? minLines;
  final int maxLines;
  final TextInputAction? textInputAction;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardSurface,
        borderRadius: AppRadius.mdBr,
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: TextField(
        controller: controller,
        obscureText: obscureText,
        keyboardType: keyboardType,
        onSubmitted: onSubmitted,
        minLines: minLines,
        maxLines: maxLines,
        textInputAction: textInputAction,
        style: TextStyle(
          color: AppColors.text,
          fontSize: AppFontSizes.body,
        ),
        cursorColor: AppColors.emerald,
        decoration: InputDecoration(
          hintText: hintText,
          hintStyle: TextStyle(
            color: AppColors.textDim,
            fontSize: AppFontSizes.body - 2,
          ),
          prefixIcon: prefixIcon != null
              ? Icon(prefixIcon, color: AppColors.textDim, size: 22)
              : null,
          suffixIcon: suffixIcon,
          border: InputBorder.none,
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        ),
      ),
    );
  }
}
