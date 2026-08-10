import 'package:js/js_util.dart' as js_util;
import 'web_speech_api.dart';

class WebSpeechFallback {
  static SpeechRecognition? _recognition;
  
  static bool get isAvailable => hasWebSpeechApi;
  
  static void startListening({
    required Function(String) onResult,
    required Function(String) onError,
    required Function() onEnd,
  }) {
    _recognition ??= createSpeechRecognition();
    if (_recognition == null) return;
    
    _recognition!.lang = 'en-US';
    _recognition!.continuous = false;
    _recognition!.interimResults = true;
    
    _recognition!.onresult = js_util.allowInterop((event) {
      // JS event parsing. The result is event.results[i][0].transcript
      try {
        final results = js_util.getProperty(event, 'results');
        final length = js_util.getProperty(results, 'length');
        String transcript = '';
        for (int i = 0; i < length; i++) {
          final result = js_util.getProperty(results, i);
          final alternatives = js_util.getProperty(result, 0);
          transcript += js_util.getProperty(alternatives, 'transcript') + ' ';
        }
        onResult(transcript.trim());
      } catch (e) {
        // ignore parsing errors
      }
    });
    
    _recognition!.onerror = js_util.allowInterop((event) {
      onError('Microphone error or denied.');
    });
    
    _recognition!.onend = js_util.allowInterop((event) {
      onEnd();
    });
    
    try {
      _recognition!.start();
    } catch (e) {
      // already started or other error
    }
  }

  static void stopListening() {
    try {
      _recognition?.stop();
    } catch (_) {}
  }
}
