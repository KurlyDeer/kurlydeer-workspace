import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/data/lesson_repository.dart';
import '../../../core/providers/path_lesson_provider.dart';
import '../../../core/providers/persona_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/clave_badge.dart';
import '../../lessons/lesson_detail_screen.dart';

class PathLessonCard extends ConsumerWidget {
  const PathLessonCard({
    super.key,
    required this.lesson,
    required this.isNextAvailable,
    this.isLocked = false,
    this.onLockedTap,
  });

  final PathLesson lesson;

  /// True when this is the next lesson the user should tackle —
  /// renders a glowing emerald border to draw attention.
  final bool isNextAvailable;

  /// True when this lesson is not yet unlocked — dims the card and disables tap.
  final bool isLocked;

  /// If provided and [isLocked] is true, tapping the card calls this instead
  /// of navigating (e.g. to show the premium modal).
  final VoidCallback? onLockedTap;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final persona = ref.watch(personaProvider);
    final isSenior = persona?.isSeniorMode ?? false;
    final progress = ref.watch(pathLessonProgressProvider(lesson.id));
    final isCompleted = progress?.completed ?? false;
    final diffColor = AppGlassStyles.difficultyColor(lesson.difficulty);

    final titleSize =
        isSenior ? AppFontSizes.subtitleLarge : AppFontSizes.subtitle;
    final subtitleSize = isSenior ? 20.0 : 15.0;

    BoxDecoration cardDecoration;
    if (isCompleted) {
      cardDecoration = AppGlassStyles.glowBorder(AppColors.success);
    } else if (isNextAvailable) {
      cardDecoration = AppGlassStyles.glowBorder(AppColors.emerald);
    } else {
      cardDecoration = AppGlassStyles.cardDecoration;
    }

    final cardContent = Container(
      decoration: cardDecoration,
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          // Emoji
          Text(lesson.iconEmoji,
              style: TextStyle(fontSize: isSenior ? 34 : 28)),
          const SizedBox(width: 14),

          // Title + subtitle + badge
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ClaveBadge(label: lesson.difficulty, color: diffColor),
                const SizedBox(height: 6),
                Text(
                  lesson.titleEs,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: titleSize,
                    fontWeight: FontWeight.w700,
                    color: AppColors.text,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  lesson.titleEn,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: subtitleSize,
                    color: AppColors.textSub,
                  ),
                ),
                if (isCompleted) ...[
                  const SizedBox(height: 4),
                  Text(
                    '✓ Completada',
                    style: AppTextStyles.monoMeta(
                      color: AppColors.success,
                      fontSize: 12,
                    ),
                  ),
                ],
              ],
            ),
          ),

          const SizedBox(width: 12),

          // Completion indicator
          if (isCompleted)
            Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                color: AppColors.success.withValues(alpha: 0.12),
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.success, width: 1.5),
              ),
              child: Icon(Icons.check, color: AppColors.success, size: 16),
            )
          else if (isLocked)
            Icon(Icons.lock_rounded, color: AppColors.textDim, size: 20)
          else
            Icon(Icons.chevron_right, color: AppColors.textDim, size: 22),
        ],
      ),
    );

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 0),
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Timeline track
            SizedBox(
              width: 28,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Container(
                    width: 2,
                    color: isCompleted
                        ? AppColors.success.withValues(alpha: 0.3)
                        : AppColors.cardBorder,
                  ),
                  Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isCompleted
                          ? AppColors.success
                          : (isNextAvailable
                              ? AppColors.emerald
                              : AppColors.cardSurface),
                      border: Border.all(
                        color: isCompleted || isNextAvailable
                            ? Colors.transparent
                            : AppColors.cardBorder,
                        width: 1.5,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 6),
                child: isLocked
                    ? (onLockedTap != null
                        ? GestureDetector(
                            onTap: onLockedTap,
                            child: Opacity(opacity: 0.4, child: cardContent),
                          )
                        : Opacity(opacity: 0.4, child: cardContent))
                    : GestureDetector(
                        onTap: () => Navigator.of(context).push(
                          MaterialPageRoute<void>(
                            builder: (_) => LessonDetailScreen(lesson: lesson),
                          ),
                        ),
                        child: cardContent,
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
