'use client';
import React, { useEffect, useState, useRef } from 'react';
import './single-frame-carousel.css';
import '../carousel.css';

// Fixed absolute paths pointing down from the new 'src' folder
import Arrow from '@/lib/arrow/arrow';
import { Card } from '@/lib/card/card';


interface CarouselProps {
    children: React.ReactNode;
    autoSlide?: boolean;
    interval?: number;
}

const Carousel = ({ children, autoSlide = true, interval = 3000 }: CarouselProps) => {
    const carouselRef = useRef<HTMLDivElement>(null); // The Scrolling Track
    const parentRef = useRef<HTMLDivElement>(null);   // The Accordion Wrapper
    const [dir, changeDir] = useState('up');

    // 1. Fixed useEffect (Logic inside, not outside)
    useEffect(() => {
        if (!autoSlide || interval <= 0) return;

        const autoLoop = setInterval(() => {
            scroll('right');
        }, interval);

        return () => clearInterval(autoLoop);
    }, [autoSlide, interval]); 

    const accClick = () => {
        if (parentRef.current) {
            parentRef.current.classList.toggle('accordion-cont-expanded');
            parentRef.current.classList.toggle('accordion-cont-collapsed');
            changeDir(prev => (prev === 'up' ? 'down' : 'up'));
        }
    };

    // 2. Fixed Scroll Logic (Prevents Drifting)
    const scroll = (direction: 'left' | 'right') => {
        const track = carouselRef.current;
        if (!track) return;

        // Use clientWidth of the track to define one "page"
        const frameWidth = track.clientWidth;
        const currentScroll = track.scrollLeft;
        const maxScroll = track.scrollWidth - frameWidth;

        // Calculate which frame we are currently on (0, 1, 2...)
        const currentFrame = Math.round(currentScroll / frameWidth);

        if (direction === 'right') {
            if (currentScroll >= maxScroll - 10) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                // Snap to exact next frame
                track.scrollTo({ 
                    left: (currentFrame + 1) * frameWidth, 
                    behavior: 'smooth' 
                });
            }
        } else {
            if (currentScroll <= 10) {
                track.scrollTo({ left: maxScroll, behavior: 'smooth' });
            } else {
                // Snap to exact previous frame
                track.scrollTo({ 
                    left: (currentFrame - 1) * frameWidth, 
                    behavior: 'smooth' 
                });
            }
        }
    };

    return (
        <div className="carousel-wrapper single-frame-carousel">
            <div className="carousel"> 
                <div className="carousel-header" onClick={accClick}>
                    <div className="carousel-title">Single Frame Carousel</div>
                    <Arrow direction={dir} />
                </div>

                <div className="carousel-container accordion-cont-collapsed" ref={parentRef}>
                    <div className="carousel-control-button">
                        <button className='control-button button-left' onClick={() => scroll('left')}>
                            {'<'}
                        </button>
                        <button className='control-button button-right' onClick={() => scroll('right')}>
                            {'>'}
                        </button>
                    </div>

                    <div className="carousel-cont-track" ref={carouselRef}>
                        {children || (
                            <>
                                <Card title='Card 1'>This is Card 1</Card>
                                <Card title='Card 2'>This is Card 2</Card>
                                <Card title='Card 3'>This is Card 3</Card>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Carousel;
