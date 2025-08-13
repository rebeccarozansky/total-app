import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle
} from 'react-native';

// Import components
import Header from '../components/Header';

// Import types
import { ExampleNumber, HowToPlayScreenProps } from '../app/types';

const { width } = Dimensions.get('window');

interface HowToPlayScreenStyles {
  container: ViewStyle;
  content: ViewStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  sectionText: TextStyle;
  exampleContainer: ViewStyle;
  exampleHeader: ViewStyle;
  exampleTargetText: TextStyle;
  exampleGrid: ViewStyle;
  exampleNumber: ViewStyle;
  exampleNumberSelected: ViewStyle;
  exampleNumberResult: ViewStyle;
  exampleNumberText: TextStyle;
  exampleSelectedText: TextStyle;
  exampleResultText: TextStyle;
  operationContainer: ViewStyle;
  operationButton: ViewStyle;
  operationButtonSelected: ViewStyle;
  operationText: TextStyle;
  operationSelectedText: TextStyle;
  stepIndicator: ViewStyle;
  stepText: TextStyle;
  rulesList: ViewStyle;
  ruleItem: ViewStyle;
  ruleBullet: TextStyle;
  ruleText: TextStyle;
}

/**
 * AnimatedExampleNumber Component
 * 
 * Individual number button for the animated example
 */
interface AnimatedExampleNumberProps {
  number: ExampleNumber;
  index: number;
  animationStep: number;
}

