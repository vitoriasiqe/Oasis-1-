import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ViewStyle,
  TextStyle,
  Pressable, // Added for clarity, part of 'react-native'
  Image,       // Added for clarity, part of 'react-native'
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Placeholder for Link component - specify actual library e.g., expo-router or react-navigation
// import { Link } from 'expo-router'; // Example

// For a real video player, you might use a library like expo-av
// import { Video } from 'expo-av';

const LESSON_TITLE: string = "Introduction to Algebra"; // Example Title
// const TOTAL_LESSON_STEPS: number = 10; // Removed

interface LessonPart {
  type: 'text' | 'video';
  content: string; // For 'text', this is the text itself. For 'video', this is the video URI.
  title?: string; // Optional title for this part, could be displayed
}

// It's good practice to define types for your styles, especially in larger applications
// For simplicity here, we'll let StyleSheet.create infer them, but you could do:
// interface Styles {
//   container: ViewStyle;
//   centeredScreen: ViewStyle;
//   // ... and so on for all styles
// }

const LessonScreen: React.FC = () => {
  const initialLessonParts: LessonPart[] = [
    { type: 'text', title: 'Part 1: Introduction', content: 'This is the first text part of the lesson. Algebra is fun! We will explore variables and equations.' },
    { type: 'video', title: 'Part 2: Explainer Video', content: 'http://d23dyxeqlo5psn.cloudfront.net/big_buck_bunny.mp4' },
    { type: 'text', title: 'Part 3: Summary', content: 'This is the final summary text. You learned a lot about basic algebra concepts!' },
    { type: 'text', title: 'Part 4: Practice Problems', content: 'Solve: 2x + 5 = 15. What is x?'}
  ];
  // This would typically come from props or a data store in a real app
  const [lessonParts, setLessonParts] = useState<LessonPart[]>(initialLessonParts);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0); // Renamed and initialized to 0
  const [lessonCompleted, setLessonCompleted] = useState<boolean>(false);
  const [xpGained, setXpGained] = useState<number>(0);

  // Old didacticText and videoUri removed

  const handleNext = (): void => {
    const totalLessonSteps = lessonParts.length;
    setCurrentStepIndex(prevIndex => {
      if (prevIndex < totalLessonSteps - 1) {
        return prevIndex + 1;
      }
      // Optionally, if at the end, do nothing, or trigger lesson completion readiness
      // For now, just don't go out of bounds.
      // Alert.alert("Navigation", "You are at the last part.");
      return prevIndex;
    });
  };

  const handlePrevious = (): void => {
    setCurrentStepIndex(prevIndex => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      }
      // Optionally, if at the beginning, do nothing.
      // Alert.alert("Navigation", "You are at the first part.");
      return prevIndex;
    });
  };

  const handleCompleteLesson = (): void => {
    const earnedXp: number = 75; // Example XP
    setXpGained(earnedXp);
    setLessonCompleted(true);
    Alert.alert("Lesson Complete!", `Congratulations! You've earned ${earnedXp} XP!`);
  };

  if (lessonCompleted) {
    return (
      <GestureHandlerRootView style={styles.gestureHandlerRoot}>
        <View style={[styles.container, styles.centeredScreen]}>
          <Text style={styles.completionText}>Parabéns!</Text>
          <Text style={styles.completionText}>Você conquistou +{xpGained} XP!</Text>
          <TouchableOpacity
            onPress={(): void => {
              setLessonCompleted(false);
              setCurrentStepIndex(0); // Reset for demo, use currentStepIndex
              setXpGained(0);
              Alert.alert("Navigation", "Returning to lesson list (placeholder)");
              // In a real app: navigation.navigate('LessonList');
            }}
            style={styles.continueButton}
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    );
  }

  const totalLessonSteps = lessonParts.length;
  const progressPercentage = totalLessonSteps > 0 ? ((currentStepIndex + 1) / totalLessonSteps) * 100 : 0;
  const currentPart = lessonParts[currentStepIndex];


  return (
    <GestureHandlerRootView style={styles.gestureHandlerRoot}>
      {/* New App Header */}
      <View style={styles.appHeader}>
        <Pressable onPress={() => Alert.alert("Navigation", "Back to Home (placeholder)")}>
          {/* <Link href={'../'}> */}
          <Image style={styles.backIcon} source={require('@/assets/images/Back.png')} />
          {/* </Link> */}
        </Pressable>
        <Text style={styles.appHeaderTitle}>Página Inicial</Text>
      </View>

      {/* Original main container now takes remaining space */}
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {/* Lesson-Specific Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.lessonTitleText}>{LESSON_TITLE}</Text>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
          </View>
        </View>

        <ScrollView style={styles.contentScrollArea}>
          {currentPart ? (
            <>
              {currentPart.title && (
                <Text style={styles.partTitleText}>{currentPart.title}</Text>
              )}
              {currentPart.type === 'text' && (
                <Text style={styles.didacticText}>{currentPart.content}</Text>
              )}
              {currentPart.type === 'video' && (
                <View style={styles.videoPlayerPlaceholder}>
                  <Text style={styles.videoPlaceholderText}>Video: {currentPart.content}</Text>
                </View>
              )}
            </>
          ) : (
            <Text style={styles.didacticText}>Loading content...</Text>
          )}
        </ScrollView>

        <View style={styles.navigationButtonContainer}>
          <TouchableOpacity onPress={handlePrevious} style={styles.navigationButton}>
            <Text style={styles.navigationButtonText}>‹ Anterior</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.navigationButton}>
            <Text style={styles.navigationButtonText}>Próximo ›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={handleCompleteLesson} style={styles.completeLessonButton}>
            <Text style={styles.completeLessonButtonText}>Concluir Aula</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gestureHandlerRoot: {
    flex: 1,
  } as ViewStyle,
  container: { // Used by completion screen primarily now
    flex: 1,
    backgroundColor: '#FFFFFF',
  } as ViewStyle,
  centeredScreen: { // Used for completion screen
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  } as ViewStyle,
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    // paddingTop handled by device/status bar, or SafeAreaView if used.
    // Let's add some vertical padding for the elements themselves.
    paddingVertical: 10, // Or Platform.OS === 'ios' ? 10 : StatusBar.currentHeight + 10 for android if not using SafeAreaView
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#F8F9FA',
  } as ViewStyle,
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
    // tintColor: '#1ABC9C', // Optional: if you want to color a monochrome icon
  }, // Expo ImageStyle is ViewStyle based, this is fine.
  appHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  } as TextStyle,
  headerContainer: { // Lesson-specific header
    paddingTop: 15, // Reduced paddingTop
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#F8F9FA', // Keep light grey to differentiate from appHeader or match if desired
  } as ViewStyle,
  lessonTitleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3A3A3A',
    marginBottom: 10,
  } as TextStyle,
  progressBarTrack: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    width: '100%',
  } as ViewStyle,
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1ABC9C',
    borderRadius: 5,
  } as ViewStyle,
  contentScrollArea: {
    flex: 1,
    paddingHorizontal: 20,
  } as ViewStyle, // Technically ScrollViewStyle but ViewStyle is compatible for this subset
  didacticText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4F4F4F',
    marginTop: 10,
    marginBottom: 20,
  } as TextStyle,
  partTitleText: { // New style for lesson part titles
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3A3A3A',
    marginBottom: 8,
    marginTop: 10,
  } as TextStyle,
  videoPlayerPlaceholder: {
    height: 200,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 8, // Added border radius
  } as ViewStyle,
  videoPlaceholderText: {
    fontSize: 16,
    color: '#757575',
  } as TextStyle,
  navigationButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  } as ViewStyle,
  navigationButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  } as ViewStyle, // Or TouchableOpacityProps['style']
  navigationButtonText: {
    fontSize: 16,
    color: '#1ABC9C',
    fontWeight: 'bold',
  } as TextStyle,
  footerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  } as ViewStyle,
  completeLessonButton: {
    backgroundColor: '#2ECC71',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  completeLessonButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  } as TextStyle,
  completionText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2C3E50',
  } as TextStyle,
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  } as TextStyle,
  continueButton: {
    backgroundColor: '#1ABC9C',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: 'center',
  } as ViewStyle,
});

export default LessonScreen;
