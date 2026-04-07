'use client'
import { useRef, useState } from 'react'
import './multi-slide-carousel.css';
import Arrow from '../card/arrow/arrow';
import { Card } from '../card/card';
import '../carousel.css';

const Carousel = ({ children }: { children: React.ReactNode }) => {
    const carouselRef = useRef<HTMLDivElement>(null); // The Scrolling Track
    const parentRef = useRef<HTMLDivElement>(null);   // The Accordion Wrapper
    const [dir, changeDir] = useState('up');

    const accClick = () => {
        if (parentRef.current) {
            // Toggle on the PARENT so buttons also hide
            parentRef.current.classList.toggle('accordion-cont-expanded');
            parentRef.current.classList.toggle('accordion-cont-collapsed');
            changeDir(prev => (prev === 'up' ? 'down' : 'up'));
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (carouselRef.current && parentRef.current) {
            // Use the parent (the visible window) to decide how far to move
            const viewWidth = parentRef.current.offsetWidth;
            
            // Move by 75% of the view so the user doesn't lose track of where they were
            const scrollAmount = viewWidth ;

            carouselRef.current.scrollBy({
                left: direction === 'right' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="carousel-wrapper multi-slide-carousel">
            <div className="carousel"> 
                {/* Header */}
                <div className="carousel-header" onClick={accClick}>
                    <div className="carousel-title">Multi Sliding Carousel</div>
                    <Arrow direction={dir} />
                </div>

                {/* The Container (Accordion targets this) */}
                <div className="carousel-container accordion-cont-collapsed" ref={parentRef}>
                    
                    <div className="carousel-control-button">
                        <button className='control-button' onClick={() => scroll('left')}>
                            {'<'}
                        </button>
                    </div>

                    {/* The Track (Scroll occurs here) */}
                    <div className="carousel-cont-track" ref={carouselRef}>
                        {children || (
                            <>
                                <Card title='Card 1'>This is Card 1</Card>
                                <Card title='Card 2'>This is Card 2</Card>
                                <Card title='Card 3'>This is Card 3</Card>
                                <Card title='Card 4'>This is Card 4</Card>
                                <Card title='Card 5'>This is Card 5</Card>
                            </>
                        )}
                    </div>

                    <div className="carousel-control-button">
                        <button className='control-button' onClick={() => scroll('right')}>
                            {'>'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Carousel;
