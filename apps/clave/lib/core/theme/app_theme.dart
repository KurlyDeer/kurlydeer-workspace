import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

// ── AppColors ─────────────────────────────────────────────────────────────────
/// Consolidated color palette aligned with the kurlydeer.com design language.
///
/// Dark-first, monochrome foundation with intentional emerald / gold accents.
class AppColors {
  AppColors._();

  // ── Core Palette ──────────────────────────────────────────────────────────
  static const Color black       = Color(0xFF000000);
  static const Color white       = Color(0xFFFFFFFF);

  // ── Dark Surfaces (primary theme) ─────────────────────────────────────────
  static const Color surface0    = Color(0xFF0A0A0A); // High-contrast deepest bg
  static const Color surface1    = Color(0xFF111111); // slightly lifted
  static const Color surface2    = Color(0xFF1A1A1A); // card bg
  static const Color surface3    = Color(0xFF222222); // elevated
  static const Color surface4    = Color(0xFF333333); // subtle

  // ── Light Surfaces (for light mode support) ───────────────────────────────
  static const Color lightSurface0 = Color(0xFFFFFFFF);
  static const Color lightSurface1 = Color(0xFFF8F9FA); // apps/web background
  static const Color lightSurface2 = Color(0xFFF1F3F5); // card bg
  static const Color lightSurface3 = Color(0xFFE9ECEF); // elevated
  static const Color lightSurface4 = Color(0xFFDEE2E6); // subtle

  // ── Borders ───────────────────────────────────────────────────────────────
  static const Color borderDark    = Color(0xFF222222); // sharp dark border
  static const Color borderSubtle  = Color(0xFF333333); // subtle dark border
  static const Color borderLight   = Color(0xFFDEE2E6); // sharp light border
  static const Color borderLighter = Color(0xFFE9ECEF); // subtle light border

  // ── Text ──────────────────────────────────────────────────────────────────
  static const Color textPrimary   = Color(0xFFFAFAFA); // zinc-50
  static const Color textSecondary = Color(0xFFA1A1AA); // zinc-400
  static const Color textMuted     = Color(0xFF71717A); // zinc-500
  static const Color textFaint     = Color(0xFF52525B); // zinc-600

  // Light-mode text
  static const Color textPrimaryLight   = Color(0xFF09090B); // zinc-950
  static const Color textSecondaryLight = Color(0xFF52525B); // zinc-600
  static const Color textMutedLight     = Color(0xFF71717A); // zinc-500

  // ── Accent Colors ─────────────────────────────────────────────────────────
  static const Color emerald       = Color(0xFF10B981); // emerald-500 — primary accent
  static const Color emeraldLight  = Color(0xFF34D399); // emerald-400
  static const Color emeraldDark   = Color(0xFF059669); // emerald-600
  static const Color emeraldSubtle = Color(0xFF064E3B); // emerald-950

  static const Color gold          = Color(0xFFF59E0B); // amber-500 — premium
  static const Color goldLight     = Color(0xFFFBBF24); // amber-400
  static const Color goldSubtle    = Color(0xFF78350F); // amber-950

  // ── Semantic Colors ───────────────────────────────────────────────────────
  static const Color success       = Color(0xFF22C55E); // green-500
  static const Color successSubtle = Color(0xFF052E16); // green-950
  static const Color error         = Color(0xFFEF4444); // red-500
  static const Color errorSubtle   = Color(0xFF450A0A); // red-950
  static const Color warning       = Color(0xFFF59E0B); // amber-500
  static const Color info          = Color(0xFF3B82F6); // blue-500

  // ── Difficulty Levels ─────────────────────────────────────────────────────
  static const Color difficultyA1  = Color(0xFF10B981); // Emerald
  static const Color difficultyA2  = Color(0xFF3B82F6); // Blue
  static const Color difficultyB1  = Color(0xFFF43F5E); // Rose

