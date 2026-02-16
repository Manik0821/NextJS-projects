import { create } from 'zustand'

// interface CounterState {
//   count: number
//   increment: () => void
//   decrement: () => void
// }

// export const useCounterStore = create<CounterState>((set) => ({
//   count: 0,
//   increment: () => set((state) => ({ count: state.count + 1 })),
//   decrement: () => set((state) => ({ count: state.count - 1 })),
// }))
// 1. Define the Winning Patterns
const PATTERNS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  
  interface GameState {
    ScoreA: number;
    ScoreB: number;
    TotalGames: number;
    board: string[];
    currState: 'playing' | 'finished';
    updateBoard: (index: number, value: string) => void;
    resetGame: () => void;
    checkWin: (currentBoard: string[]) => void; 
  }
  
  export const useGameStore = create<GameState>((set, get) => ({
    ScoreA: 0,
    ScoreB: 0,
    TotalGames: 0,
    board: Array(9).fill(''),
    currState: 'playing',
  
    updateBoard: (index, value) => {
      const { board, currState } = get();
  
      // Validations
      if (currState === 'finished' || board[index] !== '') return;
  
      // Create a new board array (Immutable update)
      const newBoard = [...board];
      newBoard[index] = value;
  
      set({ board: newBoard });
      
      // Run Win Check
      get().checkWin(newBoard);
    },
  
    // Internal helper logic
    checkWin: (currentBoard: string[]) => {
      for (const [a, b, c] of PATTERNS) {
        if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
          const winner = currentBoard[a];
          
          set((state) => ({
            currState: 'finished',
            TotalGames: state.TotalGames + 1,
            ScoreA: winner === 'X' ? state.ScoreA + 1 : state.ScoreA,
            ScoreB: winner === 'O' ? state.ScoreB + 1 : state.ScoreB,
          }));
          return;
        }
      }
      
      // Check for Draw
      if (!currentBoard.includes('')) {
          set((state) => ({ currState: 'finished', TotalGames: state.TotalGames + 1 }));
      }
    },
  
    resetGame: () => set({
      board: Array(9).fill(''),
      currState: 'playing'
    })
  }));