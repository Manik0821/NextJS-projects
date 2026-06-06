'use client'

import { useGameStore } from '@/lib/store';
import './board.css';
import React, { use, useEffect } from 'react'
import Tile from '../tile';
import { Button } from '@/lib/Button/Button';

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

    return (
        <div className='boardWrapper'>
            <div className="playerBoard">
                <div style={{scale: "1.2" , margin:"0 15px"}}>
                    <Button
                        type="tertiary"
                        // 2. Use clean template literal syntax
                        value={`Player A (X) - ${useGameStore((state) => state.ScoreA)}`}
                        click={false}
                        disabled={false}
                    />
                </div>
                <div style={{scale: "1.2" , margin:"0 15px"}}>
                    <Button
                        type="tertiary"
                        // 2. Use clean template literal syntax
                        value={`Player B (O) - ${useGameStore((state) => state.ScoreB)}`}
                        click={false}
                        disabled={false}
                    />
                </div>
            </div>
            <div className="board">
                {board.map((value, index) => (
                    <div key={index} onClick={() => useGameStore.getState().updateBoard(index)}>
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
