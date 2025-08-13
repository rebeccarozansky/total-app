import React from 'react';
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

interface HeaderStyles {
  header: ViewStyle;
  backButton: ViewStyle;
  backButtonText: TextStyle;
  headerCenter: ViewStyle;
  headerTitle: TextStyle;
  rightContent: ViewStyle;
  rightText: TextStyle;
}

export interface HeaderProps {
  /** Title to display in the center of the header */
  title: string;
  /** Function to call when back button is pressed */
  onBackPress: () => void;
  /** Text for the back button (default: "← Back") */
  backButtonText?: string;
  /** Optional right side content (e.g., level indicator) */
  rightContent?: string;
  /** Test ID for the back button */
  testID?: string;
  /** Additional styles for the header container */
  style?: ViewStyle;
  /** Custom accessibility label for back button */
  backAccessibilityLabel?: string;
  /** Custom accessibility hint for back button */
  backAccessibilityHint?: string;
}

/**
 * Header Component
 * 
 * Generic header component used across all screens with consistent styling.
 * Supports back navigation, title display, and optional right content.
 */
const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  backButtonText = "← Back",
  rightContent,
  testID = "back-button",
  style,
  backAccessibilityLabel = "Go back",
  backAccessibilityHint = "Tap to return to the previous screen",
}) => {
  return (
    <View style={[styles.header, style]}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={onBackPress}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel={backAccessibilityLabel}
        accessibilityHint={backAccessibilityHint}
        testID={testID}
      >
        <Text style={styles.backButtonText}>{backButtonText}</Text>
      </TouchableOpacity>

      {/* Center Title */}
      <View style={styles.headerCenter}>
        <Text 
          style={styles.headerTitle}
          accessibilityRole="header"
        >
          {title}
        </Text>
      </View>

      {/* Right Content */}
      <View style={styles.rightContent}>
        {rightContent && (
          <Text style={styles.rightText}>
            {rightContent}
          </Text>
        )}
      </View>
    </View>
  );
};

/**
 * Styles for Header component
 */
const styles = StyleSheet.create<HeaderStyles>({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    minHeight: 50,
    backgroundColor: '#ffffff',
  },
  backButton: {
    padding: 8,
    minWidth: 80,
  },
  backButtonText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '300',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 2,
    color: '#000000',
    textAlign: 'center',
  },
  rightContent: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  rightText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '300',
    textAlign: 'right',
  },
});

export default Header;

// Export styles for testing
export { styles as HeaderStyles };

/**
 * Helper function to create header props for common use cases
 */
export const createHeaderProps = {
  /**
   * Create header props for game screen
   */
  game: (level: number, onBackPress: () => void): HeaderProps => ({
    title: 'TOTAL',
    onBackPress,
    backButtonText: '← Home',
    rightContent: `Level ${level}`,
    backAccessibilityLabel: 'Go back to home',
    backAccessibilityHint: 'Tap to return to the main menu',
    testID: 'back-button',
    style: {
      // Game screen has special title styling
    },
  }),

  /**
   * Create header props for levels screen
   */
  levels: (onBackPress: () => void): HeaderProps => ({
    title: 'Choose Level',
    onBackPress,
    backAccessibilityLabel: 'Go back to home',
    backAccessibilityHint: 'Tap to return to the main menu',
    testID: 'back-button',
  }),

  /**
   * Create header props for how to play screen
   */
  howToPlay: (onBackPress: () => void): HeaderProps => ({
    title: 'How to Play',
    onBackPress,
    backAccessibilityLabel: 'Go back to home',
    backAccessibilityHint: 'Tap to return to the main menu',
    testID: 'back-button',
  }),
};

/**
 * Special header variant for game screen with custom title styling
 */
export const GameHeader: React.FC<Omit<HeaderProps, 'title'> & { level: number }> = ({
  level,
  onBackPress,
  ...props
}) => {
  const gameHeaderStyles = StyleSheet.create({
    gameTitle: {
      fontSize: 20,
      fontWeight: '300',
      letterSpacing: 4,
      color: '#000000',
      textAlign: 'center',
    },
  });

  return (
    <View style={[styles.header, props.style]}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={onBackPress}
        style={styles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Go back to home"
        accessibilityHint="Tap to return to the main menu"
        testID="back-button"
      >
        <Text style={styles.backButtonText}>← Home</Text>
      </TouchableOpacity>

      {/* Center Title - Special game styling */}
      <View style={styles.headerCenter}>
        <Text 
          style={gameHeaderStyles.gameTitle}
          accessibilityRole="header"
        >
          TOTAL
        </Text>
      </View>

      {/* Level Indicator */}
      <View style={styles.rightContent}>
        <Text style={styles.rightText}>
          Level {level}
        </Text>
      </View>
    </View>
  );
};
