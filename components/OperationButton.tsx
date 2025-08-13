import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Operation, OperationButtonProps } from '../app/types';

interface OperationButtonStyles {
  button: ViewStyle;
  selectedButton: ViewStyle;
  disabledButton: ViewStyle;
  text: TextStyle;
  selectedText: TextStyle;
  disabledText: TextStyle;
}

/**
 * OperationButton Component
 * 
 * Renders a circular button for mathematical operations (+, −, ×, ÷)
 * with visual feedback for selection and disabled states.
 */
const OperationButton: React.FC<OperationButtonProps> = ({
  symbol,
  operation,
  onPress,
  isSelected,
  isDisabled,
}) => {
  /**
   * Handle button press
   */
  const handlePress = (): void => {
    if (!isDisabled) {
      onPress(operation);
    }
  };

  /**
   * Get button style based on current state
   */
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle = [styles.button];

    if (isDisabled) {
      baseStyle.push(styles.disabledButton);
    } else if (isSelected) {
      baseStyle.push(styles.selectedButton);
    }

    return baseStyle;
  };

  /**
   * Get text style based on current state
   */
  const getTextStyle = (): TextStyle[] => {
    const baseStyle = [styles.text];

    if (isDisabled) {
      baseStyle.push(styles.disabledText);
    } else if (isSelected) {
      baseStyle.push(styles.selectedText);
    }

    return baseStyle;
  };

  /**
   * Get accessibility label for the operation
   */
  const getAccessibilityLabel = (): string => {
    const operationNames: Record<Operation, string> = {
      '+': 'Addition',
      '-': 'Subtraction',
      '*': 'Multiplication',
      '/': 'Division',
    };

    return operationNames[operation] || 'Operation';
  };

  /**
   * Get accessibility hint based on state
   */
  const getAccessibilityHint = (): string => {
    if (isDisabled) {
      return 'Select a number first to enable operations';
    }
    if (isSelected) {
      return 'Operation selected, choose second number';
    }
    return 'Tap to select this operation';
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      style={getButtonStyle()}
      activeOpacity={isDisabled ? 1 : 0.8}
      accessibilityRole="button"
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityHint={getAccessibilityHint()}
      accessibilityState={{
        disabled: isDisabled,
        selected: isSelected,
      }}
      testID={`operation-button-${operation}`}
    >
      <Text style={getTextStyle()}>
        {symbol}
      </Text>
    </TouchableOpacity>
  );
};

/**
 * Styles for OperationButton component
 */
const styles = StyleSheet.create<OperationButtonStyles>({
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#cccccc',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    // Shadow for iOS
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    // Elevation for Android
    elevation: 1,
  },
  selectedButton: {
    backgroundColor: '#000000',
    borderColor: '#000000',
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.2,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    fontSize: 20,
    fontWeight: '300',
    color: '#000000',
    textAlign: 'center',
    // Ensure consistent vertical alignment
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: '400',
  },
  disabledText: {
    color: '#cccccc',
  },
});

export default OperationButton;

// Export additional utilities for testing and configuration
export { styles as OperationButtonStyles };

/**
 * Predefined operation configurations
 * Useful for rendering operation buttons consistently
 */
export const OPERATION_CONFIGS: Array<{
  symbol: string;
  operation: Operation;
  description: string;
}> = [
  {
    symbol: '+',
    operation: '+',
    description: 'Addition',
  },
  {
    symbol: '−',
    operation: '-',
    description: 'Subtraction',
  },
  {
    symbol: '×',
    operation: '*',
    description: 'Multiplication',
  },
  {
    symbol: '÷',
    operation: '/',
    description: 'Division',
  },
];

/**
 * Helper function to get operation symbol
 */
export const getOperationSymbol = (operation: Operation): string => {
  const config = OPERATION_CONFIGS.find(config => config.operation === operation);
  return config?.symbol || operation;
};

/**
 * Helper function to get operation description
 */
export const getOperationDescription = (operation: Operation): string => {
  const config = OPERATION_CONFIGS.find(config => config.operation === operation);
  return config?.description || 'Unknown operation';
};