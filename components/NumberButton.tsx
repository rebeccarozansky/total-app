import React from 'react';
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle
} from 'react-native';
import { NumberButtonProps } from '../app/types';

interface NumberButtonStyles {
  button: ViewStyle;
  selectedButton1: ViewStyle;
  selectedButton2: ViewStyle;
  invalidButton: ViewStyle;
  winningButton: ViewStyle;
  disabledButton: ViewStyle;
  text: TextStyle;
  selectedText: TextStyle;
  disabledText: TextStyle;
}

/**
 * NumberButton Component
 * 
 * Renders a circular button displaying a number value with various visual states
 * for selection, validation, and game completion feedback.
 */
const NumberButton: React.FC<NumberButtonProps> = ({
  numberObj,
  onPress,
  state,
  isInvalidSelection,
  isWinning,
}) => {
  /**
   * Handle button press with validation
   */
  const handlePress = (): void => {
    onPress(numberObj);
  };

  /**
   * Get button style based on current state
   */
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle = [styles.button];

    if (isInvalidSelection) {
      baseStyle.push(styles.invalidButton);
    } else if (isWinning) {
      baseStyle.push(styles.winningButton);
    } else if (state === 'selected1') {
      baseStyle.push(styles.selectedButton1);
    } else if (state === 'selected2') {
      baseStyle.push(styles.selectedButton2);
    }

    return baseStyle;
  };

  /**
   * Get text style based on current state
   */
  const getTextStyle = (): TextStyle[] => {
    const baseStyle = [styles.text];

    if (isInvalidSelection || isWinning || state === 'selected1' || state === 'selected2') {
      baseStyle.push(styles.selectedText);
    }

    return baseStyle;
  };

  /**
   * Determine if button should be disabled
   */
  const isDisabled = (): boolean => {
    // Button is never truly disabled, but this could be extended
    // for future features like hints or tutorial mode
    return false;
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled()}
      style={getButtonStyle()}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Number ${numberObj.value}`}
      accessibilityHint={
        state === 'selected1'
          ? 'First number selected'
          : state === 'selected2'
          ? 'Second number selected'
          : isWinning
          ? 'Winning number'
          : 'Available number'
      }
      testID={`number-button-${numberObj.id}`}
    >
      <Text style={getTextStyle()}>
        {numberObj.value}
      </Text>
    </TouchableOpacity>
  );
};

/**
 * Styles for NumberButton component
 */
const styles = StyleSheet.create<NumberButtonStyles>({
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#cccccc',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    // Shadow for iOS
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 2,
  },
  selectedButton1: {
    backgroundColor: '#000000',
    borderColor: '#000000',
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.2,
    elevation: 4,
  },
  selectedButton2: {
    backgroundColor: '#666666',
    borderColor: '#666666',
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.2,
    elevation: 4,
  },
  invalidButton: {
    backgroundColor: '#ff4444',
    borderColor: '#ff4444',
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.3,
    elevation: 6,
  },
  winningButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
    transform: [{ scale: 1.05 }],
    shadowOpacity: 0.3,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
    opacity: 0.6,
  },
  text: {
    fontSize: 18,
    fontWeight: '300',
    color: '#000000',
    textAlign: 'center',
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: '400',
  },
  disabledText: {
    color: '#cccccc',
  },
});

export default NumberButton;

// Export additional utilities for testing
export { styles as NumberButtonStyles };
