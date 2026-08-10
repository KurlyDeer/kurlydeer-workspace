// Stub for non-web platforms.

class WebSpeechFallback {
  static bool get isAvailable => false;
  
  static void startListening({
    required Function(String) onResult,
    required Function(String) onError,
    required Function() onEnd,
  }) {}

  static void stopListening() {}
}