  // ── Dynamic getters (theme-aware) ─────────────────────────────────────────
  static bool _isDark = true;
  static void setDarkMode(bool v) => _isDark = v;

  // Background gradient
  static Color get gradientStart  => _isDark ? surface0    : lightSurface0;
  static Color get gradientMid    => _isDark ? surface1    : lightSurface1;
  static Color get gradientEnd    => _isDark ? surface0    : lightSurface0;

  // Card / container surface
  static Color get cardSurface    => _isDark ? surface2.withValues(alpha: 0.7) : lightSurface0.withValues(alpha: 0.85);
  static Color get cardBorder     => _isDark ? borderDark.withValues(alpha: 0.8) : borderLight.withValues(alpha: 0.6);

  // Text (reactive)
  static Color get text           => _isDark ? textPrimary   : textPrimaryLight;
  static Color get textSub        => _isDark ? textSecondary : textSecondaryLight;
  static Color get textDim        => _isDark ? textMuted     : textMutedLight;

  // Highlight overlay
  static Color get highlight      => _isDark ? white.withValues(alpha: 0.06) : black.withValues(alpha: 0.04);

  // ── Legacy aliases (transitional — prefer new names) ──────────────────────
  // These provide backward compat while screens migrate incrementally.
  static Color get glassGradientStart => gradientStart;
  static Color get glassGradientMid   => gradientMid;
  static Color get glassGradientEnd   => gradientEnd;
  static Color get glassSurface       => cardSurface;
  static Color get glassBorder        => cardBorder;
  static Color get glassText          => text;
  static Color get glassTextMuted     => textSub;
  static Color get glassHighlight     => highlight;
  static Color get glowTerracotta     => gold;  // migrated from terracotta
  static const Color premiumGold      = gold;
  static const Color successGreen     = success;
  static const Color warningAmber     = warning;
  static const Color errorRed         = error;
  static const Color darkText         = textPrimaryLight;
  static const Color lightText        = white;

  // ── Legacy colors (deprecated — use new palette) ──────────────────────────
  static const Color terracotta       = gold;
  static const Color deepBlue         = info;
  static const Color cream            = lightSurface1;
  static const Color cardBackground   = lightSurface0;
  static const Color selectedBorder   = gold;
  static const Color unselectedBorder = borderLight;
  static const Color shadow           = Color(0x1A000000);
  static const Color emeraldBase      = emerald;
  static const Color emeraldHighlight = emeraldLight;
}

// ── AppRadius ─────────────────────────────────────────────────────────────────
/// Standard border radii — aligned with kurlydeer.com (4–8px, sharp & precise).
class AppRadius {
  AppRadius._();
  static const double xs   = 4.0;
  static const double sm   = 6.0;
  static const double md   = 8.0;
  static const double lg   = 12.0;
  static const double pill = 100.0;  // for pill-shaped elements

  static BorderRadius get xsBr   => BorderRadius.circular(xs);
  static BorderRadius get smBr   => BorderRadius.circular(sm);
  static BorderRadius get mdBr   => BorderRadius.circular(md);
  static BorderRadius get lgBr   => BorderRadius.circular(lg);
  static BorderRadius get pillBr => BorderRadius.circular(pill);
}

// ── AppFontSizes ──────────────────────────────────────────────────────────────

class AppFontSizes {
  AppFontSizes._();

  static const double caption  = 12.0;
  static const double small    = 13.0;
  static const double body     = 16.0;
  static const double subtitle = 18.0;
  static const double title    = 24.0;
  static const double headline = 32.0;
  static const double display  = 40.0;

  // Senior Mode overrides (applied when Abuelo persona is active)
  static const double bodyLarge     = 22.0;
  static const double subtitleLarge = 24.0;
  static const double titleLarge    = 30.0;
  static const double headlineLarge = 36.0;
}

// ── AppGlassStyles ────────────────────────────────────────────────────────────

class AppGlassStyles {
  AppGlassStyles._();

