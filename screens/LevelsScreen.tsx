import React from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

// Import components
import Header from '../components/Header';

// Import types
import { LevelsScreenProps } from '../app/types';

const { width } = Dimensions.get('window');

interface LevelsScreenStyles {
  container: ViewStyle;
  content: ViewStyle;
  statsContainer: ViewStyle;
  statsText: TextStyle;
  levelsGrid: ViewStyle;
  levelButton: ViewStyle;
  completedLevel: ViewStyle;
  currentLevel: ViewStyle;
  lockedLevel: ViewStyle;
  levelButtonText: TextStyle;
  completedLevelText: TextStyle;
  currentLevelText: TextStyle;
  lockedLevelText: TextStyle;
  checkmark: TextStyle;
  emptyState: ViewStyle;
  emptyStateText: TextStyle;
}

/**
 * LevelButton Component
 * 
 * Individual level button with proper state visualization
 */
interface LevelButtonProps {
  level: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isUnlocked: boolean;
  onPress: (level: number) => void;
}

const LevelButton: React.FC<LevelButtonProps> = ({
  level,
  isCompleted,
  isCurrent,
  isUnlocked,
  onPress,
}) => {
  /**
   * Handle level button press
   */
  const handlePress = (): void => {
    if (isUnlocked) {
      onPress(level);
    }
  };

  /**
   * Get button style based on state
   */
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle = [styles.levelButton];

    if (!isUnlocked) {
      baseStyle.push(styles.lockedLevel);
    } else if (isCurrent) {
      baseStyle.push(styles.currentLevel);
    } else if (isCompleted) {
      baseStyle.push(styles.completedLevel);
    }

    return baseStyle;
  };

  /**
   * Get text style based on state
   */
  const getTextStyle = (): TextStyle[] => {
    const baseStyle = [styles.levelButtonText];

    if (!isUnlocked) {
      baseStyle.push(styles.lockedLevelText);
    } else if (isCurrent) {
      baseStyle.push(styles.currentLevelText);
    } else if (isCompleted) {
      baseStyle.push(styles.completedLevelText);
    }

    return baseStyle;
  };

  /**
   * Get accessibility label
   */
  const getAccessibilityLabel = (): string => {
    if (!isUnlocked) {
      return `Level ${level}, locked`;
    } else if (isCurrent) {
      return `Level ${level}, current level`;
    } else if (isCompleted) {
      return `Level ${level}, completed`;
    } else {
      return `Level ${level}, available`;
    }
  };

  /**
   * Get accessibility hint
   */
  const getAccessibilityHint = (): string => {
    if (!isUnlocked) {
      return 'Complete previous levels to unlock';
    } else if (isCurrent) {
      return 'Tap to continue your current level';
    } else if (isCompleted) {
      return 'Tap to replay this completed level';
    } else {
      return 'Tap to play this level';
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={!isUnlocked}
      style={getButtonStyle()}
      activeOpacity={isUnlocked ? 0.8 : 1}
      accessibilityRole="button"
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityHint={getAccessibilityHint()}
      accessibilityState={{
        disabled: !isUnlocked,
        selected: isCurrent,
      }}
      testID={`level-button-${level}`}
    >
      <Text style={getTextStyle()}>
        {level}
      </Text>
      {isCompleted && (
        <Text 
          style={styles.checkmark}
          accessibilityLabel="Completed"
        >
          ✓
        </Text>
      )}
    </TouchableOpacity>
  );
};

/**
 * LevelsScreen Component
 * 
 * Displays a grid of all available levels with proper state indicators.
 * Shows completed, current, and locked levels with visual feedback.
 */
