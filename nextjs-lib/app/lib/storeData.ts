export const PATTERNS = [
    [0, 1, 2],
    [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

export const PAGE_DATA: Record<string, { title: string; subTitle: string; subHeading?:string }> = {
    '/': { title: 'Home Dashboard', subTitle: '', subHeading : 'Welcome Back!' },
    '/game': { title: 'Board Game', subTitle: 'Play against the computer' },
    '/game/card': { title: 'Card Component', subTitle: 'This is a Card Component' },
    '/poll': { title: 'Poll Component', subTitle: 'Vote for your favorite option' },
  };