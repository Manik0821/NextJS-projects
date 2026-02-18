'use client'

import { useGameStore } from '@/app/lib/store';
import './board.css';
import React, { use, useEffect } from 'react'
import Tile from '../tile';

const Board = () => {

    const board = useGameStore((state) => state.board);
    const currPlayer = useGameStore((state) => state.currPlayer);
    const currentState = useGameStore((state) => state.currState);

    useEffect(() => {
        if (currentState === 'finished') {
            setTimeout(() => {
                useGameStore.getState().resetBoard();
            }, 2000);
        }
    }, [currentState]);

    // const count = useCounterStore((state) => state.count);
    // const increment = useCounterStore((state) => state.increment);

  return (
    <div className='boardWrapper'>

        <h2 className='boardHeading'>Board</h2>
        <div className="playerBoard">
            <div className={`player ${currPlayer === 'X' ? 'active' : ''}`}>
                Player A (X) - {useGameStore((state) => state.ScoreA)}
            </div>
            <div className={`player ${currPlayer === 'O' ? 'active' : ''}`}>
                Player B (O) - {useGameStore((state) => state.ScoreB)}
            </div>
        </div>
        <div className="board">
            {board.map((value, index) => (
                <div key={index} onClick={() => useGameStore.getState().updateBoard(index, currPlayer)}>
                    <Tile value={value} />
                </div>
            ))}
        </div>
        <div className="playerBoard">
            <div className={`player active`} onClick={() => useGameStore.getState().resetBoard()}>
                Reset Board 
            </div>
            <div className={`player active`} onClick={() => useGameStore.getState().resetGame()}>
                Reset Game 
            </div>
        </div>
    </div>
  )
}

export default Board;
