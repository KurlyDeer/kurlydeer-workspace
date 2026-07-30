import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../core/providers/auth_provider.dart';
import '../../core/providers/shared_preferences_provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/clave_button.dart';
import '../../core/widgets/clave_text_field.dart';
import '../../core/widgets/glass_container.dart';
import '../../core/widgets/responsive_layout.dart';
import '../../l10n/app_strings.dart';
import '../dashboard/main_shell_screen.dart';
import '../onboarding/onboarding_screen.dart';

/// Login / Sign-up screen following the app's glassmorphism design.
///
/// Supports:
/// - Email + password sign-in / sign-up
/// - Anonymous "continue as guest" option
class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isSignUp = false;
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  /// Translates FirebaseAuth error codes to Spanish messages.
  String _friendlyError(String code) {
    switch (code) {
      case 'invalid-email':
        return 'El correo electrónico no es válido.';
      case 'user-disabled':
        return 'Esta cuenta ha sido desactivada.';
      case 'user-not-found':
        return 'No existe una cuenta con este correo.';
      case 'wrong-password':
        return 'Contraseña incorrecta. Intenta de nuevo.';
      case 'email-already-in-use':
        return 'Ya existe una cuenta con este correo.';
      case 'weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'invalid-credential':
        return 'Credenciales inválidas. Verifica tu correo y contraseña.';
      case 'too-many-requests':
        return 'Demasiados intentos. Espera un momento e intenta de nuevo.';
      default:
        return 'Error de autenticación. Intenta de nuevo.';
    }
  }

  Future<void> _submitEmailPassword() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    if (email.isEmpty || password.isEmpty) {
      setState(
          () => _errorMessage = 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final authService = ref.read(authServiceProvider);
      if (_isSignUp) {
        await authService.signUpWithEmail(email: email, password: password);
      } else {
        await authService.signInWithEmail(email: email, password: password);
      }
      // AuthGate will handle navigation on auth state change.
    } on FirebaseAuthException catch (e) {
      if (mounted) {
        setState(() => _errorMessage = _friendlyError(e.code));
      }
    } catch (e) {
      if (mounted) {
        setState(() => _errorMessage = 'Error inesperado. Intenta de nuevo.');
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _continueAsGuest() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      await ref.read(authServiceProvider).signInAnonymously();
    } catch (e) {
      debugPrint('Anonymous auth failed: $e. Falling back to local guest session.');
      final prefs = ref.read(sharedPreferencesProvider);
      await prefs.setBool('is_guest_fallback', true);
      
      final onboardingComplete = prefs.getBool('onboarding_complete') ?? false;
      final hasLegacyPersona = prefs.getString('persona') != null;
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(
            builder: (_) => (onboardingComplete || hasLegacyPersona)
                ? const MainShellScreen()
                : const OnboardingScreen(),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _signInWithGoogle() async {
    try {
      final provider = GoogleAuthProvider();
      await FirebaseAuth.instance.signInWithPopup(provider);
    } catch (e) {
      if (mounted) setState(() => _errorMessage = 'Error con Google.');
    }
  }

  Future<void> _signInWithApple() async {
    try {
      final provider = OAuthProvider('apple.com');
      await FirebaseAuth.instance.signInWithPopup(provider);
    } catch (e) {
      if (mounted) setState(() => _errorMessage = 'Error con Apple.');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface0,
      body: Container(
        color: AppColors.surface0,
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
              child: ResponsiveConstrainer(
                maxWidth: ResponsiveBreakpoints.maxNarrowContentWidth,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // ── Logo ──────────────────────────────────────────────
                  const _LogoSection(),
                  const SizedBox(height: 40),

                  // ── Login Form ────────────────────────────────────────
                  GlassContainer(
                    padding: const EdgeInsets.all(24),
                    borderRadius: 8,
                    backgroundColor: AppColors.surface1,
                    borderColor: AppColors.borderLight,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          _isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión',
                          style: AppTextStyles.glassTitle(),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _isSignUp
                              ? 'Crea tu cuenta para guardar tu progreso'
                              : 'Ingresa para continuar tu viaje',
                          style: TextStyle(
                            fontSize: AppFontSizes.body - 2,
                            color: AppColors.textSub,
                            height: 1.4,
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Email field — shared component
                        ClaveTextField(
                          controller: _emailController,
                          hintText: 'Correo electrónico',
                          keyboardType: TextInputType.emailAddress,
                          prefixIcon: Icons.email_outlined,
                        ),
                        const SizedBox(height: 16),

                        // Password field — shared component
                        ClaveTextField(
                          controller: _passwordController,
                          hintText: 'Contraseña',
                          obscureText: true,
                          prefixIcon: Icons.lock_outline,
                          onSubmitted: (_) => _submitEmailPassword(),
                        ),
                        const SizedBox(height: 8),

                        // Error message
                        if (_errorMessage != null) ...[
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: AppColors.error.withValues(alpha: 0.12),
                              borderRadius: AppRadius.mdBr,
                              border: Border.all(
                                color:
                                    AppColors.error.withValues(alpha: 0.4),
                              ),
                            ),
                            child: Row(
                              children: [
                                Icon(Icons.error_outline,
                                    color: AppColors.error, size: 20),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    _errorMessage!,
                                    style: TextStyle(
                                      fontSize: AppFontSizes.body - 4,
                                      color: AppColors.error,
                                      height: 1.3,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                        const SizedBox(height: 24),

                        // Submit button — shared component
                        ClaveButton(
                          label: _isSignUp ? 'Crear Cuenta' : 'Entrar',
                          isLoading: _isLoading,
                          onPressed: _submitEmailPassword,
                          height: 60,
                        ),
                        const SizedBox(height: 16),

                        // Toggle sign-in / sign-up
                        GestureDetector(
                          onTap: () {
                            setState(() {
                              _isSignUp = !_isSignUp;
                              _errorMessage = null;
                            });
                          },
                          child: Text(
                            _isSignUp
                                ? '¿Ya tienes cuenta? Inicia sesión'
                                : '¿No tienes cuenta? Regístrate',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: AppFontSizes.body - 2,
                              color: AppColors.emerald,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // ── OAuth Buttons ─────────────────────────────────────
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          icon: const Icon(Icons.g_mobiledata, size: 28),
                          label: const Text('Google', style: TextStyle(fontWeight: FontWeight.w600)),
                          onPressed: _isLoading ? null : _signInWithGoogle,
                          style: OutlinedButton.styleFrom(
                            foregroundColor: AppColors.text,
                            backgroundColor: AppColors.surface0,
                            side: const BorderSide(color: AppColors.borderDark, width: 1.0),
                            shape: RoundedRectangleBorder(borderRadius: AppRadius.smBr),
                            padding: const EdgeInsets.symmetric(vertical: 16),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: OutlinedButton.icon(
                          icon: const Icon(Icons.apple, size: 24),
                          label: const Text('Apple', style: TextStyle(fontWeight: FontWeight.w600)),
                          onPressed: _isLoading ? null : _signInWithApple,
                          style: OutlinedButton.styleFrom(
                            foregroundColor: AppColors.text,
                            backgroundColor: AppColors.surface0,
                            side: const BorderSide(color: AppColors.borderDark, width: 1.0),
                            shape: RoundedRectangleBorder(borderRadius: AppRadius.smBr),
                            padding: const EdgeInsets.symmetric(vertical: 16),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // ── Divider ───────────────────────────────────────────
                  Row(
                    children: [
                      Expanded(
                          child: Divider(
                              color:
                                  AppColors.textDim.withValues(alpha: 0.3))),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Text(
                          'o',
                          style: TextStyle(
                            color: AppColors.textDim,
                            fontSize: AppFontSizes.body - 2,
                          ),
                        ),
                      ),
                      Expanded(
                          child: Divider(
                              color:
                                  AppColors.textDim.withValues(alpha: 0.3))),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // ── Continue as Guest ─────────────────────────────────
                  ClaveButton(
                    label: 'Continuar como invitado',
                    icon: Icons.person_outline,
                    onPressed: _isLoading ? null : _continueAsGuest,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    ),
    );
  }
}

// ── Logo Section ──────────────────────────────────────────────────────────────

class _LogoSection extends StatelessWidget {
  const _LogoSection();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Logo mark — matching sidebar branding
        Container(
          width: 72,
          height: 72,
          decoration: BoxDecoration(
            borderRadius: AppRadius.lgBr,
            color: AppColors.emerald.withValues(alpha: 0.12),
            border: Border.all(
              color: AppColors.emerald.withValues(alpha: 0.3),
            ),
          ),
          child: Center(
            child: Text(
              'C',
              style: GoogleFonts.jetBrainsMono(
                fontSize: 36,
                fontWeight: FontWeight.w800,
                color: AppColors.emerald,
              ),
            ),
          ),
        ),
        const SizedBox(height: 16),
        Text(
          'CLAVE',
          textAlign: TextAlign.center,
          style: GoogleFonts.jetBrainsMono(
            fontSize: AppFontSizes.headline,
            fontWeight: FontWeight.w800,
            color: AppColors.text,
            letterSpacing: 3.0,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          AppStrings.appTaglineEs,
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: AppFontSizes.subtitle,
            color: AppColors.textSub,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}
