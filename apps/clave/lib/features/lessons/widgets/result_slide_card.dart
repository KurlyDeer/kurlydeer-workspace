import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';
import '../../../l10n/app_strings.dart';

import '../../../core/utils/pronunciation_grader.dart';

class ResultSlideCard extends StatelessWidget {
  const ResultSlideCard({
    super.key,
    required this.score,
    required this.feedbackEs,
    required this.isSenior,
    required this.onTryAgain,
    this.wordResults = const [],
    this.listenSlower = false,
    this.onListenSlower,
  });

  final int score;
  final String feedbackEs;
  final bool isSenior;
  final VoidCallback onTryAgain;
  final List<WordMatch> wordResults;
  final bool listenSlower;
  final VoidCallback? onListenSlower;

  Color get _scoreColor {
    if (score >= 8) return AppColors.emerald;
    if (score >= 5) return AppColors.gold;
    return AppColors.error;
  }

  String get _scoreEmoji {
    if (score >= 8) return '🎉';
    if (score >= 5) return '👍';
    return '💪';
  }

  @override
  Widget build(BuildContext context) {
    final titleSize = isSenior ? AppFontSizes.titleLarge : AppFontSizes.title;
    final bodySize = isSenior ? AppFontSizes.bodyLarge : AppFontSizes.body;
    final retryHeight = isSenior ? 60.0 : 52.0;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const SizedBox(height: 8),
          Text(
            '$_scoreEmoji ${AppStrings.retoScoreLabelEs}',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: bodySize,
              fontWeight: FontWeight.w600,
              color: AppColors.darkText.withValues(alpha: 0.7),
            ),
          ),
          const SizedBox(height: 16),
          // Score display
          Center(
            child: Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _scoreColor.withValues(alpha: 0.12),
                border: Border.all(color: _scoreColor, width: 3),
              ),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      '$score',
                      style: TextStyle(
                        fontSize: titleSize + 6,
                        fontWeight: FontWeight.w900,
                        color: _scoreColor,
                      ),
                    ),
                    Text(
                      '/ 10',
                      style: TextStyle(
                        fontSize: bodySize - 4,
                        color: _scoreColor.withValues(alpha: 0.7),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),
          // Score bar
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: score / 10.0,
              minHeight: 14,
              backgroundColor: AppColors.surface2,
              valueColor: AlwaysStoppedAnimation<Color>(_scoreColor),
            ),
          ),
          // Word Highlights
          if (wordResults.isNotEmpty) ...[
            const SizedBox(height: 24),
            Wrap(
              alignment: WrapAlignment.center,
              spacing: 8,
              runSpacing: 8,
              children: wordResults.map((w) {
                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: w.correct ? AppColors.emerald.withValues(alpha: 0.1) : AppColors.error.withValues(alpha: 0.1),
                    borderRadius: AppRadius.smBr,
                    border: Border.all(
                      color: w.correct ? AppColors.emerald.withValues(alpha: 0.3) : AppColors.error.withValues(alpha: 0.3),
                    ),
                  ),
                  child: Text(
                    w.word,
                    style: TextStyle(
                      fontSize: bodySize,
                      fontWeight: FontWeight.w600,
                      color: w.correct ? AppColors.emerald : AppColors.error,
                      decoration: w.correct ? null : TextDecoration.underline,
                      decorationColor: AppColors.error,
                    ),
                  ),
                );
              }).toList(),
            ),
          ],
          // Feedback
          if (feedbackEs.isNotEmpty) ...[
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface1,
                borderRadius: AppRadius.smBr,
                border: Border.all(color: AppColors.borderLight),
              ),
              child: Text(
                feedbackEs,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: bodySize,
                  color: AppColors.text,
                  height: 1.5,
                ),
              ),
            ),
          ],
          const SizedBox(height: 24),
          // Adaptive Slower Mode Toggle
          if (listenSlower && score < 7) ...[
            SizedBox(
              height: retryHeight,
              child: ElevatedButton.icon(
                onPressed: onListenSlower,
                icon: const Icon(Icons.hearing),
                label: Text(
                  'Escuchar más lento',
                  style: TextStyle(
                    fontSize: bodySize - 2,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.surface2,
                  foregroundColor: AppColors.text,
                  shape: RoundedRectangleBorder(
                    borderRadius: AppRadius.smBr,
                  ),
                  elevation: 0,
                  side: BorderSide(color: AppColors.borderLight),
                ),
              ),
            ),
            const SizedBox(height: 12),
          ],
          const SizedBox(height: 24),
          // Try again option
          SizedBox(
            height: retryHeight,
            child: OutlinedButton(
              onPressed: onTryAgain,
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: AppColors.borderDark),
                shape: RoundedRectangleBorder(
                  borderRadius: AppRadius.smBr,
                ),
              ),
              child: Text(
                AppStrings.retoTryAgainEs,
                style: TextStyle(
                  fontSize: bodySize - 2,
                  color: AppColors.text,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
