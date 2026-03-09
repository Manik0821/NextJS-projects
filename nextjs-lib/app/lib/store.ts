import { create } from 'zustand'
import { PATTERNS, PAGE_DATA } from './storeData';

// --- Game Logic Store ---
interface GameState {
    currPlayer: 'X' | 'O';
    ScoreA: number;
    ScoreB: number;
    TotalGames: number;
    board: string[];
    currState: 'playing' | 'finished';
    updateBoard: (index: number) => void;
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

    updateBoard: (index) => {
        const { board, currState, currPlayer } = get();

        if (currState === 'finished' || board[index] !== '') return;

        const newBoard = [...board];
        newBoard[index] = currPlayer;

        set({ board: newBoard });

        // Run Win Check
        get().checkWin(newBoard);

        // Switch player only if game is still active
        if (get().currState === 'playing') {
            set({ currPlayer: currPlayer === 'X' ? 'O' : 'X' });
        }
    },

    checkWin: (currentBoard: string[]) => {
        // Winning Logic
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

        // Draw Logic
        if (!currentBoard.includes('')) {
            set((state) => ({
                currState: 'finished',
                TotalGames: state.TotalGames + 1,
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

// --- Sidebar UI Store ---
interface SidebarState {
    isOpen: boolean;
    toggle: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
    isOpen: false,
    toggle: () => set((state) => ({ isOpen: !state.isOpen }))
}));

// --- Page Title / Route Store ---
interface PageTitleState {
    title: string;
    subTitle: string;
    updateByPath: (path: string) => void;
    updateTitle: (title: string, subTitle: string) => void;
}

export const useTitleStore = create<PageTitleState>((set) => ({
    title: 'Title',
    subTitle: '',
    updateByPath: (path: string) => {
        const data = PAGE_DATA[path] || { title: 'Default Title', subTitle: '' };
        set({ title: data.title, subTitle: data.subTitle });
    },
    updateTitle: (title, subTitle) => set({ title, subTitle }),
}));
