import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/providers/onboarding_controller.dart';
import '../../../core/providers/path_lesson_provider.dart';
import '../../../core/providers/shared_preferences_provider.dart';
import '../../../core/services/ai_content_service.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/glass_container.dart';
import '../../../l10n/app_strings.dart';
import '../../lessons/lesson_detail_screen.dart';

class AiDailyLessonCard extends ConsumerStatefulWidget {
  const AiDailyLessonCard({super.key});

  @override
  ConsumerState<AiDailyLessonCard> createState() => _AiDailyLessonCardState();
}

class _AiDailyLessonCardState extends ConsumerState<AiDailyLessonCard> {
  bool _isLoading = false;

  Future<void> _onTap() async {
    if (_isLoading) return;
    setState(() => _isLoading = true);

    try {
      // Determine goal string
      final track = ref.read(learningTrackProvider);
      String goal;
      if (track == LearningTrack.citizenship) {
        goal = 'citizenship';
      } else {
        final userGoal = ref.read(userGoalProvider);
        switch (userGoal) {
          case UserGoal.citizenship:
            goal = 'citizenship';
          case UserGoal.career:
            goal = 'career';
          case UserGoal.travel:
            goal = 'travel';
          case null:
            goal = 'general';
        }
      }

      // Map placement level to CEFR
      final prefs = ref.read(sharedPreferencesProvider);
      final levelName = prefs.getString('placement_level');
      String cefr;
      switch (levelName) {
        case 'advanced':
          cefr = 'B1';
        case 'intermediate':
          cefr = 'A2';
        default:
          cefr = 'A1';
      }

      final lesson = await ref
          .read(aiContentServiceProvider)
          .generateCustomLesson(userGoal: goal, userLevel: cefr);

      if (!mounted) return;
      await Navigator.of(context).push(
        MaterialPageRoute<void>(
          builder: (_) => LessonDetailScreen(lesson: lesson),
        ),
      );
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(AppStrings.aiDailyLessonErrorEs),
          backgroundColor: AppColors.error,
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _onTap,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: AppRadius.mdBr,
          border: Border.all(
            color: AppColors.gold.withValues(alpha: 0.4),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: AppColors.gold.withValues(alpha: 0.1),
              blurRadius: 12,
              spreadRadius: 1,
            ),
          ],
        ),
        child: GlassContainer(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          child: Row(
            children: [
              _isLoading
                  ? SizedBox(
                      width: 26,
                      height: 26,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.5,
                        color: AppColors.gold,
                      ),
                    )
                  : const Text('⭐', style: TextStyle(fontSize: 24)),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _isLoading
                          ? AppStrings.aiDailyLessonLoadingEs
                          : AppStrings.aiDailyLessonTitleEs,
                      style: AppTextStyles.cardTitle(),
                    ),
                    if (!_isLoading)
                      Text(
                        AppStrings.aiDailyLessonSubtitleEs,
                        style: AppTextStyles.monoMeta(
                          color: AppColors.textSub,
                          fontSize: 12,
                        ),
                      ),
                  ],
                ),
              ),
              if (!_isLoading)
                Icon(Icons.chevron_right, color: AppColors.gold, size: 22),
            ],
          ),
        ),
      ),
    );
  }
}
