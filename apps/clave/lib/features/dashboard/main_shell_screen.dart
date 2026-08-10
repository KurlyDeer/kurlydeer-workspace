import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/services/sync_service.dart';

import '../../core/providers/persona_provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/responsive_layout.dart';
import '../../core/providers/stats_provider.dart';
import '../../l10n/app_strings.dart';
import '../companero/companero_screen.dart';
import 'glass_home_tab.dart';
import 'library_tab.dart';

/// Root shell with 3-tab bottom nav: Home · Mi Compañero (center) · Biblioteca
class MainShellScreen extends ConsumerStatefulWidget {
  const MainShellScreen({super.key});

  @override
  ConsumerState<MainShellScreen> createState() => _MainShellScreenState();
}

class _MainShellScreenState extends ConsumerState<MainShellScreen> {
  int _currentIndex = 0;

  // Ordered: Home (0) · Mi Compañero center (1) · Biblioteca (2)
  static const List<Widget> _tabs = [
    GlassHomeTab(),
    CompaneroScreen(),
    LibraryTab(),
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(syncServiceProvider).syncProgress();
    });
  }

  @override
  Widget build(BuildContext context) {
    final persona = ref.watch(personaProvider);
    final isSenior = persona?.isSeniorMode ?? false;

    return LayoutBuilder(
      builder: (context, constraints) {
        final isDesktop = constraints.maxWidth >= ResponsiveBreakpoints.desktop;

        if (isDesktop) {
          return Scaffold(
            backgroundColor: AppColors.gradientStart,
            appBar: _buildTopBar(context, isDesktop),
            body: IndexedStack(
              index: _currentIndex,
              children: _tabs,
            ),
          );
        }

        return Scaffold(
          backgroundColor: AppColors.gradientStart,
          appBar: _buildTopBar(context, false),
          body: IndexedStack(
            index: _currentIndex,
            children: _tabs,
          ),
          bottomNavigationBar: _GlassNavBar(
            currentIndex: _currentIndex,
            onTap: (index) => setState(() => _currentIndex = index),
            isSenior: isSenior,
          ),
        );
      },
    );
  }

  PreferredSizeWidget _buildTopBar(BuildContext context, bool isDesktop) {
    final stats = ref.watch(statsProvider);
    
    return AppBar(
      backgroundColor: AppColors.surface0,
      elevation: 0,
      surfaceTintColor: Colors.transparent,
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(1.0),
        child: Container(
          color: AppColors.cardBorder,
          height: 1.0,
        ),
      ),
      title: Row(
        children: [
          Text(
            'Inicio / Dashboard',
            style: GoogleFonts.jetBrainsMono(
              fontSize: 14,
              color: AppColors.textSub,
              letterSpacing: 0.5,
            ),
          ),
          // Desktop Top Navigation Links
          if (isDesktop) ...[
            const Spacer(),
            _TopNavItem(
              label: AppStrings.navHomeEs,
              isSelected: _currentIndex == 0,
              onTap: () => setState(() => _currentIndex = 0),
            ),
            const SizedBox(width: 24),
            _TopNavItem(
              label: AppStrings.navCompaneroEs,
              isSelected: _currentIndex == 1,
              onTap: () => setState(() => _currentIndex = 1),
            ),
            const SizedBox(width: 24),
            _TopNavItem(
              label: AppStrings.navLibraryEs,
              isSelected: _currentIndex == 2,
              onTap: () => setState(() => _currentIndex = 2),
            ),
            const Spacer(),
          ] else
            const Spacer(),
          // User streak
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.surface2,
              borderRadius: AppRadius.smBr,
              border: Border.all(color: AppColors.cardBorder),
            ),
            child: Row(
              children: [
                const Text('🔥', style: TextStyle(fontSize: 14)),
                const SizedBox(width: 4),
                Text(
                  '${stats.streak}',
                  style: GoogleFonts.jetBrainsMono(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppColors.text,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          // User XP
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.surface2,
              borderRadius: AppRadius.smBr,
              border: Border.all(color: AppColors.cardBorder),
            ),
            child: Row(
              children: [
                const Text('⚡', style: TextStyle(fontSize: 14)),
                const SizedBox(width: 4),
                Text(
                  '${stats.xp}',
                  style: GoogleFonts.jetBrainsMono(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppColors.gold,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          // Back link
          if (!isDesktop) // on desktop we already have it in the sidebar
            GestureDetector(
              onTap: () => launchUrl(Uri.parse('https://kurlydeer.com')),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  borderRadius: AppRadius.smBr,
                  border: Border.all(color: AppColors.cardBorder),
                ),
                child: Row(
                  children: [
                    Icon(Icons.open_in_new, color: AppColors.textDim, size: 14),
                    const SizedBox(width: 6),
                    Text(
                      'kurlydeer.com',
                      style: GoogleFonts.jetBrainsMono(
                        fontSize: 12,
                        color: AppColors.textSub,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}

// ── Glass Bottom Nav ──────────────────────────────────────────────────────────

class _GlassNavBar extends StatelessWidget {
  const _GlassNavBar({
    required this.currentIndex,
    required this.onTap,
    required this.isSenior,
  });

  final int currentIndex;
  final ValueChanged<int> onTap;
  final bool isSenior;

  @override
  Widget build(BuildContext context) {
    final iconSize = isSenior ? 28.0 : 22.0;
    final labelSize = isSenior ? 13.0 : 11.0;
    final barHeight = isSenior ? 76.0 : 66.0;
    final bottomPad = MediaQuery.of(context).padding.bottom;

    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
        child: Container(
          height: barHeight + bottomPad,
          decoration: BoxDecoration(
            color: AppColors.cardSurface,
            border: Border(
              top: BorderSide(color: AppColors.cardBorder, width: 1.0),
            ),
          ),
          child: SafeArea(
            top: false,
            child: Row(
              children: [
                _NavItem(
                  icon: Icons.home_outlined,
                  activeIcon: Icons.home_rounded,
                  label: AppStrings.navHomeEs,
                  isSelected: currentIndex == 0,
                  iconSize: iconSize,
                  labelSize: labelSize,
                  onTap: () => onTap(0),
                ),
                _CompaneroNavItem(
                  isSelected: currentIndex == 1,
                  iconSize: iconSize,
                  labelSize: labelSize,
                  onTap: () => onTap(1),
                ),
                _NavItem(
                  icon: Icons.library_books_outlined,
                  activeIcon: Icons.library_books_rounded,
                  label: AppStrings.navLibraryEs,
                  isSelected: currentIndex == 2,
                  iconSize: iconSize,
                  labelSize: labelSize,
                  onTap: () => onTap(2),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  const _NavItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.isSelected,
    required this.iconSize,
    required this.labelSize,
    required this.onTap,
  });

  final IconData icon;
  final IconData activeIcon;
  final String label;
  final bool isSelected;
  final double iconSize;
  final double labelSize;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final color = isSelected ? AppColors.emerald : AppColors.textDim;
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        behavior: HitTestBehavior.opaque,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(isSelected ? activeIcon : icon, color: color, size: iconSize),
              const SizedBox(height: 4),
              Text(
                label,
                style: GoogleFonts.jetBrainsMono(
                  fontSize: labelSize,
                  color: color,
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CompaneroNavItem extends StatelessWidget {
  const _CompaneroNavItem({
    required this.isSelected,
    required this.iconSize,
    required this.labelSize,
    required this.onTap,
  });

  final bool isSelected;
  final double iconSize;
  final double labelSize;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final color = isSelected ? AppColors.emerald : AppColors.textDim;
    final circleSize = iconSize + 16;
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        behavior: HitTestBehavior.opaque,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: circleSize,
                height: circleSize,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: color.withValues(alpha: 0.08),
                  border: Border.all(
                    color: color.withValues(alpha: isSelected ? 0.6 : 0.3),
                    width: 1.5,
                  ),
                  boxShadow: isSelected
                      ? [
                          BoxShadow(
                            color: AppColors.emerald.withValues(alpha: 0.2),
                            blurRadius: 10,
                            spreadRadius: 1,
                          ),
                        ]
                      : null,
                ),
                child: Icon(
                  Icons.chat_bubble_outline_rounded,
                  color: color,
                  size: iconSize - 2,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                AppStrings.navCompaneroEs,
                style: GoogleFonts.jetBrainsMono(
                  fontSize: labelSize,
                  color: color,
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}


class _TopNavItem extends StatelessWidget {
  const _TopNavItem({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final color = isSelected ? AppColors.emerald : AppColors.textDim;
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            label.toUpperCase(),
            style: GoogleFonts.inter(
              fontSize: 14,
              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
              color: color,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 4),
          AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            height: 2,
            width: isSelected ? 24 : 0,
            decoration: BoxDecoration(
              color: AppColors.emerald,
              borderRadius: BorderRadius.circular(1),
            ),
          ),
        ],
      ),
    );
  }
}
