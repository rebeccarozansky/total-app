import React from 'react';
import {
    Dimensions,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { HomeScreenProps } from '../app/types';

const { width, height } = Dimensions.get('window');

interface HomeScreenStyles {
  container: ViewStyle;
  content: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  buttonsContainer: ViewStyle;
  playButton: ViewStyle;
  menuButton: ViewStyle;
  helpButton: ViewStyle;
  buttonText: TextStyle;
  playButtonText: TextStyle;
  playButtonSubtext: TextStyle;
  menuButtonText: TextStyle;
  helpButtonText: TextStyle;
  footer: ViewStyle;
  footerText: TextStyle;
}

/**
 * HelpIcon Component
 * 
 * Renders a question mark icon for the help button
 */
const HelpIcon: React.FC = () => (
  <Text style={styles.helpButtonText}>?</Text>
);

/**
 * HomeScreen Component
 * 
 * Main menu screen with navigation to game, levels, and help.
 * Features clean branding and current level display.
 */
const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  currentLevel,
}) => {
  /**
   * Handle play button press - navigate to current level
   */
  const handlePlay = (): void => {
    onNavigate('game', currentLevel);
  };

  /**
   * Handle levels button press - navigate to level selection
   */
  const handleLevels = (): void => {
    onNavigate('levels');
  };

  /**
   * Handle help button press - navigate to how to play
   */
  const handleHelp = (): void => {
    onNavigate('howToPlay');
  };

  /**
   * Get play button subtitle text
   */
  const getPlayButtonSubtext = (): string => {
    if (currentLevel === 1) {
      return 'Start your journey';
    } else if (currentLevel <= 5) {
      return `Continue Level ${currentLevel}`;
    } else if (currentLevel <= 10) {
      return `Level ${currentLevel} awaits`;
    } else {
      return `Challenge Level ${currentLevel}`;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text 
            style={styles.title}
            accessibilityRole="header"
            testID="app-title"
          >
            TOTAL
          </Text>
          <Text 
            style={styles.subtitle}
            accessibilityLabel="Math Puzzle Game"
          >
            Math Puzzle Game {/* Change this to smth else */} Level {currentLevel}
          </Text>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonsContainer}>
          {/* Play Button */}
          <TouchableOpacity
            style={styles.playButton}
            onPress={handlePlay}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Play game, ${getPlayButtonSubtext()}`}
            accessibilityHint="Tap to start or continue playing the math puzzle game"
            testID="play-button"
          >
            <Text style={styles.playButtonText}>PLAY</Text>
            <Text style={styles.playButtonSubtext}>
              {getPlayButtonSubtext()}
            </Text>
          </TouchableOpacity>

          {/* Levels Button */}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleLevels}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Select level"
            accessibilityHint="Tap to choose a specific level to play"
            testID="levels-button"
          >
            <Text style={styles.menuButtonText}>LEVELS</Text>
          </TouchableOpacity>

          {/* Help Button */}
          <TouchableOpacity
            style={styles.helpButton}
            onPress={handleHelp}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="How to play"
            accessibilityHint="Tap to learn how to play the game"
            testID="help-button"
          >
            <HelpIcon />
          </TouchableOpacity>
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ by @beccabakespi
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

/**
 * Styles for HomeScreen component
 */
const styles = StyleSheet.create<HomeScreenStyles>({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: Math.min(width * 0.12, 48),
    fontWeight: '300',
    letterSpacing: 8,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '300',
    textAlign: 'center',
    letterSpacing: 1,
  },
  buttonsContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    maxWidth: 300,
    alignSelf: 'center',
    width: '100%',
  },
  playButton: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for iOS
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 4,
  },
  menuButton: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#cccccc',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for iOS
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 2,
  },
  helpButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#cccccc',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    // Shadow for iOS
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 2,
    textAlign: 'center',
  },
  playButtonText: {
    fontSize: 20,
    fontWeight: '400',
    letterSpacing: 3,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  playButtonSubtext: {
    fontSize: 14,
    color: '#cccccc',
    fontWeight: '300',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  menuButtonText: {
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 2,
    color: '#000000',
    textAlign: 'center',
  },
  helpButtonText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#000000',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '300',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default HomeScreen;

// Export additional utilities for testing
export { HelpIcon, styles as HomeScreenStyles };

/**
 * Configuration for home screen buttons
 */
export interface HomeButtonConfig {
  key: string;
  label: string;
  onPress: () => void;
  style: 'primary' | 'secondary' | 'help';
  testID: string;
  accessibilityLabel: string;
  accessibilityHint: string;
}

/**
 * Helper function to create button configurations
 */
export const createHomeButtonConfigs = (
  props: HomeScreenProps
): HomeButtonConfig[] => [
  {
    key: 'play',
    label: 'PLAY',
    onPress: () => props.onNavigate('game', props.currentLevel),
    style: 'primary',
    testID: 'play-button',
    accessibilityLabel: `Play game, Level ${props.currentLevel}`,
    accessibilityHint: 'Tap to start or continue playing',
  },
  {
    key: 'levels',
    label: 'LEVELS',
    onPress: () => props.onNavigate('levels'),
    style: 'secondary',
    testID: 'levels-button',
    accessibilityLabel: 'Select level',
    accessibilityHint: 'Tap to choose a specific level',
  },
  {
    key: 'help',
    label: '?',
    onPress: () => props.onNavigate('howToPlay'),
    style: 'help',
    testID: 'help-button',
    accessibilityLabel: 'How to play',
    accessibilityHint: 'Tap to learn how to play',
  },
];

/**
 * Helper function to get dynamic play button text
 */
export const getPlayButtonText = (currentLevel: number): {
  title: string;
  subtitle: string;
} => {
  if (currentLevel === 1) {
    return {
      title: 'PLAY',
      subtitle: 'Start your journey',
    };
  } else if (currentLevel <= 5) {
    return {
      title: 'PLAY',
      subtitle: `Continue Level ${currentLevel}`,
    };
  } else if (currentLevel <= 10) {
    return {
      title: 'PLAY',
      subtitle: `Level ${currentLevel} awaits`,
    };
  } else {
    return {
      title: 'PLAY',
      subtitle: `Challenge Level ${currentLevel}`,
    };
  }
};