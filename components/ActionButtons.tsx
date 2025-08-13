import React from 'react';
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { ActionButtonsProps } from '../app/types';

interface ActionButtonStyles {
  container: ViewStyle;
  actionButton: ViewStyle;
  circularButton: ViewStyle;
  disabledButton: ViewStyle;
  text: TextStyle;
  disabledText: TextStyle;
  undoIconContainer: ViewStyle;
  undoIconText: TextStyle;
  undoIconDisabled: TextStyle;
}

/**
 * UndoIcon Component
 * 
 * Renders a circular arrow icon for the undo button
 */
const UndoIcon: React.FC<{ disabled?: boolean }> = ({ disabled = false }) => (
  <View style={styles.undoIconContainer}>
    <Text style={[styles.undoIconText, disabled && styles.undoIconDisabled]}>
      ↶
    </Text>
  </View>
);

/**
 * ActionButtons Component
 * 
 * Renders the three action buttons: Undo (circular), Clear, and Reset
 * with proper disabled states and accessibility support.
 */
const ActionButtons: React.FC<ActionButtonsProps> = ({
  onUndo,
  onClear,
  onReset,
  canUndo,
  canClear,
}) => {
  /**
   * Handle undo button press
   */
  const handleUndo = (): void => {
    if (canUndo) {
      onUndo();
    }
  };

  /**
   * Handle clear button press
   */
  const handleClear = (): void => {
    if (canClear) {
      onClear();
    }
  };

  /**
   * Handle reset button press
   */
  const handleReset = (): void => {
    onReset();
  };

  /**
   * Get button style for undo button
   */
  const getUndoButtonStyle = (): ViewStyle[] => {
    const baseStyle = [styles.actionButton, styles.circularButton];
    
    if (!canUndo) {
      baseStyle.push(styles.disabledButton);
    }
    
    return baseStyle;
  };

  /**
   * Get button style for clear button
   */
  const getClearButtonStyle = (): ViewStyle[] => {
    const baseStyle = [styles.actionButton];
    
    if (!canClear) {
      baseStyle.push(styles.disabledButton);
    }
    
    return baseStyle;
  };

  /**
   * Get text style for action buttons
   */
  const getTextStyle = (isDisabled: boolean): TextStyle[] => {
    const baseStyle = [styles.text];
    
    if (isDisabled) {
      baseStyle.push(styles.disabledText);
    }
    
    return baseStyle;
  };

  return (
    <View style={styles.container}>
      {/* Undo Button */}
      <TouchableOpacity
        onPress={handleUndo}
        disabled={!canUndo}
        style={getUndoButtonStyle()}
        activeOpacity={canUndo ? 0.8 : 1}
        accessibilityRole="button"
        accessibilityLabel="Undo last move"
        accessibilityHint={
          canUndo 
            ? "Tap to undo the last calculation" 
            : "No moves to undo"
        }
        accessibilityState={{ disabled: !canUndo }}
        testID="undo-button"
      >
        <UndoIcon disabled={!canUndo} />
      </TouchableOpacity>

      {/* Clear Button */}
      <TouchableOpacity
        onPress={handleClear}
        disabled={!canClear}
        style={getClearButtonStyle()}
        activeOpacity={canClear ? 0.8 : 1}
        accessibilityRole="button"
        accessibilityLabel="Clear selection"
        accessibilityHint={
          canClear 
            ? "Tap to clear current number and operation selection" 
            : "No selection to clear"
        }
        accessibilityState={{ disabled: !canClear }}
        testID="clear-button"
      >
        <Text style={getTextStyle(!canClear)}>
          CLEAR
        </Text>
      </TouchableOpacity>

      {/* Reset Button */}
      <TouchableOpacity
        onPress={handleReset}
        style={styles.actionButton}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Reset level"
        accessibilityHint="Tap to restart the current level with new numbers"
        testID="reset-button"
      >
        <Text style={styles.text}>
          RESET
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Styles for ActionButtons component
 */
const styles = StyleSheet.create<ActionButtonStyles>({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 16,
    maxWidth: 320,
    alignSelf: 'center',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#cccccc',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    // Shadow for iOS
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 1,
  },
  circularButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 0,
    paddingVertical: 0,
    minWidth: 44,
  },
  disabledButton: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 1,
    color: '#000000',
    textAlign: 'center',
  },
  disabledText: {
    color: '#cccccc',
  },
  undoIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  undoIconText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '400',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  undoIconDisabled: {
    color: '#cccccc',
  },
});

export default ActionButtons;

// Export additional utilities for testing
export { styles as ActionButtonStyles, UndoIcon };

/**
 * Action button configuration interface
 */
export interface ActionButtonConfig {
  key: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  testID?: string;
}

/**
 * Helper function to create action button configurations
 */
export const createActionButtonConfigs = (
  actions: ActionButtonsProps
): ActionButtonConfig[] => [
  {
    key: 'undo',
    label: 'Undo',
    onPress: actions.onUndo,
    disabled: !actions.canUndo,
    icon: <UndoIcon disabled={!actions.canUndo} />,
    testID: 'undo-button',
  },
  {
    key: 'clear',
    label: 'CLEAR',
    onPress: actions.onClear,
    disabled: !actions.canClear,
    testID: 'clear-button',
  },
  {
    key: 'reset',
    label: 'RESET',
    onPress: actions.onReset,
    disabled: false,
    testID: 'reset-button',
  },
];