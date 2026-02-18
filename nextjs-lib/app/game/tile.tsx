import React from 'react';
import './tile.css';

type TileProps = {
    value: string;
};

// Updated Component with enhanced Tailwind styles
const Tile: React.FC<TileProps> = ({ value }) => {
    return (
      <div className="flex justify-center items-center">
          <div className="tileWrapper transition-transform hover:scale-105 active:scale-95 cursor-pointer">
              <div className={`tile flex items-center justify-center w-16 h-16 p-4 border-2 border-gray-500 rounded-lg bg-white shadow-md text-2xl font-bold uppercase tile-${value}` }>
                  {value === '' ? <span className="opacity-0">A</span> : value}
              </div>
          </div>
      </div>
    );
  }
  

export default Tile;
