import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/providers/onboarding_controller.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/glass_container.dart';
import '../../l10n/app_strings.dart';
import '../dashboard/main_shell_screen.dart';

/// First-Time User Experience — 3-page swipeable onboarding.
/// Collects name + primary learning goal, then boots to Dashboard.
class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final _pageController = PageController();
  final _nameController = TextEditingController();
  int _currentPage = 0;

  @override
  void dispose() {
    _pageController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  void _nextPage() {
    _pageController.nextPage(
      duration: const Duration(milliseconds: 350),
      curve: Curves.easeInOut,
    );
  }

  Future<void> _complete(BuildContext context) async {
    await ref.read(onboardingProvider.notifier).complete();
    if (!context.mounted) return;
    Navigator.of(context).pushAndRemoveUntil(
      PageRouteBuilder<void>(
        pageBuilder: (ctx, a1, a2) => const MainShellScreen(),
        transitionDuration: const Duration(milliseconds: 600),
        transitionsBuilder: (ctx, anim, a2, child) =>
            FadeTransition(opacity: anim, child: child),
      ),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final onboarding = ref.watch(onboardingProvider);

    return Scaffold(
      backgroundColor: AppColors.surface0,
      resizeToAvoidBottomInset: true,
      body: Container(
        color: AppColors.surface0,
        child: SafeArea(
          child: Column(
            children: [
              const SizedBox(height: 20),
              _DotIndicator(currentPage: _currentPage, pageCount: 5),
              const SizedBox(height: 16),
              Expanded(
                child: PageView(
                  controller: _pageController,
                  physics: const NeverScrollableScrollPhysics(),
                  onPageChanged: (i) => setState(() => _currentPage = i),
                  children: [
                    _WelcomePage(),
                    _NamePage(controller: _nameController),
                    const _LevelPage(),
                    const _GoalPage(),
                    const _TimePage(),
                  ],
                ),
              ),
              _BottomButton(
                currentPage: _currentPage,
                pageCount: 5,
                isEnabled: () {
                  if (_currentPage == 1) return _nameController.text.trim().isNotEmpty;
                  if (_currentPage == 2) return onboarding.userLevel != null;
                  if (_currentPage == 3) return onboarding.userGoal != null;
                  if (_currentPage == 4) return onboarding.userDailyTime != null;
                  return true;
                }(),
                onPressed: () {
                  if (_currentPage < 4) {
                    _nextPage();
                  } else {
                    _complete(context);
                  }
                },
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Dot Indicator ──────────────────────────────────────────────────────────────

class _DotIndicator extends StatelessWidget {
  const _DotIndicator({required this.currentPage, required this.pageCount});

  final int currentPage;
  final int pageCount;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.surface1,
        borderRadius: AppRadius.smBr,
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Text(
        '[ ${currentPage + 1} / $pageCount ]',
        style: TextStyle(
          fontFamily: 'JetBrains Mono',
          color: AppColors.text,
          fontWeight: FontWeight.w700,
          letterSpacing: 1.2,
        ),
      ),
    );
  }
}

// ── Bottom Button ─────────────────────────────────────────────────────────────

class _BottomButton extends StatelessWidget {
  const _BottomButton({
    required this.currentPage,
    required this.pageCount,
    required this.isEnabled,
    required this.onPressed,
  });

  final int currentPage;
  final int pageCount;
  final bool isEnabled;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    final label =
        currentPage == pageCount - 1 ? AppStrings.ftueStartEs : AppStrings.ftueNextEs;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Opacity(
        opacity: isEnabled ? 1.0 : 0.5,
        child: SizedBox(
          height: 60,
          width: double.infinity,
          child: ElevatedButton(
            onPressed: isEnabled ? onPressed : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.text,
              foregroundColor: AppColors.surface0,
              shape: RoundedRectangleBorder(
                borderRadius: AppRadius.smBr,
              ),
              elevation: 0,
            ),
            child: Text(
              label,
              style: const TextStyle(
                fontSize: AppFontSizes.subtitle,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// ── Page 1: Welcome ───────────────────────────────────────────────────────────

class _WelcomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        children: [
          const SizedBox(height: 24),
          const Text('🌉', style: TextStyle(fontSize: 72)),
          const SizedBox(height: 16),
          Text(
            AppStrings.appName,
            style: TextStyle(
              fontSize: AppFontSizes.headlineLarge,
              fontWeight: FontWeight.w900,
              color: AppColors.text,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 32),
          GlassContainer(
            padding: const EdgeInsets.all(24),
            backgroundColor: AppColors.surface1,
            borderColor: AppColors.borderLight,
            borderRadius: 8,
            child: Column(
              children: [
                Text(
                  AppStrings.ftueWelcomeTitleEs,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: AppFontSizes.title,
                    fontWeight: FontWeight.w700,
                    color: AppColors.text,
                    height: 1.3,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  AppStrings.ftueWelcomeSubtitleEs,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: AppFontSizes.body,
                    color: AppColors.textSub,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}

// ── Page 2: Name ──────────────────────────────────────────────────────────────

class _NamePage extends ConsumerWidget {
  const _NamePage({required this.controller});

  final TextEditingController controller;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 32),
          Text(
            AppStrings.ftueNameTitleEs,
            style: TextStyle(
              fontSize: AppFontSizes.headline,
              fontWeight: FontWeight.w800,
              color: AppColors.text,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 32),
          GlassContainer(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            backgroundColor: AppColors.surface1,
            borderColor: AppColors.borderLight,
            borderRadius: 8,
            child: TextField(
              controller: controller,
              style: TextStyle(
                color: AppColors.text,
                fontSize: AppFontSizes.body,
              ),
              decoration: InputDecoration(
                hintText: AppStrings.ftueNameHintEs,
                hintStyle: TextStyle(
                  color: AppColors.textSub,
                  fontSize: AppFontSizes.body,
                ),
                border: InputBorder.none,
              ),
              textCapitalization: TextCapitalization.words,
              onChanged: (value) =>
                  ref.read(onboardingProvider.notifier).setName(value),
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}

// ── Page 3: Goal Selection ────────────────────────────────────────────────────

class _GoalPage extends ConsumerWidget {
  const _GoalPage();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedGoal = ref.watch(onboardingProvider).userGoal;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 24),
          Text(
            AppStrings.ftueGoalTitleEs,
            style: TextStyle(
              fontSize: AppFontSizes.headline,
              fontWeight: FontWeight.w800,
              color: AppColors.text,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            AppStrings.ftueGoalSubtitleEs,
            style: TextStyle(
              fontSize: AppFontSizes.body,
              color: AppColors.textSub,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 28),
          _GoalCard(
            emoji: '💼',
            title: AppStrings.ftueGoalCareerEs,
            description: AppStrings.ftueGoalCareerDescEs,
            goal: UserGoal.career,
            isSelected: selectedGoal == UserGoal.career,
            onTap: () =>
                ref.read(onboardingProvider.notifier).setUserGoal(UserGoal.career),
          ),
          const SizedBox(height: 16),
          _GoalCard(
            emoji: '✈️',
            title: AppStrings.ftueGoalTravelEs,
            description: AppStrings.ftueGoalTravelDescEs,
            goal: UserGoal.travel,
            isSelected: selectedGoal == UserGoal.travel,
            onTap: () =>
                ref.read(onboardingProvider.notifier).setUserGoal(UserGoal.travel),
          ),
          const SizedBox(height: 16),
          _GoalCard(
            emoji: '🇺🇸',
            title: AppStrings.ftueGoalCitizenshipEs,
            description: AppStrings.ftueGoalCitizenshipDescEs,
            goal: UserGoal.citizenship,
            isSelected: selectedGoal == UserGoal.citizenship,
            onTap: () => ref
                .read(onboardingProvider.notifier)
                .setUserGoal(UserGoal.citizenship),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}

class _GoalCard extends StatelessWidget {
  const _GoalCard({
    required this.emoji,
    required this.title,
    required this.description,
    required this.goal,
    required this.isSelected,
    required this.onTap,
  });

  final String emoji;
  final String title;
  final String description;
  final UserGoal goal;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        child: GlassContainer(
          padding: const EdgeInsets.all(20),
          borderRadius: 8,
          backgroundColor: isSelected ? AppColors.surface2 : AppColors.surface1,
          borderColor:
              isSelected ? AppColors.text : AppColors.borderLight,
          child: Container(
            color: Colors.transparent,
            child: Row(
              children: [
                Text(emoji, style: const TextStyle(fontSize: 36)),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: TextStyle(
                          fontSize: AppFontSizes.title,
                          fontWeight: FontWeight.w700,
                          color: AppColors.text,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        description,
                        style: TextStyle(
                          fontSize: AppFontSizes.body - 2,
                          color: AppColors.textSub,
                          height: 1.4,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ── Page 4: Level Selection ───────────────────────────────────────────────────

class _LevelPage extends ConsumerWidget {
  const _LevelPage();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedLevel = ref.watch(onboardingProvider).userLevel;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 24),
          Text(
            '¿Cuál es tu nivel de inglés?',
            style: TextStyle(
              fontSize: AppFontSizes.headline,
              fontWeight: FontWeight.w800,
              color: AppColors.text,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Esto nos ayudará a personalizar tu contenido.',
            style: TextStyle(
              fontSize: AppFontSizes.body,
              color: AppColors.textSub,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 28),
          _GoalCard(
            emoji: '🌱',
            title: 'Principiante',
            description: 'Apenas estoy empezando a aprender.',
            goal: UserGoal.career, // Ignore this for UI
            isSelected: selectedLevel == UserLevel.beginner,
            onTap: () => ref.read(onboardingProvider.notifier).setUserLevel(UserLevel.beginner),
          ),
          const SizedBox(height: 16),
          _GoalCard(
            emoji: '🌿',
            title: 'Intermedio',
            description: 'Puedo tener conversaciones básicas.',
            goal: UserGoal.career,
            isSelected: selectedLevel == UserLevel.intermediate,
            onTap: () => ref.read(onboardingProvider.notifier).setUserLevel(UserLevel.intermediate),
          ),
          const SizedBox(height: 16),
          _GoalCard(
            emoji: '🌳',
            title: 'Avanzado',
            description: 'Hablo con fluidez pero quiero mejorar.',
            goal: UserGoal.career,
            isSelected: selectedLevel == UserLevel.advanced,
            onTap: () => ref.read(onboardingProvider.notifier).setUserLevel(UserLevel.advanced),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}

// ── Page 5: Daily Time Goal ───────────────────────────────────────────────────

class _TimePage extends ConsumerWidget {
  const _TimePage();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedTime = ref.watch(onboardingProvider).userDailyTime;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 24),
          Text(
            '¿Cuánto tiempo puedes dedicar al día?',
            style: TextStyle(
              fontSize: AppFontSizes.headline,
              fontWeight: FontWeight.w800,
              color: AppColors.text,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'La consistencia es clave para aprender un idioma.',
            style: TextStyle(
              fontSize: AppFontSizes.body,
              color: AppColors.textSub,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 28),
          _GoalCard(
            emoji: '⏱️',
            title: '5 Minutos',
            description: 'Casual. Perfecto para días ocupados.',
            goal: UserGoal.career,
            isSelected: selectedTime == UserDailyTime.min5,
            onTap: () => ref.read(onboardingProvider.notifier).setUserDailyTime(UserDailyTime.min5),
          ),
          const SizedBox(height: 16),
          _GoalCard(
            emoji: '🏃',
            title: '15 Minutos',
            description: 'Regular. Buen equilibrio diario.',
            goal: UserGoal.career,
            isSelected: selectedTime == UserDailyTime.min15,
            onTap: () => ref.read(onboardingProvider.notifier).setUserDailyTime(UserDailyTime.min15),
          ),
          const SizedBox(height: 16),
          _GoalCard(
            emoji: '🔥',
            title: '30 Minutos',
            description: 'Intenso. Aprendizaje acelerado.',
            goal: UserGoal.career,
            isSelected: selectedTime == UserDailyTime.min30,
            onTap: () => ref.read(onboardingProvider.notifier).setUserDailyTime(UserDailyTime.min30),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
