'use client'

import { useGameStore } from '@/lib/store';
import { PATTERNS } from '@/lib/storeData'; 
import './board.css';
import React, { useEffect } from 'react'
import Tile from '../tile';
import { Button } from '@/lib/Button/Button';

const Board = () => {
    const board = useGameStore((state) => state.board);
    const currPlayer = useGameStore((state) => state.currPlayer);
    const currentState = useGameStore((state) => state.currState);
    const scoreA = useGameStore((state) => state.ScoreA);
    const scoreB = useGameStore((state) => state.ScoreB);

    useEffect(() => {
        if (currentState === 'finished') {
            const timer = setTimeout(() => {
                useGameStore.getState().resetBoard();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [currentState]);

    const getWinningTiles = (): number[] => {
        for (const [a, b, c] of PATTERNS) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return [a, b, c];
            }
        }
        return [];
    };

    const winningTiles = getWinningTiles();
    const isGameOver = currentState === 'finished';

    return (
        <div className='boardWrapper'>
            <div className="playerBoard">
                {/* 🎯 Player A (X) Wrapper with Dynamic Active Outline */}
                <div 
                    style={{ 
                        scale: "1.2", 
                        margin: "0 15px",
                        borderRadius: "999px", 
                        transition: "all 0.3s ease",
                        boxShadow: currPlayer === 'X' && !isGameOver ? "0 0 0 3px #3b82f6, 0 10px 15px -3px rgba(59, 130, 246, 0.3)" : "none"
                    }}
                >
                    <Button
                        type="tertiary"
                        value={`Player A (X) - ${scoreA}`}
                        click={false}
                        disabled={false}
                    />
                </div>

                {/* 🎯 Player B (O) Wrapper with Dynamic Active Outline */}
                <div 
                    style={{ 
                        scale: "1.2", 
                        margin: "0 15px",
                        borderRadius: "999px",
                        transition: "all 0.3s ease",
                        boxShadow: currPlayer === 'O' && !isGameOver ? "0 0 0 3px #3b82f6, 0 10px 15px -3px rgba(59, 130, 246, 0.3)" : "none"
                    }}
                >
                    <Button
                        type="tertiary"
                        value={`Player B (O) - ${scoreB}`}
                        click={false}
                        disabled={false}
                    />
                </div>
            </div>

            <div className="board">
                {board.map((value, index) => {
                    const isWinner = winningTiles.includes(index);
                    
                    return (
                        <div 
                            key={index} 
                            onClick={() => !isGameOver && useGameStore.getState().updateBoard(index)}
                            className={`${isGameOver ? 'disabled' : ''} ${isWinner ? 'winner' : ''}`}
                        >
                            <Tile value={value} />
                        </div>
                    );
                })}
            </div>

            <div className="playerBoard">
                <div className="player active" onClick={() => useGameStore.getState().resetBoard()}>
                    Reset Board
                </div>
                <div className="player active" onClick={() => useGameStore.getState().resetGame()}>
                    Reset Game
                </div>
            </div>
        </div>
    )
}

export default Board;
