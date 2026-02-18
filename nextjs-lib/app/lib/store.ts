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
    currPlayer: 'X' | 'O';
    ScoreA: number;
    ScoreB: number;
    TotalGames: number;
    board: string[];
    currState: 'playing' | 'finished';
    updateBoard: (index: number, value: string) => void;
    resetGame: () => void;
    resetBoard: () => void;
    checkWin: (currentBoard: string[]) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
    currPlayer: 'X',
    ScoreA: 0,
    ScoreB: 0,
    TotalGames: 0,
    board: Array(9).fill(''),
    currState: 'playing',

    updateBoard: (index, value) => {
        const { board, currState, currPlayer, ScoreA, ScoreB, TotalGames } = get();

        // Validations
        if (currState === 'finished' || board[index] !== '') return;

        // Create a new board array (Immutable update)
        const newBoard = [...board];
        newBoard[index] = value;

        set({ board: newBoard });

        // Run Win Check
        get().checkWin(newBoard);
        if (get().currState === 'finished') return; // If game ended, don't switch player
        set({ currPlayer: currPlayer === 'X' ? 'O' : 'X' });
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
            set((state) => ({
                currState: 'finished',
                TotalGames: state.TotalGames + 1,
                // Update the player inside the same set call
                currentPlayer: state.currPlayer === 'X' ? 'O' : 'O' // Switch to the other player for the next game
            }));
        }

    },

    resetBoard: () => set({
        board: Array(9).fill(''),
        currState: 'playing'
    }),

    resetGame: () => set({
        ScoreA: 0,
        ScoreB: 0,
        TotalGames: 0,
        currPlayer: 'X',
        board: Array(9).fill(''),
        currState: 'playing'
    })
}));