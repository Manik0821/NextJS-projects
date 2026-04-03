'use client'
import { useRef, useState } from 'react'
import './multi-slide-carousel.css';
import Arrow from '../card/arrow/arrow';
import { Card } from '../card/card';
import '../carousel.css';


const Carousel = ({children}:{children:React.ReactNode}) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const parentRef = useRef<HTMLDivElement>(null);
    const [dir, changeDir] = useState('up');

    const accClick = () => {
        if (carouselRef.current) {
            carouselRef.current.classList.toggle('accordion-cont-expanded');
            carouselRef.current.classList.toggle('accordion-cont-collapsed');
            changeDir(prev => (prev === 'up' ? 'down' : 'up'));
        }
    };

    // 1. ADD SCROLL FUNCTION
    const scroll = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            // 1. Get the visible width of the container
            const containerWidth = carouselRef.current.offsetWidth;
            
            // 2. Convert 2rem to pixels (assuming 1rem = 16px, so 32px)
            const marginOffset = 32; 
    
            // 3. Calculate how much to move (e.g., 80% of the view for a nice slide)
            const scrollAmount = containerWidth - marginOffset;
    
            // 4. Scroll based on direction
            carouselRef.current.scrollBy({ 
                left: direction === 'right' ? scrollAmount : -scrollAmount, 
                behavior: 'smooth' 
            });
        }
    };
    

    return (
        <div className="carousel-wrapper">
            <div className="carousel" ref={parentRef} > {/* CSS makes this 'position: relative' */}

                <div className="carousel-header" onClick={accClick}>
                    <div className="carousel-title">Sliding Carousel</div>
                    <Arrow direction={dir} />
                </div>

                <div
                    className="control-buttons"
                    style={{
                        display: 'flex', // Keep flex so positioning works
                        opacity: dir === 'up' ? 1 : 0,
                        visibility: dir === 'up' ? 'visible' : 'hidden',
                        transition: 'opacity 0.5s ease-in-out, visibility 0.5s ease-in-out',

                        // Your existing positioning
                        position: 'absolute',
                        justifyContent: 'space-between',
                        width: '100%',
                        left: '0',
                        top: '50%',
                        pointerEvents: 'none',
                        zIndex: 10
                    }}
                >
                    {/* 3. ADD ONCLICK TO BUTTONS */}
                    <button
                        style={{ pointerEvents: 'auto' }}
                        onClick={() => scroll('left')}
                    >
                        {'<'}
                    </button>
                    <button
                        style={{ pointerEvents: 'auto' }}
                        onClick={() => scroll('right')}
                    >
                        {'>'}
                    </button>
                </div>

                <div className="carousel-container">
                    <div className="carousel-cont-track  accordion-cont-expanded" ref={carouselRef}>
                        {children || (
                            <Card title='Card 1'>This is Card 1</Card>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};


export default Carousel;
