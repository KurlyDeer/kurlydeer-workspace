import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/services/sync_service.dart';

import '../../core/providers/persona_provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/responsive_layout.dart';
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
            body: Row(
              children: [
                _WebSideNav(
                  currentIndex: _currentIndex,
                  onTap: (index) => setState(() => _currentIndex = index),
                  isSenior: isSenior,
                ),
                Expanded(
                  child: IndexedStack(
                    index: _currentIndex,
                    children: _tabs,
                  ),
                ),
              ],
            ),
          );
        }

        return Scaffold(
          backgroundColor: AppColors.gradientStart,
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

// ── Web Side Nav ─────────────────────────────────────────────────────────────

class _WebSideNav extends StatelessWidget {
  const _WebSideNav({
    required this.currentIndex,
    required this.onTap,
    required this.isSenior,
  });

  final int currentIndex;
  final ValueChanged<int> onTap;
  final bool isSenior;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 240,
      decoration: BoxDecoration(
        color: AppColors.cardSurface,
        border: Border(
          right: BorderSide(color: AppColors.cardBorder, width: 1.0),
        ),
      ),
      child: ClipRect(
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
          child: SafeArea(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 28),
                // App branding — CLAVE
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    children: [
                      // Logo mark
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          borderRadius: AppRadius.smBr,
                          color: AppColors.emerald.withValues(alpha: 0.12),
                          border: Border.all(
                            color: AppColors.emerald.withValues(alpha: 0.3),
                          ),
                        ),
                        child: Center(
                          child: Text(
                            'C',
                            style: GoogleFonts.jetBrainsMono(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: AppColors.emerald,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'CLAVE',
                              style: GoogleFonts.jetBrainsMono(
                                fontSize: 18,
                                fontWeight: FontWeight.w800,
                                color: AppColors.text,
                                letterSpacing: 2.0,
                              ),
                            ),
                            Text(
                              'LANGUAGE LEARNING',
                              style: GoogleFonts.jetBrainsMono(
                                fontSize: 9,
                                fontWeight: FontWeight.w500,
                                color: AppColors.textDim,
                                letterSpacing: 1.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 36),

                // Navigation Links
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: Column(
                    children: [
                      _SideNavItem(
                        icon: Icons.home_outlined,
                        activeIcon: Icons.home_rounded,
                        label: AppStrings.navHomeEs,
                        isSelected: currentIndex == 0,
                        isSenior: isSenior,
                        onTap: () => onTap(0),
                      ),
                      const SizedBox(height: 4),
                      _SideNavItem(
                        icon: Icons.chat_bubble_outline_rounded,
                        activeIcon: Icons.chat_bubble_rounded,
                        label: AppStrings.navCompaneroEs,
                        isSelected: currentIndex == 1,
                        isSenior: isSenior,
                        onTap: () => onTap(1),
                      ),
                      const SizedBox(height: 4),
                      _SideNavItem(
                        icon: Icons.library_books_outlined,
                        activeIcon: Icons.library_books_rounded,
                        label: AppStrings.navLibraryEs,
                        isSelected: currentIndex == 2,
                        isSenior: isSenior,
                        onTap: () => onTap(2),
                      ),
                    ],
                  ),
                ),

                const Spacer(),

                // kurlydeer.com link
                Padding(
                  padding: const EdgeInsets.fromLTRB(12, 0, 12, 16),
                  child: GestureDetector(
                    onTap: () => launchUrl(Uri.parse('https://kurlydeer.com')),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        borderRadius: AppRadius.mdBr,
                        border: Border.all(color: AppColors.cardBorder),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.open_in_new, color: AppColors.textDim, size: 16),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              'kurlydeer.com',
                              style: GoogleFonts.jetBrainsMono(
                                fontSize: 12,
                                color: AppColors.textSub,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
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

class _SideNavItem extends StatelessWidget {
  const _SideNavItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.isSelected,
    required this.isSenior,
    required this.onTap,
  });

  final IconData icon;
  final IconData activeIcon;
  final String label;
  final bool isSelected;
  final bool isSenior;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final color = isSelected ? AppColors.emerald : AppColors.textDim;
    final bgColor = isSelected
        ? AppColors.emerald.withValues(alpha: 0.08)
        : Colors.transparent;
    final iconSize = isSenior ? 26.0 : 22.0;
    final labelSize = isSenior ? 16.0 : 14.0;

    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: AppRadius.mdBr,
          border: Border.all(
            color: isSelected
                ? AppColors.emerald.withValues(alpha: 0.3)
                : Colors.transparent,
          ),
        ),
        child: Row(
          children: [
            Icon(isSelected ? activeIcon : icon, color: color, size: iconSize),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                label,
                style: GoogleFonts.inter(
                  fontSize: labelSize,
                  color: color,
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
