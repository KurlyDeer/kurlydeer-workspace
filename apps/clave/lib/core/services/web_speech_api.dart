@JS()
library web_speech_api;

import 'package:js/js.dart';
import 'package:js/js_util.dart' as js_util;

@JS('SpeechRecognition')
class SpeechRecognition {
  external factory SpeechRecognition();
  external String get lang;
  external set lang(String value);
  external bool get continuous;
  external set continuous(bool value);
  external bool get interimResults;
  external set interimResults(bool value);
  
  external void start();
  external void stop();
  external void abort();
  
  external set onresult(Function callback);
  external set onerror(Function callback);
  external set onend(Function callback);
}

@JS('webkitSpeechRecognition')
class WebkitSpeechRecognition extends SpeechRecognition {
  external factory WebkitSpeechRecognition();
}

bool get hasSpeechRecognition => js_util.hasProperty(js_util.globalThis, 'SpeechRecognition');
bool get hasWebkitSpeechRecognition => js_util.hasProperty(js_util.globalThis, 'webkitSpeechRecognition');
bool get hasWebSpeechApi => hasSpeechRecognition || hasWebkitSpeechRecognition;

SpeechRecognition? createSpeechRecognition() {
  if (hasSpeechRecognition) {
    return SpeechRecognition();
  } else if (hasWebkitSpeechRecognition) {
    return WebkitSpeechRecognition();
  }
  return null;
}
