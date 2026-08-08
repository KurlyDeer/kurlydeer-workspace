import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';


import '../models/lesson_models.dart';
import '../providers/lesson_progress_provider.dart';
import '../providers/shared_preferences_provider.dart';
import '../providers/stats_provider.dart';

final syncServiceProvider = Provider<SyncService>((ref) {
  return SyncService(ref: ref);
});

class SyncService {
  final Ref ref;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  SyncService({required this.ref});

  /// Sync local Hive progress to Firestore, and vice versa.
  Future<void> syncProgress() async {
    final user = _auth.currentUser;
    // Do not sync if guest or offline
    if (user == null || user.isAnonymous) {
      debugPrint('SyncService: User is guest/null. Skipping sync.');
      return;
    }

    try {
      final box = ref.read(lessonProgressBoxProvider);
      final userId = user.uid;
      final progressRef = _firestore.collection('users').doc(userId).collection('progress');

      // 1. Upload local progress that isn't in Firestore yet, or is newer/better
      final localKeys = box.keys.toList();
      for (final key in localKeys) {
        final localProgress = box.get(key);
        if (localProgress != null && localProgress.completed) {
          await progressRef.doc(key.toString()).set({
            'completed': localProgress.completed,
            'voiceScore': localProgress.voiceScore,
            'feedbackEs': localProgress.feedbackEs,
            'updatedAt': FieldValue.serverTimestamp(),
          }, SetOptions(merge: true));
        }
      }

      // 2. Download progress from Firestore to local
      final snapshot = await progressRef.get();
      bool stateChanged = false;

      for (final doc in snapshot.docs) {
        final data = doc.data();
        final completed = data['completed'] as bool? ?? false;
        final voiceScore = data['voiceScore'] as int? ?? 0;
        final feedbackEs = data['feedbackEs'] as String? ?? '';

        final localData = box.get(doc.id);
        
        // If firestore has it but local doesn't, or firestore score is better
        if (completed && (localData == null || voiceScore > localData.voiceScore)) {
          await box.put(
            doc.id,
            LessonProgress(
              completed: completed,
              voiceScore: voiceScore,
              feedbackEs: feedbackEs,
            ),
          );
          stateChanged = true;
        }
      }

      // 3. Trigger UI update if we pulled new data
      if (stateChanged) {
        ref.invalidate(completedLessonIdsProvider);
        ref.invalidate(completedLessonCountProvider);
        debugPrint('SyncService: Merged Firestore progress to local Hive.');
      } else {
        debugPrint('SyncService: Sync complete, no local changes needed.');
      }

      // 4. Sync stats
      final prefs = ref.read(sharedPreferencesProvider);
      
      // Pull persona/settings from preferences
      final isSenior = prefs.getBool('persona_is_senior') ?? false;
      final voiceId = prefs.getString('audio_voice_id');
      final statsDocRef = _firestore.collection('users').doc(userId).collection('stats').doc('main');
      final statsSnapshot = await statsDocRef.get();
      
      final localXp = prefs.getInt('user_xp') ?? 0;
      final localStreak = prefs.getInt('user_streak') ?? 0;
      final localSpeaking = prefs.getInt('speaking_lessons') ?? 0;
      final localWriting = prefs.getInt('writing_lessons') ?? 0;

      if (statsSnapshot.exists) {
        final data = statsSnapshot.data()!;
        final remoteXp = data['xp'] as int? ?? 0;
        final remoteStreak = data['streak'] as int? ?? 0;
        final remoteSpeaking = data['speakingLessons'] as int? ?? 0;
        final remoteWriting = data['writingLessons'] as int? ?? 0;

        final mergedXp = localXp > remoteXp ? localXp : remoteXp;
        final mergedStreak = localStreak > remoteStreak ? localStreak : remoteStreak;
        final mergedSpeaking = localSpeaking > remoteSpeaking ? localSpeaking : remoteSpeaking;
        final mergedWriting = localWriting > remoteWriting ? localWriting : remoteWriting;

        await prefs.setInt('user_xp', mergedXp);
        await prefs.setInt('user_streak', mergedStreak);
        await prefs.setInt('speaking_lessons', mergedSpeaking);
        await prefs.setInt('writing_lessons', mergedWriting);

        await statsDocRef.set({
          'xp': mergedXp,
          'streak': mergedStreak,
          'speakingLessons': mergedSpeaking,
          'writingLessons': mergedWriting,
          'persona_is_senior': isSenior,
          'audio_voice_id': voiceId,
          'updatedAt': FieldValue.serverTimestamp(),
        }, SetOptions(merge: true));

        ref.invalidate(statsProvider);
      } else {
        await statsDocRef.set({
          'xp': localXp,
          'streak': localStreak,
          'speakingLessons': localSpeaking,
          'writingLessons': localWriting,
          'persona_is_senior': isSenior,
          'audio_voice_id': voiceId,
          'updatedAt': FieldValue.serverTimestamp(),
        });
      }

    } catch (e) {
      debugPrint('SyncService: Failed to sync progress: $e');
    }
  }

  /// Uploads a single lesson's progress to Firestore immediately
  Future<void> saveLessonProgress(String lessonId, LessonProgress progress) async {
    final user = _auth.currentUser;
    if (user == null || user.isAnonymous) return;

    try {
      await _firestore
          .collection('users')
          .doc(user.uid)
          .collection('progress')
          .doc(lessonId)
          .set({
        'completed': progress.completed,
        'voiceScore': progress.voiceScore,
        'feedbackEs': progress.feedbackEs,
        'updatedAt': FieldValue.serverTimestamp(),
      }, SetOptions(merge: true));
    } catch (e) {
      debugPrint('SyncService: Failed to save individual lesson progress: $e');
    }
  }
}