  static Gradient get backgroundGradient => LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [
      AppColors.gradientStart,
      AppColors.gradientMid,
      AppColors.gradientEnd,
    ],
  );

  static BoxDecoration get cardDecoration => BoxDecoration(
    color: AppColors.cardSurface,
    borderRadius: AppRadius.smBr, // Crisper corners
    border: Border.all(color: AppColors.cardBorder, width: 1.0), // Crisp 1px border
  );

  static BoxDecoration glowBorder(Color color) => BoxDecoration(
    color: AppColors.cardSurface,
    borderRadius: AppRadius.smBr,
    border: Border.all(color: color, width: 1.0),
    // Removed heavy shadows for flat design
  );

  static Color difficultyColor(String difficulty) {
    switch (difficulty) {
      case 'A1':
        return AppColors.difficultyA1;
      case 'A2':
        return AppColors.difficultyA2;
      case 'B1':
        return AppColors.difficultyB1;
      default:
        return AppColors.difficultyA1;
    }
  }
}

// ── AppTextStyles ─────────────────────────────────────────────────────────────

class AppTextStyles {
  AppTextStyles._();

  // ── Headlines ─────────────────────────────────────────────────────────────
  static TextStyle headline({bool isSenior = false}) => GoogleFonts.spaceGrotesk(
    fontSize: isSenior ? AppFontSizes.headlineLarge : AppFontSizes.headline,
    fontWeight: FontWeight.w800,
    color: AppColors.text,
    height: 1.2,
  );

  static TextStyle glassTitle({bool isSenior = false}) => GoogleFonts.spaceGrotesk(
    fontSize: isSenior ? AppFontSizes.titleLarge : AppFontSizes.title,
    fontWeight: FontWeight.w700,
    color: AppColors.text,
  );

  static TextStyle cardTitle({bool isSenior = false}) => GoogleFonts.spaceGrotesk(
    fontSize: isSenior ? AppFontSizes.subtitleLarge : AppFontSizes.subtitle,
    fontWeight: FontWeight.w700,
    color: AppColors.text,
  );

  // ── Body ──────────────────────────────────────────────────────────────────
  static TextStyle glassBody({bool isSenior = false}) => GoogleFonts.inter(
    fontSize: isSenior ? AppFontSizes.bodyLarge : AppFontSizes.body,
    color: AppColors.text,
    height: 1.5,
  );

  static TextStyle glassMuted({bool isSenior = false}) => GoogleFonts.inter(
    fontSize: isSenior ? AppFontSizes.bodyLarge : AppFontSizes.body,
    color: AppColors.textSub,
    height: 1.5,
  );

  // ── Monospaced ────────────────────────────────────────────────────────────
  /// Uppercase monospaced section label (e.g., "01 MI CAMINO")
  static TextStyle sectionLabel({Color? color}) => GoogleFonts.jetBrainsMono(
    fontSize: AppFontSizes.caption,
    fontWeight: FontWeight.w600,
    color: color ?? AppColors.textSub,
    letterSpacing: 1.5,
  );

  /// Monospaced meta/stat value (e.g., "XP: 120", "STREAK: 5d")
  static TextStyle monoMeta({Color? color, double? fontSize}) => GoogleFonts.jetBrainsMono(
    fontSize: fontSize ?? AppFontSizes.small,
    fontWeight: FontWeight.w700,
    color: color ?? AppColors.text,
    letterSpacing: 0.5,
  );

  /// Monospaced difficulty badge (e.g., "A1", "B1")
  static TextStyle difficultyBadge(Color color) => GoogleFonts.jetBrainsMono(
    fontSize: AppFontSizes.caption,
    fontWeight: FontWeight.w700,
    color: color,
    letterSpacing: 0.5,
  );

  /// Monospaced progress counter (e.g., "[ 04 / 20 ]")
  static TextStyle progressCounter({bool isSenior = false}) => GoogleFonts.jetBrainsMono(
    fontSize: isSenior ? AppFontSizes.subtitle : 14.0,
    fontWeight: FontWeight.w600,
    color: AppColors.textSub,
    letterSpacing: 1.0,
  );

