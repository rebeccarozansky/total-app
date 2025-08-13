// Core game types
export interface NumberObject {
  value: number;
  id: string;
  position: number;
}

export interface GameState {
  numbers: NumberObject[];
  gridSize: number;
  num1: NumberObject;
  num2: NumberObject;
  operation: Operation;
  result: number;
}

export type Operation = '+' | '-' | '*' | '/';

export type SelectionState = 'available' | 'selected1' | 'selected2';

export interface GridDimensions {
  cols: number;
  rows: number;
}

export interface Puzzle {
  target: number;
  numbers: NumberObject[];
}

// Navigation types
export type Screen = 'home' | 'game' | 'levels' | 'howToPlay';

export interface NavigationProps {
  onNavigate: (screen: Screen, level?: number) => void;
}

// Component props types
export interface NumberButtonProps {
  numberObj: NumberObject;
  onPress: (numberObj: NumberObject) => void;
  state: SelectionState;
  isInvalidSelection: boolean;
  isWinning: boolean;
}

export interface OperationButtonProps {
  symbol: string;
  operation: Operation;
  onPress: (operation: Operation) => void;
  isSelected: boolean;
  isDisabled: boolean;
}

export interface ActionButtonsProps {
  onUndo: () => void;
  onClear: () => void;
  onReset: () => void;
  canUndo: boolean;
  canClear: boolean;
}

export interface LevelCompleteModalProps {
  visible: boolean;
  level: number;
  targetNumber: number;
  onNextLevel: () => void;
}

// Screen props types
export interface HomeScreenProps extends NavigationProps {
  currentLevel: number;
}

export interface GameScreenProps extends NavigationProps {
  initialLevel?: number | null;
  onLevelComplete?: (newLevel: number) => void;
}

export interface LevelsScreenProps extends NavigationProps {
  currentLevel: number;
  completedLevels: number[];
}

export interface HowToPlayScreenProps extends NavigationProps {}

// Example animation types
export interface ExampleNumber {
  value: number;
  selected: boolean;
  position: number;
}

// Storage types
export interface StorageUtils {
  getCurrentLevel: () => Promise<number>;
  setCurrentLevel: (level: number) => Promise<void>;
  getCompletedLevels: () => Promise<number[]>;
  addCompletedLevel: (level: number) => Promise<void>;
}

// Game logic types
export interface GameLogicUtils {
  generatePuzzle: (levelNum: number) => Puzzle;
  getGridDimensions: (numCount: number) => GridDimensions;
  validateDivision: (num1: number, num2: number) => boolean;
  performCalculation: (num1: number, operation: Operation, num2: number) => number | null;
}