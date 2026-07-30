import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/providers/persona_provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/glass_container.dart';
import '../../l10n/app_strings.dart';
import '../libro/book_gallery_screen.dart';
import '../vocab/vocab_screen.dart';

/// The "Biblioteca" tab — Mi Libro + Mi Vocabulario only.
class LibraryTab extends ConsumerWidget {
  const LibraryTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final persona = ref.watch(personaProvider);
    final isSenior = persona?.isSeniorMode ?? false;

    return Container(
      decoration: BoxDecoration(
        gradient: AppGlassStyles.backgroundGradient,
      ),
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Section label — monospaced
              Text(
                '01  BIBLIOTECA',
                style: AppTextStyles.sectionLabel(),
              ),
              const SizedBox(height: 8),
              Text(
                AppStrings.libraryTitleEs,
                style: AppTextStyles.headline(isSenior: isSenior),
              ),
              const SizedBox(height: 24),
              _NavButton(
                icon: Icons.menu_book,
                label: AppStrings.librarySectionBookEs,
                isSenior: isSenior,
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => const BookGalleryScreen(),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              _NavButton(
                icon: Icons.translate,
                label: AppStrings.librarySectionVocabEs,
                isSenior: isSenior,
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => const VocabScreen(),
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Nav button ────────────────────────────────────────────────────────────────

class _NavButton extends StatelessWidget {
  const _NavButton({
    required this.icon,
    required this.label,
    required this.isSenior,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final bool isSenior;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final textSize =
        isSenior ? AppFontSizes.subtitleLarge : AppFontSizes.subtitle;
    final iconSize = isSenior ? 30.0 : 24.0;

    return GestureDetector(
      onTap: onTap,
      child: GlassContainer(
        padding: EdgeInsets.symmetric(
          horizontal: 20,
          vertical: isSenior ? 20 : 16,
        ),
        child: Row(
          children: [
            Icon(icon, color: AppColors.emerald, size: iconSize),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                label,
                style: TextStyle(
                  fontSize: textSize,
                  fontWeight: FontWeight.w600,
                  color: AppColors.text,
                ),
              ),
            ),
            Icon(
              Icons.chevron_right,
              color: AppColors.textDim,
              size: 24,
            ),
          ],
        ),
      ),
    );
  }
}
