'use client';
import React, { useEffect } from 'react';
import './page.css';
import Board from './board/board';
import { useTitleStore } from '@/lib/store';

const Game = () => {
  return (
    <div className='gameWrapper'>
      <Board />
    </div>
  )
}

export default Game;
