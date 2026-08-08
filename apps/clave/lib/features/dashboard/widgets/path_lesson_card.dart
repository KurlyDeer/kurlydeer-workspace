import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/data/lesson_repository.dart';
import '../../../core/providers/path_lesson_provider.dart';
import '../../../core/providers/persona_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/clave_badge.dart';
import '../../lessons/lesson_detail_screen.dart';

class PathLessonCard extends ConsumerStatefulWidget {
  const PathLessonCard({
    super.key,
    required this.lesson,
    required this.isNextAvailable,
    this.isLocked = false,
    this.onLockedTap,
  });

  final PathLesson lesson;
  final bool isNextAvailable;
  final bool isLocked;
  final VoidCallback? onLockedTap;

  @override
  ConsumerState<PathLessonCard> createState() => _PathLessonCardState();
}

class _PathLessonCardState extends ConsumerState<PathLessonCard> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    final persona = ref.watch(personaProvider);
    final isSenior = persona?.isSeniorMode ?? false;
    final progress = ref.watch(pathLessonProgressProvider(widget.lesson.id));
    final isCompleted = progress?.completed ?? false;
    final diffColor = AppGlassStyles.difficultyColor(widget.lesson.difficulty);

    final titleSize =
        isSenior ? AppFontSizes.subtitleLarge : AppFontSizes.subtitle;
    final subtitleSize = isSenior ? 20.0 : 15.0;

    BoxDecoration cardDecoration;
    if (isCompleted) {
      cardDecoration = AppGlassStyles.glowBorder(AppColors.success);
    } else if (widget.isNextAvailable) {
      cardDecoration = AppGlassStyles.glowBorder(AppColors.emerald);
    } else {
      cardDecoration = BoxDecoration(
        color: _isHovered ? AppColors.surface3 : AppColors.cardSurface,
        borderRadius: AppRadius.smBr,
        border: Border.all(color: AppColors.borderDark, width: 1.0),
      );
    }

    final cardContent = Container(
      decoration: cardDecoration,
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          // Emoji
          Text(widget.lesson.iconEmoji,
              style: TextStyle(fontSize: isSenior ? 34 : 28)),
          const SizedBox(width: 14),

          // Title + subtitle + badge
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ClaveBadge(label: widget.lesson.difficulty, color: diffColor),
                const SizedBox(height: 6),
                Text(
                  widget.lesson.titleEs,
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
                  widget.lesson.titleEn,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: subtitleSize,
                    color: AppColors.textSub,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Text(
                      '[ ${widget.lesson.targetVocabulary.length} Cards ]',
                      style: AppTextStyles.monoMeta(color: AppColors.textSub, fontSize: 11),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '[ XP: 150 ]',
                      style: AppTextStyles.monoMeta(color: AppColors.gold, fontSize: 11),
                    ),
                  ],
                ),
                if (isCompleted) ...[
                  const SizedBox(height: 8),
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
          else if (widget.isLocked)
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
                          : (widget.isNextAvailable
                              ? AppColors.emerald
                              : AppColors.cardSurface),
                      border: Border.all(
                        color: isCompleted || widget.isNextAvailable
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
                child: widget.isLocked
                    ? (widget.onLockedTap != null
                        ? GestureDetector(
                            onTap: widget.onLockedTap,
                            child: Opacity(opacity: 0.4, child: cardContent),
                          )
                        : Opacity(opacity: 0.4, child: cardContent))
                    : MouseRegion(
                        onEnter: (_) => setState(() => _isHovered = true),
                        onExit: (_) => setState(() => _isHovered = false),
                        cursor: SystemMouseCursors.click,
                        child: GestureDetector(
                          onTap: () => Navigator.of(context).push(
                            MaterialPageRoute<void>(
                              builder: (_) => LessonDetailScreen(lesson: widget.lesson),
                            ),
                          ),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            child: cardContent,
                          ),
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
