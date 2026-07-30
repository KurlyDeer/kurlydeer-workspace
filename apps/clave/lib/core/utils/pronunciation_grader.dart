import 'dart:math';

class WordMatch {
  final String word;
  final bool correct;
  WordMatch({required this.word, required this.correct});
}

class PronunciationResult {
  final int score;
  final String feedback;
  final List<WordMatch> wordResults;

  PronunciationResult({
    required this.score,
    required this.feedback,
    required this.wordResults,
  });
}

class PronunciationGrader {
  static PronunciationResult grade(String targetPhrase, String studentTranscript) {
    if (studentTranscript.trim().isEmpty) {
      return PronunciationResult(
        score: 0,
        feedback: "No escuché nada. ¡Inténtalo de nuevo!",
        wordResults: [],
      );
    }
    
    // 1. Sanitize
    final targetClean = _sanitize(targetPhrase);
    final transcriptClean = _sanitize(studentTranscript);
    
    final targetWordsOriginal = _splitWords(targetPhrase); // Keep original punctuation for UI
    final targetWords = _splitWords(targetClean);
    final transcriptWords = _splitWords(transcriptClean);
    
    if (targetWords.isEmpty) {
      return PronunciationResult(
        score: 10,
        feedback: "¡Perfecto!",
        wordResults: [],
      );
    }

    // 2. Score word by word
    int matches = 0;
    List<WordMatch> wordResults = [];
    
    for (int i = 0; i < targetWords.length; i++) {
      final tWord = targetWords[i];
      final originalWord = i < targetWordsOriginal.length ? targetWordsOriginal[i] : tWord;
      
      bool found = false;
      for (final sWord in transcriptWords) {
        if (_isCloseMatch(tWord, sWord)) {
          found = true;
          break;
        }
      }
      
      wordResults.add(WordMatch(word: originalWord, correct: found));
      if (found) matches++;
    }
    
    // 3. Calculate score (1 - 10)
    double ratio = matches / targetWords.length;
    int score = (ratio * 10).round();
    
    // Penalty if transcript is way longer than target (talking too much)
    if (transcriptWords.length > targetWords.length * 2) {
      score = max(1, score - 2);
    }
    
    if (score == 0 && studentTranscript.isNotEmpty) {
      score = 1;
    }
    
    // 4. Feedback
    String feedback = "";
    if (score == 10) {
      feedback = "¡Perfecto! Tienes una pronunciación excelente.";
    } else if (score >= 8) {
      feedback = "¡Casi perfecto! Muy buen trabajo.";
    } else if (score >= 5) {
      feedback = "Vas por buen camino, fíjate en las palabras marcadas.";
    } else {
      feedback = "La práctica hace al maestro. ¡Inténtalo otra vez!";
    }
    
    return PronunciationResult(
      score: score,
      feedback: feedback,
      wordResults: wordResults,
    );
  }
  
  static String _sanitize(String input) {
    return input.toLowerCase().replaceAll(RegExp(r'[^\w\s\á\é\í\ó\ú\ñ]'), '');
  }

  static List<String> _splitWords(String input) {
    return input.split(' ').where((w) => w.trim().isNotEmpty).toList();
  }
  
  static bool _isCloseMatch(String w1, String w2) {
    if (w1 == w2) return true;
    
    // Allow minor typos or singular/plural mismatches for long words
    if (w1.length > 3 && w2.length > 3) {
      if (w1.startsWith(w2) || w2.startsWith(w1)) return true;
      if (_levenshteinDistance(w1, w2) <= 1) return true;
    }
    
    return false;
  }

  static int _levenshteinDistance(String s1, String s2) {
    if (s1 == s2) return 0;
    if (s1.isEmpty) return s2.length;
    if (s2.isEmpty) return s1.length;

    List<int> v0 = List<int>.generate(s2.length + 1, (i) => i);
    List<int> v1 = List<int>.filled(s2.length + 1, 0);

    for (int i = 0; i < s1.length; i++) {
      v1[0] = i + 1;
      for (int j = 0; j < s2.length; j++) {
        int cost = (s1[i] == s2[j]) ? 0 : 1;
        v1[j + 1] = min(v1[j] + 1, min(v0[j + 1] + 1, v0[j] + cost));
      }
      for (int j = 0; j < v0.length; j++) {
        v0[j] = v1[j];
      }
    }
    return v1[s2.length];
  }
}