const AnimatedExampleNumber: React.FC<AnimatedExampleNumberProps> = ({
  number,
  index,
  animationStep,
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate number disappearing when it becomes the result
    if (animationStep >= 4 && index === 1) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(1);
      scaleAnim.setValue(1);
    }
  }, [animationStep, index, fadeAnim, scaleAnim]);

  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle = [styles.exampleNumber];
    
    if (animationStep >= 4 && index === 0) {
      baseStyle.push(styles.exampleNumberResult);
    } else if (number.selected) {
      baseStyle.push(styles.exampleNumberSelected);
    }
    
    return baseStyle;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseStyle = [styles.exampleNumberText];
    
    if (animationStep >= 4 && index === 0) {
      baseStyle.push(styles.exampleResultText);
    } else if (number.selected) {
      baseStyle.push(styles.exampleSelectedText);
    }
    
    return baseStyle;
  };

  const getDisplayValue = (): string => {
    if (animationStep >= 4 && index === 0) {
      return '3'; // Result
    } else if (animationStep >= 4 && index === 1) {
      return ''; // Disappeared
    }
    return number.value.toString();
  };

  return (
    <Animated.View
      style={[
        getButtonStyle(),
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Text style={getTextStyle()}>
        {getDisplayValue()}
      </Text>
    </Animated.View>
  );
};

/**
 * GameplayAnimation Component
 * 
 * Animated demonstration of the game mechanics
 */
const GameplayAnimation: React.FC = () => {
  const [animationStep, setAnimationStep] = useState<number>(0);
  const stepTextAnim = useRef(new Animated.Value(1)).current;

  // Animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => {
        const nextStep = (prev + 1) % 5; // 0-4 cycle
        
        // Animate step indicator
        Animated.sequence([
          Animated.timing(stepTextAnim, {
            toValue: 0.7,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(stepTextAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
        
        return nextStep;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [stepTextAnim]);

  const exampleNumbers: ExampleNumber[] = [
    { 
      value: 6, 
      selected: animationStep >= 1, 
      position: 0 
    },
    { 
      value: 2, 
      selected: animationStep >= 3, 
      position: 1 
    },
    { 
      value: 4, 
      selected: false, 
      position: 2 
    },
  ];

  const exampleOperation = animationStep >= 2 ? '÷' : null;

  const getStepText = (): string => {
    switch (animationStep) {
      case 0:
        return 'Start with these numbers';
      case 1:
        return '1. Tap the first number (6)';
      case 2:
        return '2. Tap an operation (÷)';
      case 3:
        return '3. Tap the second number (2)';
      case 4:
        return '4. Result appears (3), second number disappears';
      default:
        return 'Start with these numbers';
    }
  };

  return (
    <View style={styles.exampleContainer}>
      <View style={styles.exampleHeader}>
        <Text style={styles.exampleTargetText}>Target: 3</Text>
      </View>

      {/* Numbers Grid */}
      <View style={styles.exampleGrid}>
        {exampleNumbers.map((number, index) => (
          <AnimatedExampleNumber
            key={index}
            number={number}
            index={index}
            animationStep={animationStep}
          />
        ))}
      </View>

      {/* Operation Display */}
      {exampleOperation && (
        <View style={styles.operationContainer}>
          <View style={[
            styles.operationButton,
            animationStep >= 2 && styles.operationButtonSelected
          ]}>
            <Text style={[
              styles.operationText,
              animationStep >= 2 && styles.operationSelectedText
            ]}>
              {exampleOperation}
            </Text>
          </View>
        </View>
      )}

      {/* Step Indicator */}
      <Animated.View 
        style={[
          styles.stepIndicator,
          { opacity: stepTextAnim }
        ]}
      >
        <Text style={styles.stepText}>
          {getStepText()}
        </Text>
      </Animated.View>
    </View>
  );
};

/**
 * HowToPlayScreen Component
 * 
 * Tutorial screen explaining game mechanics with animated examples
 */
const HowToPlayScreen: React.FC<HowToPlayScreenProps> = ({ onNavigate }) => {
  /**
   * Handle back button press
   */
  const handleBackPress = (): void => {
    onNavigate('home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <Header 
        title="How to Play"
        onBackPress={handleBackPress}
        backAccessibilityLabel="Go back to home"
        backAccessibilityHint="Tap to return to the main menu"
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Goal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goal</Text>
          <Text style={styles.sectionText}>
            Combine all numbers using mathematical operations (+, −, ×, ÷) to reach the target number.
          </Text>
        </View>

        {/* How to Play Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Play</Text>
          <Text style={styles.sectionText}>
            Follow these simple steps to make calculations:
          </Text>
          
          <View style={styles.rulesList}>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleBullet}>1.</Text>
              <Text style={styles.ruleText}>Tap a number to select it</Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleBullet}>2.</Text>
              <Text style={styles.ruleText}>Tap an operation (+, −, ×, ÷)</Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleBullet}>3.</Text>
              <Text style={styles.ruleText}>Tap another number</Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleBullet}>4.</Text>
              <Text style={styles.ruleText}>The result replaces the first number</Text>
            </View>
          </View>
        </View>

        {/* Animated Example */}
        <View style={styles.section}>
          
          <GameplayAnimation />
        </View>

        {/* Rules Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Rules</Text>
          
          <View style={styles.rulesList}>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleBullet}>•</Text>
              <Text style={styles.ruleText}>
                <Text style={{ fontWeight: '400' }}>Division</Text> must result in whole numbers only
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleBullet}>•</Text>
              <Text style={styles.ruleText}>
                <Text style={{ fontWeight: '400' }}>Subtraction</Text> always gives positive results
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleBullet}>•</Text>
              <Text style={styles.ruleText}>
                Use <Text style={{ fontWeight: '400' }}>Undo</Text> to reverse your last move
              </Text>
            </View>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips</Text>
          
          <View style={styles.rulesList}>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleBullet}>💡</Text>
              <Text style={styles.ruleText}>
                You can change your number or operation selection before completing a calculation
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleBullet}>💡</Text>
              <Text style={styles.ruleText}>
                Try different combinations - there are often multiple solutions
              </Text>
            </View>
            <View style={styles.ruleItem}>
              <Text style={styles.ruleBullet}>💡</Text>
              <Text style={styles.ruleText}>
                Use the Clear button to start over if you get stuck
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Styles for HowToPlayScreen component
 */
const styles = StyleSheet.create<HowToPlayScreenStyles>({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  sectionText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    fontWeight: '300',
    marginBottom: 8,
  },
  exampleContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginTop: 16,
  },
  exampleHeader: {
    marginBottom: 16,
  },
  exampleTargetText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '400',
    textAlign: 'center',
  },
  exampleGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  exampleNumber: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#cccccc',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exampleNumberSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  exampleNumberResult: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  exampleNumberText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '300',
    textAlign: 'center',
  },
  exampleSelectedText: {
    color: '#ffffff',
  },
  exampleResultText: {
    color: '#ffffff',
    fontWeight: '400',
  },
  operationContainer: {
    marginBottom: 16,
  },
  operationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#cccccc',
    backgroundColor: '#ffffff',
  },
  operationButtonSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  operationText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '300',
    textAlign: 'center',
  },
  operationSelectedText: {
    color: '#ffffff',
  },
  stepIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  stepText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '300',
  },
  rulesList: {
    marginTop: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ruleBullet: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '400',
    marginRight: 12,
    minWidth: 20,
  },
  ruleText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    fontWeight: '300',
    flex: 1,
  },
});

export default HowToPlayScreen;

// Export additional utilities for testing
export { AnimatedExampleNumber, GameplayAnimation, styles as HowToPlayScreenStyles };

