import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageUtils } from '../types';

// Storage keys enum for better type safety
enum STORAGE_KEYS {
  CURRENT_LEVEL = 'total_current_level',
  COMPLETED_LEVELS = 'total_completed_levels',
}

class StorageService implements StorageUtils {
  /**
   * Get the current level the user is on
   * @returns Promise<number> - Current level (defaults to 1)
   */
  async getCurrentLevel(): Promise<number> {
    try {
      const level = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_LEVEL);
      return level ? parseInt(level, 10) : 1;
    } catch (error) {
      console.error('Failed to get current level:', error);
      return 1;
    }
  }

  /**
   * Set the current level
   * @param level - Level number to save
   * @returns Promise<void>
   */
  async setCurrentLevel(level: number): Promise<void> {
    try {
      if (level < 1) {
        throw new Error('Level must be at least 1');
      }
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_LEVEL, level.toString());
    } catch (error) {
      console.error('Failed to save current level:', error);
      throw error;
    }
  }

  /**
   * Get all completed levels
   * @returns Promise<number[]> - Array of completed level numbers
   */
  async getCompletedLevels(): Promise<number[]> {
    try {
      const levels = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_LEVELS);
      return levels ? JSON.parse(levels) : [];
    } catch (error) {
      console.error('Failed to get completed levels:', error);
      return [];
    }
  }

  /**
   * Add a completed level (if not already completed)
   * @param level - Level number to mark as completed
   * @returns Promise<void>
   */
  async addCompletedLevel(level: number): Promise<void> {
    try {
      if (level < 1) {
        throw new Error('Level must be at least 1');
      }

      const completed = await this.getCompletedLevels();
      
      if (!completed.includes(level)) {
        completed.push(level);
        completed.sort((a, b) => a - b); // Keep sorted
        await AsyncStorage.setItem(
          STORAGE_KEYS.COMPLETED_LEVELS, 
          JSON.stringify(completed)
        );
      }
    } catch (error) {
      console.error('Failed to save completed level:', error);
      throw error;
    }
  }

  /**
   * Clear all saved progress (for testing or reset functionality)
   * @returns Promise<void>
   */
  async clearAllProgress(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.CURRENT_LEVEL,
        STORAGE_KEYS.COMPLETED_LEVELS,
      ]);
    } catch (error) {
      console.error('Failed to clear progress:', error);
      throw error;
    }
  }

  /**
   * Get highest completed level
   * @returns Promise<number> - Highest completed level (0 if none completed)
   */
  async getHighestCompletedLevel(): Promise<number> {
    try {
      const completed = await this.getCompletedLevels();
      return completed.length > 0 ? Math.max(...completed) : 0;
    } catch (error) {
      console.error('Failed to get highest completed level:', error);
      return 0;
    }
  }

  /**
   * Check if a specific level is completed
   * @param level - Level number to check
   * @returns Promise<boolean> - True if level is completed
   */
  async isLevelCompleted(level: number): Promise<boolean> {
    try {
      const completed = await this.getCompletedLevels();
      return completed.includes(level);
    } catch (error) {
      console.error('Failed to check level completion:', error);
      return false;
    }
  }

  /**
   * Get game statistics
   * @returns Promise<GameStats> - Game progress statistics
   */
  async getGameStats(): Promise<{
    currentLevel: number;
    totalCompleted: number;
    highestLevel: number;
    completionPercentage: number;
  }> {
    try {
      const [currentLevel, completedLevels] = await Promise.all([
        this.getCurrentLevel(),
        this.getCompletedLevels(),
      ]);

      const highestLevel = Math.max(currentLevel, ...completedLevels);
      const completionPercentage = highestLevel > 0 
        ? (completedLevels.length / highestLevel) * 100 
        : 0;

      return {
        currentLevel,
        totalCompleted: completedLevels.length,
        highestLevel,
        completionPercentage: Math.round(completionPercentage),
      };
    } catch (error) {
      console.error('Failed to get game stats:', error);
      return {
        currentLevel: 1,
        totalCompleted: 0,
        highestLevel: 1,
        completionPercentage: 0,
      };
    }
  }
}

// Export singleton instance
export const storageUtils = new StorageService();

// Export the class for testing purposes
export { StorageService };

// Export storage keys for testing
    export { STORAGE_KEYS };
