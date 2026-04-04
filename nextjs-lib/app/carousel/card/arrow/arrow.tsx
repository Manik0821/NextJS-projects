import React from 'react';

interface ArrowProps {
  direction: string; // 'up' or 'down'
}

const Arrow: React.FC<ArrowProps> = ({ direction }) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-block',
    fontSize: '1.5rem',
    transition: 'transform 0.5s ease-in-out',
    width: '2rem',
    textAlign: 'center',
  };

  const rotation = direction === 'up' ? 'rotate(-90deg)' : 'rotate(90deg)';

  return (
    <div 
      style={{ ...baseStyle, transform: `${rotation}` }} 
      className="arrow"
    >
      ›
    </div>
  );
};

export default Arrow;
