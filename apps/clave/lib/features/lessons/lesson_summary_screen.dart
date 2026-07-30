import 'package:confetti/confetti.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/providers/persona_provider.dart';
import '../../core/providers/user_name_provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/clave_button.dart';
import '../../core/widgets/clave_stat_card.dart';
import '../../l10n/app_strings.dart';

class LessonSummaryScreen extends ConsumerStatefulWidget {
  const LessonSummaryScreen({
    super.key,
    required this.lessonId,
    required this.lessonTitle,
    required this.xpGained,
    required this.elapsedSeconds,
    required this.wordCount,
    required this.voiceScore,
    required this.stageAdvanced,
    required this.milestoneEs,
  });

  final String lessonId;
  final String lessonTitle;
  final int xpGained;
  final int elapsedSeconds;
  final int wordCount;
  final int voiceScore;
  final bool stageAdvanced;
  final String milestoneEs;

  @override
  ConsumerState<LessonSummaryScreen> createState() =>
      _LessonSummaryScreenState();
}

class _LessonSummaryScreenState extends ConsumerState<LessonSummaryScreen> {
  late final ConfettiController _confettiController;

  @override
  void initState() {
    super.initState();
    _confettiController =
        ConfettiController(duration: const Duration(seconds: 3));

    WidgetsBinding.instance.addPostFrameCallback((_) {
      final persona = ref.read(personaProvider);
      if (persona == Persona.nino || widget.stageAdvanced) {
        _confettiController.play();
      }
    });
  }

  @override
  void dispose() {
    _confettiController.dispose();
    super.dispose();
  }

  String _formatTime(int seconds) {
    if (seconds < 60) return '${seconds}s';
    final m = seconds ~/ 60;
    final s = seconds % 60;
    return '${m}m ${s}s';
  }

