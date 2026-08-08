import 'package:flutter/material.dart';

import '../../../core/models/lesson_models.dart';
import '../../../core/theme/app_theme.dart';

class PhraseSlideCard extends StatelessWidget {
  const PhraseSlideCard({
    super.key,
    required this.slide,
    required this.isSenior,
  });

  final LessonSlide slide;
  final bool isSenior;

  @override
  Widget build(BuildContext context) {
    final titleSize = isSenior ? AppFontSizes.titleLarge : AppFontSizes.title;
    final bodySize = isSenior ? AppFontSizes.bodyLarge : AppFontSizes.body;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const SizedBox(height: 8),
          // Phrase chip
          Align(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.emerald.withValues(alpha: 0.1),
                borderRadius: AppRadius.pillBr,
              ),
              child: Text(
                '💬 Frase Útil',
                style: TextStyle(
                  fontSize: bodySize - 2,
                  color: AppColors.emerald,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          // Phrase card
          Container(
            padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 20),
            decoration: BoxDecoration(
              color: AppColors.surface1,
              borderRadius: AppRadius.smBr,
              border: Border.all(color: AppColors.borderDark, width: 1.0),
            ),
            child: Column(
              children: [
                Text(
                  slide.contentEn,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: titleSize,
                    fontWeight: FontWeight.w700,
                    color: AppColors.text,
                    height: 1.3,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  slide.contentEs,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: bodySize,
                    color: AppColors.textSub,
                  ),
                ),
              ],
            ),
          ),
          // Context note
          if (slide.exampleEn != null || slide.exampleEs != null) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface2.withValues(alpha: 0.5),
                borderRadius: AppRadius.smBr,
                border: Border.all(
                  color: AppColors.borderDark,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (slide.exampleEn != null)
                    Text(
                      slide.exampleEn!,
                      style: TextStyle(
                        fontSize: bodySize,
                        fontStyle: FontStyle.italic,
                        color: AppColors.text,
                        height: 1.4,
                      ),
                    ),
                  if (slide.exampleEs != null) ...[
                    const SizedBox(height: 6),
                    Text(
                      slide.exampleEs!,
                      style: TextStyle(
                        fontSize: bodySize - 2,
                        color: AppColors.textSub,
                        height: 1.4,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
