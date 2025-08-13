import {
    GameLogicUtils,
    GridDimensions,
    NumberObject,
    Operation,
    Puzzle,
    SelectionState
} from '../types';

// Import static level data
import levelsData from '../data/levels.json';

// Type for the JSON level structure
interface LevelData {
  target: number;
  numbers: number[];
}

interface LevelsData {
  [key: string]: LevelData;
}

class GameLogicService implements GameLogicUtils {
  private levels: LevelsData = levelsData as LevelsData;

  /**
   * Load a specific level puzzle from JSON data
   * @param levelNum - The level number to load
   * @returns Puzzle - Object containing target number and available numbers
   */
  generatePuzzle(levelNum: number): Puzzle {
    const levelKey = levelNum.toString();
    const levelData = this.levels[levelKey];
    
    if (!levelData) {
      // Fallback for levels not in JSON - create a simple puzzle
      console.warn(`Level ${levelNum} not found in levels.json, using fallback`);
      return this.createFallbackPuzzle(levelNum);
    }
    
    // Convert numbers to NumberObject format with unique IDs and positions
    const numbers: NumberObject[] = levelData.numbers.map((value, index) => ({
      value,
      id: `level_${levelNum}_${index}_${Date.now()}`,
      position: index
    }));
    
    return {
      target: levelData.target,
      numbers
    };
  }

  /**
   * Create a fallback puzzle when level is not found in JSON
   * @param levelNum - The level number
   * @returns Puzzle - A simple fallback puzzle
   */
  private createFallbackPuzzle(levelNum: number): Puzzle {
    // Simple fallback: create basic math problems
    const baseNumbers = [2, 3, 4, 5];
    const numbers: NumberObject[] = baseNumbers.map((value, index) => ({
      value: value + (levelNum % 5), // Add slight variation based on level
      id: `fallback_${levelNum}_${index}_${Date.now()}`,
      position: index
    }));
    
    // Simple target calculation
    const target = numbers[0].value + numbers[1].value;
    
    return { target, numbers };
  }

  /**
   * Check if a level exists in the JSON data
   * @param levelNum - The level number to check
   * @returns boolean - True if level exists
   */
  levelExists(levelNum: number): boolean {
    return this.levels.hasOwnProperty(levelNum.toString());
  }

  /**
   * Get the maximum level available in JSON data
   * @returns number - Highest level number available
   */
  getMaxLevel(): number {
    const levelNumbers = Object.keys(this.levels).map(key => parseInt(key, 10));
    return Math.max(...levelNumbers);
  }

  /**
   * Calculate grid dimensions based on number count
   * @param numCount - Number of available numbers
   * @returns GridDimensions - Object with cols and rows
   */
  getGridDimensions(numCount: number): GridDimensions {
    if (numCount <= 4) {
      return { cols: 2, rows: 2 };
    }
    if (numCount <= 6) {
      return { cols: 3, rows: 2 };
    }
    return { cols: 3, rows: 3 };
  }

  /**
   * Validate if division will result in an integer
   * @param num1 - First number
   * @param num2 - Second number
   * @returns boolean - True if division results in integer
   */
  validateDivision(num1: number, num2: number): boolean {
    if (num2 === 0) {
      return false;
    }
    
    const larger = Math.max(num1, num2);
    const smaller = Math.min(num1, num2);
    
    return larger % smaller === 0;
  }

  /**
   * Perform mathematical calculation between two numbers
   * @param num1 - First number
   * @param operation - Mathematical operation
   * @param num2 - Second number
   * @returns number | null - Result of calculation or null if invalid
   */
  performCalculation(num1: number, operation: Operation, num2: number): number | null {
    try {
      switch (operation) {
        case '+':
          return num1 + num2;
        
        case '-':
          // Always return positive result
          return Math.abs(num1 - num2);
        
        case '*':
          return num1 * num2;
        
        case '/':
          if (!this.validateDivision(num1, num2)) {
            return null;
          }
          const larger = Math.max(num1, num2);
          const smaller = Math.min(num1, num2);
          return larger / smaller;
        
        default:
          return null;
      }
    } catch (error) {
      console.error('Calculation error:', error);
      return null;
    }
  }

