import React, { useEffect, useState } from 'react';
import {
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
import ActionButtons from '../components/ActionButtons';
import { GameHeader } from '../components/Header';
import LevelCompleteModal from '../components/LevelCompleteModal';
import NumberButton from '../components/NumberButton';
import OperationButton from '../components/OperationButton';

// Import utilities
import { gameLogic } from '../app/utils/gameLogic';
import { storageUtils } from '../app/utils/storage';

// Import types
import {
    GameScreenProps,
    GameState,
    NumberObject,
    Operation,
    SelectionState,
} from '../app/types';

const { width } = Dimensions.get('window');

interface GameScreenStyles {
  container: ViewStyle;
  targetContainer: ViewStyle;
  targetNumber: TextStyle;
  numbersContainer: ViewStyle;
  numbersGrid: ViewStyle;
  emptySpace: ViewStyle;
  operationsContainer: ViewStyle;
  operationsGrid: ViewStyle;
  actionButtonsContainer: ViewStyle;
}

/**
 * GameScreen Component
 * 
 * Main gameplay screen that implements the core Total math puzzle game.
 * Handles number selection, operations, calculations, and level progression.
 */
const GameScreen: React.FC<GameScreenProps> = ({
  onNavigate,
  initialLevel,
  onLevelComplete,
}) => {
  // Game state
  const [level, setLevel] = useState<number>(initialLevel || 1);
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [availableNumbers, setAvailableNumbers] = useState<NumberObject[]>([]);
  const [initialGridSize, setInitialGridSize] = useState<number>(6);
  const [originalPuzzle, setOriginalPuzzle] = useState<{ target: number; numbers: NumberObject[] } | null>(null);

  // Selection state
  const [selectedNumber1, setSelectedNumber1] = useState<NumberObject | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [selectedNumber2, setSelectedNumber2] = useState<NumberObject | null>(null);

  // Game flow state
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [showLevelComplete, setShowLevelComplete] = useState<boolean>(false);
  const [invalidOperation, setInvalidOperation] = useState<boolean>(false);

  // History for undo functionality
  const [gameHistory, setGameHistory] = useState<GameState[]>([]);

  /**
   * Initialize game when level changes
   */
  useEffect(() => {
    if (initialLevel) {
      setLevel(initialLevel);
    }
  }, [initialLevel]);

  /**
   * Generate new puzzle when level changes
   */
  useEffect(() => {
    const puzzle = gameLogic.generatePuzzle(level);
    setTargetNumber(puzzle.target);
    setAvailableNumbers(puzzle.numbers);
    setInitialGridSize(puzzle.numbers.length);
    setOriginalPuzzle({ target: puzzle.target, numbers: [...puzzle.numbers] }); // Store original state
    resetSelection();
    setGameWon(false);
    setShowLevelComplete(false);
    setGameHistory([]);
  }, [level]);

  /**
   * Check for win condition
   */
  useEffect(() => {
    if (gameLogic.isGameWon(availableNumbers, targetNumber)) {
      setGameWon(true);
      setTimeout(() => setShowLevelComplete(true), 800);
    }
  }, [availableNumbers, targetNumber]);

  /**
   * Reset all selection state
   */
  const resetSelection = (): void => {
    setSelectedNumber1(null);
    setSelectedOperation(null);
    setSelectedNumber2(null);
    setInvalidOperation(false);
  };

  /**
   * Handle number button press
   */
  const selectNumber = (numberObj: NumberObject): void => {
    if (selectedNumber1 === null) {
      // First number selection
      setSelectedNumber1(numberObj);
    } else if (selectedOperation === null) {
      // Change first number selection before operation is chosen
      setSelectedNumber1(numberObj);
    } else if (selectedNumber2 === null && numberObj.id !== selectedNumber1.id) {
      // Second number selection - perform calculation
      setSelectedNumber2(numberObj);
      performCalculation(selectedNumber1, selectedOperation, numberObj);
    }
  };

  /**
   * Handle operation button press
   */
  const selectOperation = (operation: Operation): void => {
    if (selectedNumber1 !== null) {
      // Allow changing operation selection
      setSelectedOperation(operation);
      // Clear second number if it was selected
      setSelectedNumber2(null);
    }
  };

  /**
   * Perform calculation between two numbers
   */
  const performCalculation = (
    num1Obj: NumberObject,
    operation: Operation,
    num2Obj: NumberObject
  ): void => {
    const num1 = num1Obj.value;
    const num2 = num2Obj.value;

    // Check for invalid division before performing calculation
    if (operation === '/' && !gameLogic.validateDivision(num1, num2)) {
      // Trigger red blink animation
      setInvalidOperation(true);
      setTimeout(() => {
        setInvalidOperation(false);
        resetSelection();
      }, 600);
      return;
    }

    const result = gameLogic.performCalculation(num1, operation, num2);
    if (result === null) return;

    // Save current state to history
    setGameHistory(prev => [...prev, {
      numbers: [...availableNumbers],
      gridSize: initialGridSize,
      num1: num1Obj,
      num2: num2Obj,
      operation,
      result
    }]);

    // Update available numbers - maintain positions
    const newNumbers = availableNumbers.filter(n => n.id !== num1Obj.id && n.id !== num2Obj.id);

    // Add result at the position of the first number
    if (result > 0) {
      newNumbers.push({
        value: result,
        id: `${Date.now()}_${Math.random()}`,
        position: num1Obj.position
      });
    }

    setAvailableNumbers(newNumbers);
    resetSelection();
  };

  /**
   * Undo last move
   */
  const undoLastMove = (): void => {
    if (gameHistory.length === 0) return;

    const lastState = gameHistory[gameHistory.length - 1];
    setAvailableNumbers(lastState.numbers);
    setInitialGridSize(lastState.gridSize);
    setGameHistory(prev => prev.slice(0, -1));
    resetSelection();
  };

  /**
   * Restart current level with original puzzle (not a new generation)
   */
  const restartLevel = (): void => {
    if (originalPuzzle) {
      // Restore the exact original puzzle state
      setTargetNumber(originalPuzzle.target);
      setAvailableNumbers([...originalPuzzle.numbers]); // Create new array to avoid reference issues
      setInitialGridSize(originalPuzzle.numbers.length);
    } else {
      // Fallback if original puzzle is not available
      const puzzle = gameLogic.generatePuzzle(level);
      setTargetNumber(puzzle.target);
      setAvailableNumbers(puzzle.numbers);
      setInitialGridSize(puzzle.numbers.length);
      setOriginalPuzzle({ target: puzzle.target, numbers: [...puzzle.numbers] });
    }
    
    resetSelection();
    setGameWon(false);
    setShowLevelComplete(false);
    setGameHistory([]);
  };

  /**
   * Progress to next level
   */
  const nextLevel = async (): Promise<void> => {
    try {
      await storageUtils.addCompletedLevel(level);
      const newLevel = level + 1;
      await storageUtils.setCurrentLevel(newLevel);
      setLevel(newLevel);
      onLevelComplete?.(newLevel);
    } catch (error) {
      console.error('Failed to progress to next level:', error);
      // Still progress the level locally even if storage fails
      const newLevel = level + 1;
      setLevel(newLevel);
      onLevelComplete?.(newLevel);
    }
  };

  /**
   * Get selection state for a number
   */
  const getSelectionState = (numberObj: NumberObject): SelectionState => {
    return gameLogic.getSelectionState(numberObj, selectedNumber1, selectedNumber2);
  };

  /**
   * Navigate back to home
   */
  const handleBackPress = (): void => {
    onNavigate('home');
  };

  /**
   * Create display grid with proper positioning
   */
  const createDisplayGrid = (): { grid: (NumberObject | null)[], cols: number } => {
    return gameLogic.createDisplayGrid(availableNumbers, initialGridSize);
  };

  const { grid, cols } = createDisplayGrid();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <GameHeader 
        level={level}
        onBackPress={handleBackPress}
      />

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Target Number */}
        <View style={styles.targetContainer}>
          <Text
            style={styles.targetNumber}
            accessibilityRole="header"
            accessibilityLabel={`Target number is ${targetNumber}`}
            testID="target-number"
          >
            {targetNumber}
          </Text>
        </View>

        {/* Available Numbers Grid */}
        <View style={styles.numbersContainer}>
          <View 
            style={[
              styles.numbersGrid,
              {
                // Dynamic grid columns
                width: cols * 86, // 70px + 16px margin
                flexDirection: 'row',
                flexWrap: 'wrap',
              }
            ]}
          >
            {grid.map((numberObj, index) => {
              if (!numberObj) {
                return (
                  <View 
                    key={`empty-${index}`} 
                    style={styles.emptySpace}
                    testID={`empty-space-${index}`}
                  />
                );
              }

              const state = getSelectionState(numberObj);
              const isInvalidSelection = invalidOperation && (state === 'selected1' || state === 'selected2');
              const isWinning = numberObj.value === targetNumber && gameWon;

              return (
                <NumberButton
                  key={numberObj.id}
                  numberObj={numberObj}
                  onPress={selectNumber}
                  state={state}
                  isInvalidSelection={isInvalidSelection}
                  isWinning={isWinning}
                />
              );
            })}
          </View>
        </View>

        {/* Operations */}
        <View style={styles.operationsContainer}>
          <View style={styles.operationsGrid}>
            {[
              { symbol: '+', operation: '+' as Operation },
              { symbol: '−', operation: '-' as Operation },
              { symbol: '×', operation: '*' as Operation },
              { symbol: '÷', operation: '/' as Operation }
            ].map(({ symbol, operation }) => (
              <OperationButton
                key={operation}
                symbol={symbol}
                operation={operation}
                onPress={selectOperation}
                isSelected={selectedOperation === operation}
                isDisabled={selectedNumber1 === null}
              />
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <ActionButtons
            onUndo={undoLastMove}
            onClear={resetSelection}
            onReset={restartLevel}
            canUndo={gameHistory.length > 0}
            canClear={selectedNumber1 !== null}
          />
        </View>
      </ScrollView>

      {/* Level Complete Modal */}
      <LevelCompleteModal
        visible={showLevelComplete}
        level={level}
        targetNumber={targetNumber}
        onNextLevel={nextLevel}
      />
    </SafeAreaView>
  );
};

/**
 * Styles for GameScreen component
 */
const styles = StyleSheet.create<GameScreenStyles>({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  targetContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  targetNumber: {
    fontSize: Math.min(width * 0.16, 64),
    fontWeight: '300',
    letterSpacing: 4,
    color: '#000000',
    textAlign: 'center',
  },
  numbersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  numbersGrid: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  emptySpace: {
    width: 70,
    height: 70,
    margin: 8,
  },
  operationsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  operationsGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    maxWidth: 280,
  },
  actionButtonsContainer: {
    paddingVertical: 12,
  },
});

export default GameScreen;

// Export additional utilities for testing
export { styles as GameScreenStyles };

