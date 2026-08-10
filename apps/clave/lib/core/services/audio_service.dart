import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_tts/flutter_tts.dart';

enum TtsVoice { alloy, nova }

extension TtsVoiceExt on TtsVoice {
  String get apiName => name;
  String get displayEs => switch (this) {
        TtsVoice.alloy => 'Profesor',
        TtsVoice.nova => 'Profesora',
      };
}

class AudioService {
  AudioService() {
    _initTts();
  }

  static bool _enabled = true;
  static bool _unlocked = false;
  final FlutterTts _tts = FlutterTts();

  TtsVoice _voice = TtsVoice.alloy;

  Future<void> _initTts() async {
    await _tts.setLanguage("es-US");
    // Ensure the engine is initialized.
    if (kIsWeb) {
      // For web, we might not need to set anything specific, but it's good practice.
    } else {
      await _tts.setIosAudioCategory(
        IosTextToSpeechAudioCategory.playback,
        [IosTextToSpeechAudioCategoryOptions.defaultToSpeaker],
        IosTextToSpeechAudioMode.defaultMode,
      );
    }
  }

  /// Triggers a silent speech to unlock Web Audio on the first user tap.
  Future<void> unlockWebAudio() async {
    if (_unlocked || !_enabled || !kIsWeb) return;
    _unlocked = true;
    try {
      await _tts.setVolume(0.0);
      await _tts.speak(" ");
      await _tts.setVolume(1.0);
    } catch (_) {}
  }

  static Future<void> init() async {}
  static Future<void> deactivateForStt() async {}
  static Future<void> activateForTts() async {}
  
  static void setEnabled(bool value) => _enabled = value;
  
  void setVoice(TtsVoice voice) {
    _voice = voice;
    // We could map voices to different pitch/rates here to simulate alloy/nova
    if (_voice == TtsVoice.alloy) {
      _tts.setPitch(0.9); // Deeper voice
    } else {
      _tts.setPitch(1.3); // Higher voice
    }
  }

  Future<void> speak(String text, {double speed = 0.5}) async {
    if (!_enabled || text.trim().isEmpty) return;
    try {
      await _tts.stop();
      await _tts.setSpeechRate(speed);
      
      // Wait for it to finish speaking
      final completer = Completer<void>();
      _tts.setCompletionHandler(() {
        if (!completer.isCompleted) completer.complete();
      });
      _tts.setErrorHandler((msg) {
        if (!completer.isCompleted) completer.completeError(msg);
      });
      
      await _tts.speak(text);
      await completer.future;
    } catch (e) {
      debugPrint('[AudioService] speak error: $e');
    }
  }

  Future<void> stop() async {
    try {
      await _tts.stop();
    } catch (_) {}
  }

  void dispose() {
    _tts.stop();
  }
}