  @override
  Widget build(BuildContext context) {
    final persona = ref.watch(personaProvider);
    final userName = ref.watch(userNameProvider);
    final isSenior = persona?.isSeniorMode ?? false;

    if (widget.stageAdvanced) {
      return _MilestoneFullPage(
        confettiController: _confettiController,
        userName: userName.isNotEmpty
            ? userName
            : (persona?.displayName ?? 'Campeón'),
        milestoneEs: widget.milestoneEs,
        persona: persona,
        isSenior: isSenior,
        onContinue: () =>
            Navigator.of(context).popUntil((route) => route.isFirst == false
                ? route.settings.name == '/lessons' || route.isFirst
                : true),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.surface0,
      body: Container(
        decoration: BoxDecoration(
          gradient: AppGlassStyles.backgroundGradient,
        ),
        child: Stack(
          children: [
            SafeArea(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Back / title row
                    Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        children: [
                          GestureDetector(
                            onTap: () => Navigator.of(context).pop(),
                            child: Icon(Icons.close, color: AppColors.textDim, size: 24),
                          ),
                          const Spacer(),
                          Text(
                            AppStrings.summaryTitle,
                            style: AppTextStyles.sectionLabel(),
                          ),
                          const Spacer(),
                          const SizedBox(width: 24), // balance the close icon
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),

                    // Persona celebration
                    _CelebrationHeader(persona: persona, isSenior: isSenior),
                    const SizedBox(height: 24),

                    // Lesson title
                    Text(
                      widget.lessonTitle,
                      textAlign: TextAlign.center,
                      style: AppTextStyles.headline(isSenior: isSenior),
                    ),
                    const SizedBox(height: 28),

                    // Stats — using shared ClaveStatCard
                    ClaveStatCard(
                      icon: '⏱',
                      label: AppStrings.summaryTimeLabel,
                      value: _formatTime(widget.elapsedSeconds),
                      isSenior: isSenior,
                    ),
                    const SizedBox(height: 10),
                    ClaveStatCard(
                      icon: '📚',
                      label: AppStrings.summaryWordsLabel,
                      value: '${widget.wordCount}',
                      isSenior: isSenior,
                    ),
                    const SizedBox(height: 10),
                    ClaveStatCard(
                      icon: '⭐',
                      label: AppStrings.summaryXpLabel,
                      value: '+${widget.xpGained} XP',
                      isSenior: isSenior,
                      highlight: true,
                      highlightColor: AppColors.emerald,
                    ),
                    const SizedBox(height: 10),
                    ClaveStatCard(
                      icon: '🎤',
                      label: AppStrings.summaryVoiceLabel,
                      value: '${widget.voiceScore}/100',
                      isSenior: isSenior,
                    ),
                    const SizedBox(height: 36),

                    // Continue button — using shared ClaveButton
                    ClaveButton(
                      label: AppStrings.summaryContinueEs,
                      height: isSenior ? 72 : 60,
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
            // Confetti for niño
            if (persona == Persona.nino)
              Align(
                alignment: Alignment.topCenter,
                child: ConfettiWidget(
                  confettiController: _confettiController,
                  blastDirectionality: BlastDirectionality.explosive,
                  numberOfParticles: 30,
                  maxBlastForce: 20,
                  minBlastForce: 5,
                  gravity: 0.3,
                  colors: const [
                    AppColors.emerald,
                    AppColors.gold,
                    AppColors.info,
                    AppColors.success,
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}

// ── Celebration header ─────────────────────────────────────────────────────────

class _CelebrationHeader extends StatelessWidget {
  const _CelebrationHeader({required this.persona, required this.isSenior});

  final Persona? persona;
  final bool isSenior;

  @override
  Widget build(BuildContext context) {
    if (persona == Persona.abuelo) {
      return Column(
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: AppColors.gold.withValues(alpha: 0.12),
              shape: BoxShape.circle,
              border: Border.all(
                color: AppColors.gold.withValues(alpha: 0.5),
                width: 2,
              ),
            ),
            child: const Center(
              child: Text('⭐', style: TextStyle(fontSize: 40)),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            '¡Excelente trabajo!',
            style: GoogleFonts.spaceGrotesk(
              fontSize: isSenior ? AppFontSizes.subtitleLarge : AppFontSizes.subtitle,
              fontWeight: FontWeight.w700,
              color: AppColors.gold,
            ),
          ),
        ],
      );
    }

    return Column(
      children: [
        Text(
          persona == Persona.nino ? '🎉🌟🎊' : '🎯✅',
          style: const TextStyle(fontSize: 48),
        ),
        const SizedBox(height: 8),
        Text(
          '¡Lección completada!',
          style: GoogleFonts.spaceGrotesk(
            fontSize: isSenior ? AppFontSizes.subtitleLarge : AppFontSizes.subtitle,
            fontWeight: FontWeight.w700,
            color: AppColors.emerald,
          ),
        ),
      ],
    );
  }
}

// ── Milestone Full Page ────────────────────────────────────────────────────────

class _MilestoneFullPage extends StatelessWidget {
  const _MilestoneFullPage({
    required this.confettiController,
    required this.userName,
    required this.milestoneEs,
    required this.persona,
    required this.isSenior,
    required this.onContinue,
  });

  final ConfettiController confettiController;
  final String userName;
  final String milestoneEs;
  final Persona? persona;
  final bool isSenior;
  final VoidCallback onContinue;

  @override
  Widget build(BuildContext context) {
    final bodySize = isSenior ? AppFontSizes.bodyLarge : AppFontSizes.body;

    return Scaffold(
      backgroundColor: AppColors.surface0,
      body: Container(
        decoration: BoxDecoration(
          gradient: AppGlassStyles.backgroundGradient,
        ),
        child: Stack(
          children: [
            SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Spacer(),
                    Text(
                      AppStrings.milestoneFullPageTitleEs,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: bodySize,
                        color: AppColors.textSub,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      userName,
                      textAlign: TextAlign.center,
                      style: GoogleFonts.spaceGrotesk(
                        fontSize: isSenior ? AppFontSizes.headlineLarge : AppFontSizes.headline,
                        fontWeight: FontWeight.w900,
                        color: AppColors.emerald,
                      ),
                    ),
                    const SizedBox(height: 24),
                    if (persona == Persona.abuelo)
                      const Center(
                        child: Text('🏅', style: TextStyle(fontSize: 72)),
                      )
                    else
                      const Center(
                        child: Text('📖✨', style: TextStyle(fontSize: 64)),
                      ),
                    const SizedBox(height: 24),
                    Text(
                      milestoneEs,
                      textAlign: TextAlign.center,
                      style: AppTextStyles.cardTitle(isSenior: isSenior),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      AppStrings.milestoneFullPageSubtitleEs,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: bodySize - 2,
                        color: AppColors.textSub,
                      ),
                    ),
                    const Spacer(),
                    ClaveButton(
                      label: AppStrings.summaryContinueEs,
                      height: isSenior ? 72 : 60,
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
            Align(
              alignment: Alignment.topCenter,
              child: ConfettiWidget(
                confettiController: confettiController,
                blastDirectionality: BlastDirectionality.explosive,
                numberOfParticles: 40,
                maxBlastForce: 25,
                minBlastForce: 8,
                gravity: 0.3,
                colors: const [
                  AppColors.emerald,
                  AppColors.gold,
                  AppColors.info,
                  AppColors.success,
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
