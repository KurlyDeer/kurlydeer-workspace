import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/stt_low_confidence_tooltip.dart';
import '../../../l10n/app_strings.dart';
import '../../../features/sos/widgets/mic_tap_button.dart';

class VoiceChallengeView extends StatelessWidget {
  const VoiceChallengeView({
    super.key,
    required this.targetSentence,
    required this.transcription,
    required this.isRecording,
    required this.isOfflineError,
    required this.errorMessage,
    required this.isSenior,
    required this.onToggleRecording,
    required this.onSkip,
    this.sttLowConfidence = false,
  });

  final String targetSentence;
  final String transcription;
  final bool isRecording;
  final bool isOfflineError;
  final String errorMessage;
  final bool isSenior;
  final VoidCallback onToggleRecording;
  final VoidCallback onSkip;
  final bool sttLowConfidence;

  @override
  Widget build(BuildContext context) {
    final titleSize = isSenior ? AppFontSizes.titleLarge : AppFontSizes.title;
    final bodySize = isSenior ? AppFontSizes.bodyLarge : AppFontSizes.body;
    final skipHeight = isSenior ? 60.0 : 52.0;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const SizedBox(height: 8),
          Text(
            AppStrings.retoTitleEs,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: titleSize,
              fontWeight: FontWeight.w800,
              color: AppColors.text,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            AppStrings.retoInstructionEs,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: bodySize,
              color: AppColors.textSub,
            ),
          ),
          const SizedBox(height: 12),
          // Target sentence card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.surface1,
              borderRadius: AppRadius.smBr,
              border: Border.all(color: AppColors.borderDark, width: 1.0),
            ),
            child: Text(
              '"$targetSentence"',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: bodySize + 2,
                fontWeight: FontWeight.w700,
                color: AppColors.emerald,
                fontStyle: FontStyle.italic,
                height: 1.4,
              ),
            ),
          ),
          const SizedBox(height: 32),
          // Mic
          Center(
            child: MicTapButton(
              isRecording: isRecording,
              isSenior: isSenior,
              onPressed: onToggleRecording,
            ),
          ),
          const SizedBox(height: 16),
          if (isRecording) ...[
            Text(
              AppStrings.retoListeningEs,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: bodySize - 2,
                color: AppColors.emerald,
                fontWeight: FontWeight.w600,
              ),
            ),
            if (transcription.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                transcription,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: bodySize - 2,
                  color: AppColors.text,
                  fontStyle: FontStyle.italic,
                ),
              ),
            ],
          ] else if (sttLowConfidence) ...[
            const SizedBox(height: 8),
            SttLowConfidenceTooltip(fontSize: bodySize - 2),
          ] else ...[
            Text(
              'Toca el micrófono y habla en inglés',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: bodySize - 2,
                color: AppColors.textDim,
              ),
            ),
          ],
          // Error messages
          if (isOfflineError) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.errorSubtle,
                borderRadius: AppRadius.smBr,
                border: Border.all(color: AppColors.error.withValues(alpha: 0.3)),
              ),
              child: Text(
                AppStrings.lessonOfflineEs,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: bodySize - 2,
                  color: AppColors.error,
                  height: 1.5,
                ),
              ),
            ),
          ] else if (errorMessage.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.gold.withValues(alpha: 0.08),
                borderRadius: AppRadius.smBr,
                border: Border.all(color: AppColors.gold.withValues(alpha: 0.3)),
              ),
              child: Text(
                errorMessage,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: bodySize - 2,
                  color: AppColors.gold,
                  height: 1.5,
                ),
              ),
            ),
          ],
          const SizedBox(height: 24),
          // Skip button
          SizedBox(
            height: skipHeight,
            child: OutlinedButton(
              onPressed: onSkip,
              style: OutlinedButton.styleFrom(
                side: BorderSide(
                  color: AppColors.borderDark,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: AppRadius.smBr,
                ),
              ),
              child: Text(
                AppStrings.retoSkipEs,
                style: TextStyle(
                  fontSize: bodySize - 2,
                  color: AppColors.textSub,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
