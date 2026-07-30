import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/providers/next_step_provider.dart';
import '../../../core/providers/persona_provider.dart';
import '../../../core/providers/streak_provider.dart';
import '../../../core/providers/user_name_provider.dart';
import '../../../core/providers/xp_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/glass_container.dart';
import '../../profile/profile_screen.dart';

class WelcomeHeroWidget extends ConsumerWidget {
  const WelcomeHeroWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final persona = ref.watch(personaProvider);
    final isSenior = persona?.isSeniorMode ?? false;
    final name = ref.watch(userNameProvider);
    final nextStep = ref.watch(nextStepProvider);
    final xp = ref.watch(xpProvider);
    final streak = ref.watch(streakProvider);
    final currentStreak = streak?.currentStreak ?? 0;

    final headlineSize =
        isSenior ? AppFontSizes.headlineLarge : AppFontSizes.headline;
    final bodySize = isSenior ? AppFontSizes.bodyLarge : AppFontSizes.body;

    final greeting =
        name.trim().isNotEmpty ? '¡Hola, ${name.trim()}!' : '¡Hola!';

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Greeting + context subtitle
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  greeting,
                  style: GoogleFonts.spaceGrotesk(
                    fontSize: headlineSize,
                    fontWeight: FontWeight.w800,
                    color: AppColors.text,
                    height: 1.2,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  nextStep.contextMessageEs,
                  style: TextStyle(
                    fontSize: bodySize,
                    color: AppColors.textSub,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          // Stat pills + gear icon — top right
          Column(
            children: [
              // Gear icon → Profile
              GestureDetector(
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => const ProfileScreen(),
                  ),
                ),
                child: GlassContainer(
                  padding: const EdgeInsets.all(8),
                  child: Icon(
                    Icons.settings_outlined,
                    color: AppColors.text,
                    size: isSenior ? 24 : 20,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              _MonoStatPill(
                icon: Icons.local_fire_department,
                iconColor: const Color(0xFFEF6C00),
                value: '${currentStreak}d',
                isSenior: isSenior,
              ),
              const SizedBox(height: 8),
              _MonoStatPill(
                icon: Icons.bolt,
                iconColor: AppColors.emerald,
                value: '${xp.totalXp}',
                isSenior: isSenior,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ── Monospaced Stat Pill ──────────────────────────────────────────────────────
/// A compact, monospaced stat indicator (e.g., streak "5d", XP "120").
class _MonoStatPill extends StatelessWidget {
  const _MonoStatPill({
    required this.icon,
    required this.iconColor,
    required this.value,
    required this.isSenior,
  });

  final IconData icon;
  final Color iconColor;
  final String value;
  final bool isSenior;

  @override
  Widget build(BuildContext context) {
    final fontSize = isSenior ? 15.0 : 12.0;
    final iconSize = isSenior ? 18.0 : 14.0;

    return GlassContainer(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: iconColor, size: iconSize),
          const SizedBox(width: 4),
          Text(
            value,
            style: GoogleFonts.jetBrainsMono(
              fontSize: fontSize,
              fontWeight: FontWeight.w700,
              color: AppColors.text,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }
}