const LevelsScreen: React.FC<LevelsScreenProps> = ({
  onNavigate,
  currentLevel,
  completedLevels,
}) => {
  /**
   * Calculate the maximum level to display
   * Show at least 20 levels or current level + 5, whichever is higher
   */
  const getMaxLevel = (): number => {
    return Math.max(20, currentLevel + 5);
  };

  /**
   * Generate array of level numbers
   */
  const getLevels = (): number[] => {
    const maxLevel = getMaxLevel();
    return Array.from({ length: maxLevel }, (_, i) => i + 1);
  };

  /**
   * Check if a level is unlocked
   */
  const isLevelUnlocked = (level: number): boolean => {
    return level <= currentLevel;
  };

  /**
   * Check if a level is completed
   */
  const isLevelCompleted = (level: number): boolean => {
    return completedLevels.includes(level);
  };

  /**
   * Check if a level is the current level
   */
  const isCurrentLevel = (level: number): boolean => {
    return level === currentLevel;
  };

  /**
   * Handle level selection
   */
  const handleLevelPress = (level: number): void => {
    onNavigate('game', level);
  };

  /**
   * Handle back button press
   */
  const handleBackPress = (): void => {
    onNavigate('home');
  };

  /**
   * Calculate grid layout
   */
  const getGridLayout = (): { itemWidth: number, itemsPerRow: number } => {
    const padding = 40; // 20px on each side
    const gap = 12;
    const itemsPerRow = 4;
    const itemWidth = (width - padding - (gap * (itemsPerRow - 1))) / itemsPerRow;
    
    return { itemWidth, itemsPerRow };
  };

  /**
   * Get progress statistics
   */
  const getProgressStats = (): { completed: number, total: number, percentage: number } => {
    const totalUnlocked = currentLevel;
    const completed = completedLevels.filter(level => level <= totalUnlocked).length;
    const percentage = totalUnlocked > 0 ? Math.round((completed / totalUnlocked) * 100) : 0;
    
    return { completed, total: totalUnlocked, percentage };
  };

  const levels = getLevels();
  const { itemWidth } = getGridLayout();
  const { completed, total, percentage } = getProgressStats();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <Header 
        title="Choose Level"
        onBackPress={handleBackPress}
        backAccessibilityLabel="Go back to home"
        backAccessibilityHint="Tap to return to the main menu"
      />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Stats */}
        <View style={styles.statsContainer}>
          <Text 
            style={styles.statsText}
            accessibilityLabel={`Progress: ${completed} out of ${total} levels completed, ${percentage} percent`}
          >
            {completed}/{total} levels completed ({percentage}%)
          </Text>
        </View>

        {/* Levels Grid */}
        <View style={styles.levelsGrid}>
          {levels.map(level => (
            <View
              key={level}
              style={{
                width: itemWidth,
                aspectRatio: 1,
                marginBottom: 12,
              }}
            >
              <LevelButton
                level={level}
                isCompleted={isLevelCompleted(level)}
                isCurrent={isCurrentLevel(level)}
                isUnlocked={isLevelUnlocked(level)}
                onPress={handleLevelPress}
              />
            </View>
          ))}
        </View>

        {/* Empty State (if no levels) */}
        {levels.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No levels available
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Styles for LevelsScreen component
 */
const styles = StyleSheet.create<LevelsScreenStyles>({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '300',
    textAlign: 'center',
  },
  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  levelButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#cccccc',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
  completedLevel: {
    backgroundColor: '#f0f8ff',
    borderColor: '#4CAF50',
  },
  currentLevel: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  lockedLevel: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
    opacity: 0.6,
  },
  levelButtonText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#000000',
    textAlign: 'center',
  },
  completedLevelText: {
    color: '#4CAF50',
    fontWeight: '400',
  },
  currentLevelText: {
    color: '#ffffff',
    fontWeight: '400',
  },
  lockedLevelText: {
    color: '#cccccc',
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 6,
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '300',
    textAlign: 'center',
  },
});

export default LevelsScreen;

// Export additional utilities for testing
export { LevelButton, styles as LevelsScreenStyles };

/**
 * Helper function to calculate level statistics
 */
export const calculateLevelStats = (
  currentLevel: number,
  completedLevels: number[]
): {
  completed: number;
  total: number;
  percentage: number;
  unlockedLevels: number[];
} => {
  const unlockedLevels = Array.from({ length: currentLevel }, (_, i) => i + 1);
  const completed = completedLevels.filter(level => level <= currentLevel).length;
  const percentage = currentLevel > 0 ? Math.round((completed / currentLevel) * 100) : 0;

  return {
    completed,
    total: currentLevel,
    percentage,
    unlockedLevels,
  };
};

/**
 * Helper function to generate level grid data
 */
export const generateLevelGridData = (
  maxLevel: number,
  currentLevel: number,
  completedLevels: number[]
): Array<{
  level: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isUnlocked: boolean;
}> => {
  return Array.from({ length: maxLevel }, (_, i) => {
    const level = i + 1;
    return {
      level,
      isCompleted: completedLevels.includes(level),
      isCurrent: level === currentLevel,
      isUnlocked: level <= currentLevel,
    };
  });
};