  // ── Button ────────────────────────────────────────────────────────────────
  static TextStyle buttonLabel({double? fontSize}) => GoogleFonts.inter(
    fontSize: fontSize ?? AppFontSizes.subtitle,
    fontWeight: FontWeight.w700,
    letterSpacing: 0.3,
  );
}

// ── AppTheme ──────────────────────────────────────────────────────────────────

class AppTheme {
  AppTheme._();

  static ThemeData get light {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.emerald,
        primary: AppColors.emerald,
        secondary: AppColors.emeraldLight,
        surface: AppColors.lightSurface1,
        brightness: Brightness.light,
      ),
      scaffoldBackgroundColor: AppColors.lightSurface0,
      textTheme: TextTheme(
        headlineLarge: GoogleFonts.spaceGrotesk(
          fontSize: AppFontSizes.headline,
          fontWeight: FontWeight.w800,
          color: AppColors.textPrimaryLight,
          height: 1.2,
        ),
        titleLarge: GoogleFonts.spaceGrotesk(
          fontSize: AppFontSizes.title,
          fontWeight: FontWeight.w700,
          color: AppColors.textPrimaryLight,
        ),
        bodyLarge: GoogleFonts.inter(
          fontSize: AppFontSizes.body,
          fontWeight: FontWeight.w400,
          color: AppColors.textPrimaryLight,
          height: 1.5,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: AppFontSizes.body,
          color: AppColors.textPrimaryLight,
        ),
        labelLarge: GoogleFonts.inter(
          fontSize: AppFontSizes.subtitle,
          fontWeight: FontWeight.w600,
          color: AppColors.white,
          letterSpacing: 0.5,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          minimumSize: const Size.fromHeight(56),
          backgroundColor: AppColors.emerald,
          foregroundColor: AppColors.white,
          shape: RoundedRectangleBorder(
            borderRadius: AppRadius.mdBr,
          ),
          textStyle: GoogleFonts.inter(
            fontSize: AppFontSizes.subtitle,
            fontWeight: FontWeight.w700,
          ),
          elevation: 0,
        ),
      ),
    );
  }

  static ThemeData get dark {
    return ThemeData.dark(useMaterial3: true).copyWith(
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.emerald,
        primary: AppColors.emerald,
        secondary: AppColors.emeraldLight,
        surface: AppColors.surface1,
        brightness: Brightness.dark,
      ),
      scaffoldBackgroundColor: AppColors.surface0,
      textTheme: TextTheme(
        headlineLarge: GoogleFonts.spaceGrotesk(
          fontSize: AppFontSizes.headline,
          fontWeight: FontWeight.w800,
          color: AppColors.textPrimary,
          height: 1.2,
        ),
        titleLarge: GoogleFonts.spaceGrotesk(
          fontSize: AppFontSizes.title,
          fontWeight: FontWeight.w700,
          color: AppColors.textPrimary,
        ),
        bodyLarge: GoogleFonts.inter(
          fontSize: AppFontSizes.body,
          fontWeight: FontWeight.w400,
          color: AppColors.textPrimary,
          height: 1.5,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: AppFontSizes.body,
          color: AppColors.textPrimary,
        ),
        labelLarge: GoogleFonts.inter(
          fontSize: AppFontSizes.subtitle,
          fontWeight: FontWeight.w600,
          color: AppColors.white,
          letterSpacing: 0.5,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          minimumSize: const Size.fromHeight(56),
          backgroundColor: AppColors.emerald,
          foregroundColor: AppColors.white,
          shape: RoundedRectangleBorder(
            borderRadius: AppRadius.mdBr,
          ),
          textStyle: GoogleFonts.inter(
            fontSize: AppFontSizes.subtitle,
            fontWeight: FontWeight.w700,
          ),
          elevation: 0,
        ),
      ),
    );
  }
}
