import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

// Import screens
import GameScreen from './screens/GameScreen';
import HomeScreen from './screens/HomeScreen';
import HowToPlayScreen from './screens/HowToPlayScreen';
import LevelsScreen from './screens/LevelsScreen';

// Import utilities
import { storageUtils } from './app/utils/storage';

// Types
export type Screen = 'home' | 'game' | 'levels' | 'howToPlay';

export interface NavigationProps {
  onNavigate: (screen: Screen, level?: number) => void;
}

export interface GameNavigationProps extends NavigationProps {
  initialLevel?: number;
  onLevelComplete?: (newLevel: number) => void;
}

export interface LevelsNavigationProps extends NavigationProps {
  currentLevel: number;
  completedLevels: number[];
}

export interface HomeNavigationProps extends NavigationProps {
  currentLevel: number;
}

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [gameLevel, setGameLevel] = useState<number | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async (): Promise<void> => {
    try {
      const level = await storageUtils.getCurrentLevel();
      const completed = await storageUtils.getCompletedLevels();
      setCurrentLevel(level);
      setCompletedLevels(completed);
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  };

  const navigate = (screen: Screen, level?: number): void => {
    setCurrentScreen(screen);
    if (level !== undefined) {
      setGameLevel(level);
    }
  };

  const handleLevelComplete = (newLevel: number): void => {
    setCurrentLevel(newLevel);
    initializeApp(); // Refresh completed levels
  };

  const renderScreen = (): React.ReactElement => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={navigate} currentLevel={currentLevel} />;
      case 'game':
        return (
          <GameScreen
            onNavigate={navigate}
            initialLevel={gameLevel}
            onLevelComplete={handleLevelComplete}
          />
        );
      case 'levels':
        return (
          <LevelsScreen
            onNavigate={navigate}
            currentLevel={currentLevel}
            completedLevels={completedLevels}
          />
        );
      case 'howToPlay':
        return <HowToPlayScreen onNavigate={navigate} />;
      default:
        return <HomeScreen onNavigate={navigate} currentLevel={currentLevel} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {renderScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default App;