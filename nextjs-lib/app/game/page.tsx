'use client';
import React, { useEffect } from 'react';
import './page.css';
import Board from './board/board';
import { UpdateTitle } from '../lib/store';

const Game = () => {
  const { title , subTitle} = UpdateTitle();

  useEffect(() => {
    // This will run exactly once when the component mounts (route loads)
    UpdateTitle.setState({
      title: "Board Game",
      subTitle: "Play against the computer"
    });
  }, []);

  return (
    <div className='gameWrapper'>
      <Board />
    </div>
  )
}

export default Game;