  /**
   * Create display grid with proper positioning and gaps
   * @param availableNumbers - Current available numbers
   * @param initialGridSize - Original grid size
   * @returns Object with grid array and column count
   */
  createDisplayGrid(
    availableNumbers: NumberObject[], 
    initialGridSize: number
  ): { grid: (NumberObject | null)[], cols: number } {
    const { cols } = this.getGridDimensions(initialGridSize);
    const rows = cols === 2 ? 2 : cols === 3 ? Math.ceil(initialGridSize / 3) : 3;
    const totalPositions = cols * rows;
    
    const grid: (NumberObject | null)[] = Array(totalPositions).fill(null);
    
    availableNumbers.forEach(numberObj => {
      if (numberObj.position < totalPositions) {
        grid[numberObj.position] = numberObj;
      }
    });
    
    return { grid, cols };
  }

  /**
   * Check if the game is won (target number exists in available numbers)
   * @param availableNumbers - Current available numbers
   * @param targetNumber - Target to reach
   * @returns boolean - True if game is won
   */
  isGameWon(availableNumbers: NumberObject[], targetNumber: number): boolean {
    return availableNumbers.some(num => num.value === targetNumber);
  }

  /**
   * Get selection state for a number button
   * @param numberObj - Number object to check
   * @param selectedNumber1 - First selected number
   * @param selectedNumber2 - Second selected number
   * @returns SelectionState - Current selection state
   */
  getSelectionState(
    numberObj: NumberObject,
    selectedNumber1: NumberObject | null,
    selectedNumber2: NumberObject | null
  ): SelectionState {
    if (selectedNumber1 && numberObj.id === selectedNumber1.id) {
      return 'selected1';
    }
    if (selectedNumber2 && numberObj.id === selectedNumber2.id) {
      return 'selected2';
    }
    return 'available';
  }

  /**
   * Calculate difficulty score for a level
   * @param levelNum - Level number
   * @returns number - Difficulty score (1-10)
   */
  getDifficultyScore(levelNum: number): number {
    return Math.min(Math.ceil(levelNum / 5), 10);
  }

  /**
   * Get operation symbol for display
   * @param operation - Operation type
   * @returns string - Display symbol
   */
  getOperationSymbol(operation: Operation): string {
    const symbols: Record<Operation, string> = {
      '+': '+',
      '-': '−',
      '*': '×',
      '/': '÷'
    };
    return symbols[operation];
  }

  /**
   * Validate if a move is possible
   * @param selectedNumber1 - First selected number
   * @param operation - Selected operation
   * @param selectedNumber2 - Second selected number
   * @returns boolean - True if move is valid
   */
  validateMove(
    selectedNumber1: NumberObject | null,
    operation: Operation | null,
    selectedNumber2: NumberObject | null
  ): boolean {
    if (!selectedNumber1 || !operation || !selectedNumber2) {
      return false;
    }

    if (selectedNumber1.id === selectedNumber2.id) {
      return false;
    }

    if (operation === '/' && !this.validateDivision(selectedNumber1.value, selectedNumber2.value)) {
      return false;
    }

    return true;
  }

  /**
   * Generate hint for the current puzzle state
   * @param availableNumbers - Current available numbers
   * @param targetNumber - Target to reach
   * @returns string | null - Hint text or null if no hint available
   */
  generateHint(availableNumbers: NumberObject[], targetNumber: number): string | null {
    // Simple hint: suggest operations that get closer to target
    if (availableNumbers.length < 2) {
      return null;
    }

    const operations: Operation[] = ['+', '-', '*', '/'];
    let bestHint: string | null = null;
    let bestDifference = Infinity;

    for (let i = 0; i < availableNumbers.length; i++) {
      for (let j = i + 1; j < availableNumbers.length; j++) {
        const num1 = availableNumbers[i];
        const num2 = availableNumbers[j];

        for (const op of operations) {
          const result = this.performCalculation(num1.value, op, num2.value);
          if (result !== null) {
            const difference = Math.abs(result - targetNumber);
            if (difference < bestDifference) {
              bestDifference = difference;
              bestHint = `Try ${num1.value} ${this.getOperationSymbol(op)} ${num2.value} = ${result}`;
            }
          }
        }
      }
    }

    return bestHint;
  }
}

// Export singleton instance
export const gameLogic = new GameLogicService();

// Export the class for testing
export { GameLogicService };

// Export utility constants
export const OPERATION_SYMBOLS: Record<Operation, string> = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷'
};

export const MAX_GRID_SIZE = 9;
export const MIN_GRID_SIZE = 4;
export const MAX_NUMBER_VALUE = 50;