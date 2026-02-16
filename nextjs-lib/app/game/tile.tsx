import React from 'react'

type TileProps = {
    value: string;
};

const Tile :React.FC<TileProps> = ({value}) => {
  return (
    <div>
        <div className="tileWrapper">
            <div className="tile p-4 border-2 border-gray-500">
                {value}
            </div>
        </div>
    </div>
  )
}

export default Tile;
