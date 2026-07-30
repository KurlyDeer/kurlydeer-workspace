import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/providers/settings_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/clave_button.dart';
import '../../../l10n/app_strings.dart';

void showPremiumModal(BuildContext context, WidgetRef ref) {
  showModalBottomSheet<void>(
    context: context,
    backgroundColor: Colors.transparent,
    isScrollControlled: true,
    builder: (ctx) => _PremiumModalContent(widgetRef: ref, ctx: ctx),
  );
}

class _PremiumModalContent extends StatelessWidget {
  const _PremiumModalContent({
    required this.widgetRef,
    required this.ctx,
  });

  final WidgetRef widgetRef;
  final BuildContext ctx;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface1,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
        border: Border(
          top: BorderSide(
            color: AppColors.gold.withValues(alpha: 0.3),
            width: 1.5,
          ),
          left: BorderSide(
            color: AppColors.gold.withValues(alpha: 0.3),
            width: 1.0,
          ),
          right: BorderSide(
            color: AppColors.gold.withValues(alpha: 0.3),
            width: 1.0,
          ),
        ),
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 12, 24, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Drag handle
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.textDim,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Gold star icon
              Icon(
                Icons.workspace_premium,
                size: 48,
                color: AppColors.gold,
              ),
              const SizedBox(height: 16),

              // Title
              Text(
                AppStrings.premiumTitleEs,
                textAlign: TextAlign.center,
                style: GoogleFonts.spaceGrotesk(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: AppColors.text,
                ),
              ),
              const SizedBox(height: 8),

              // Subtitle
              Text(
                AppStrings.premiumSubtitleEs,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: AppFontSizes.body,
                  color: AppColors.textSub,
                ),
              ),
              const SizedBox(height: 20),

              // Bullets
              _BulletRow(text: AppStrings.premiumBullet1Es),
              const SizedBox(height: 10),
              _BulletRow(text: AppStrings.premiumBullet2Es),
              const SizedBox(height: 10),
              _BulletRow(text: AppStrings.premiumBullet3Es),
              const SizedBox(height: 28),

              // Upgrade button — uses gold variant
              SizedBox(
                width: double.infinity,
                height: 56,
                child: GestureDetector(
                  onTap: () {
                    widgetRef
                        .read(settingsProvider.notifier)
                        .setPremium(true);
                    Navigator.of(ctx).pop();
                  },
                  child: Container(
                    decoration: BoxDecoration(
                      color: AppColors.gold,
                      borderRadius: AppRadius.mdBr,
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.gold.withValues(alpha: 0.3),
                          blurRadius: 16,
                          spreadRadius: 1,
                        ),
                      ],
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      AppStrings.premiumUpgradeEs,
                      style: AppTextStyles.buttonLabel().copyWith(
                        color: AppColors.white,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 14),

              // Restore link
              GestureDetector(
                onTap: () {},
                child: Text(
                  AppStrings.premiumRestoreEs,
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.textDim,
                    decoration: TextDecoration.underline,
                    decorationColor: AppColors.textDim,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _BulletRow extends StatelessWidget {
  const _BulletRow({required this.text});
  final String text;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(Icons.check_circle_rounded,
            color: AppColors.gold, size: 20),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            text,
            style: TextStyle(
              fontSize: AppFontSizes.body,
              color: AppColors.text,
            ),
          ),
        ),
      ],
    );
  }
}
