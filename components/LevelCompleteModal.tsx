import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { LevelCompleteModalProps } from '../app/types';

const { width, height } = Dimensions.get('window');

interface LevelCompleteModalStyles {
  overlay: ViewStyle;
  modalContainer: ViewStyle;
  modalContent: ViewStyle;
  checkmarkContainer: ViewStyle;
  checkmark: TextStyle;
  title: TextStyle;
  subtitle: TextStyle;
  targetInfo: TextStyle;
  nextButton: ViewStyle;
  nextButtonText: TextStyle;
}

/**
 * CheckmarkIcon Component
 * 
 * Renders an animated checkmark with celebration effect
 */
const CheckmarkIcon: React.FC<{ animated?: boolean }> = ({ animated = true }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      // Animate checkmark appearance with bounce effect
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(1);
      opacityAnim.setValue(1);
    }
  }, [animated, scaleAnim, opacityAnim]);

  return (
    <Animated.View 
      style={[
        styles.checkmarkContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }
      ]}
    >
      <Text style={styles.checkmark}>✓</Text>
    </Animated.View>
  );
};

/**
 * LevelCompleteModal Component
 * 
 * Displays a celebration modal when a level is completed,
 * showing the achievement and allowing progression to the next level.
 */
const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  visible,
  level,
  targetNumber,
  onNextLevel,
}) => {
  const modalAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      // Animate modal appearance
      Animated.parallel([
        Animated.timing(modalAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations when modal is hidden
      modalAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [visible, modalAnim, slideAnim]);

  /**
   * Handle next level button press
   */
  const handleNextLevel = (): void => {
    // Add a small delay for better UX
    setTimeout(() => {
      onNextLevel();
    }, 100);
  };

  /**
   * Get congratulations message based on level
   */
  const getCongratulationsMessage = (): string => {
    if (level === 1) {
      return "Great start!";
    } else if (level <= 5) {
      return "Well done!";
    } else if (level <= 10) {
      return "Excellent!";
    } else if (level <= 20) {
      return "Outstanding!";
    } else {
      return "Incredible!";
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      accessibilityViewIsModal
      testID="level-complete-modal"
    >
      <Animated.View 
        style={[
          styles.overlay,
          {
            opacity: modalAnim,
          }
        ]}
      >
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              opacity: modalAnim,
              transform: [
                { translateY: slideAnim },
                { scale: modalAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }) }
              ],
            }
          ]}
        >
          <View style={styles.modalContent}>
            {/* Animated Checkmark */}
            <CheckmarkIcon animated={visible} />

            {/* Congratulations Message */}
            <Text 
              style={styles.title}
              accessibilityRole="header"
            >
              {getCongratulationsMessage()}
            </Text>

            {/* Level Information */}
            <Text style={styles.subtitle}>
              Level {level} Complete!
            </Text>

            {/* Target Achievement */}
            <Text style={styles.targetInfo}>
              Target reached: {targetNumber}
            </Text>

            {/* Next Level Button */}
            <TouchableOpacity
              onPress={handleNextLevel}
              style={styles.nextButton}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`Continue to level ${level + 1}`}
              accessibilityHint="Tap to proceed to the next level"
              testID="next-level-button"
            >
              <Text style={styles.nextButtonText}>
                NEXT LEVEL
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

/**
 * Styles for LevelCompleteModal component
 */
const styles = StyleSheet.create<LevelCompleteModalStyles>({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    width: '100%',
    // Shadow for iOS
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    // Elevation for Android
    elevation: 10,
  },
  checkmarkContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  checkmark: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '300',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
  },
  targetInfo: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '300',
  },
  nextButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#000000',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for iOS
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 2,
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default LevelCompleteModal;

// Export additional utilities for testing
export { CheckmarkIcon, styles as LevelCompleteModalStyles };

/**
 * Helper function to get level-based celebration messages
 */
export const getCelebrationMessage = (level: number): string => {
  const messages = [
    "Great start!",      // Level 1
    "Well done!",        // Levels 2-5
    "Excellent!",        // Levels 6-10
    "Outstanding!",      // Levels 11-20
    "Incredible!",       // Levels 21+
  ];

  if (level === 1) return messages[0];
  if (level <= 5) return messages[1];
  if (level <= 10) return messages[2];
  if (level <= 20) return messages[3];
  return messages[4];
};

/**
 * Configuration for different celebration effects
 */
export interface CelebrationConfig {
  message: string;
  checkmarkColor: string;
  animationDuration: number;
}

export const getCelebrationConfig = (level: number): CelebrationConfig => ({
  message: getCelebrationMessage(level),
  checkmarkColor: level % 10 === 0 ? '#FFD700' : '#4CAF50', // Gold for milestone levels
  animationDuration: level === 1 ? 400 : 300, // Longer animation for first level
});