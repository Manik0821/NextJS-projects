'use client'

// import { useCounterStore } from '@/app/lib/store';

import React from 'react'
import Tile from '../tile';

const Board = () => {

    // const count = useCounterStore((state) => state.count);
    // const increment = useCounterStore((state) => state.increment);

  return (
    <div className='boardWrapper'>
        Board
        <Tile value='X' />
        <Tile value='X' />
        <Tile value='X' />
        <Tile value='X' />
        <Tile value='X' />
        <Tile value='X' />
        <Tile value='X' />
        <Tile value='X' />
        <Tile value='X' />
    </div>
  )
}

export default Board;
