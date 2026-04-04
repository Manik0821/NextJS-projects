'use client';
import React, { useState } from 'react'
import { Card } from '../card/card'
import './sliding-carousel.css';
import { useRef } from 'react';
import '../carousel.css';
import Arrow from '../card/arrow/arrow';

const Carousel = ({ children }: { children: React.ReactNode }) => {

    const carouselRef = useRef<HTMLDivElement>(null);
    const [dir, changeDir] = useState('up');

    const accClick = () => {
        if (carouselRef.current) {
            carouselRef.current.classList.toggle('accordion-cont-expanded');
            carouselRef.current.classList.toggle('accordion-cont-collapsed');
            if (dir === 'up') {
                changeDir('down');
            } else {
                changeDir('up');
            }
        } else {
            console.error('Carousel container not found');
        }
    }

    return (
        <div className='carousel-wrapper sliding-carousel'>
            <div className="carousel">
                <div className="carousel-header" onClick={accClick} >
                    <div className="carousel-title" >Sliding Carousel </div>
                    <Arrow direction={dir} />
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
    )
}

export default Carousel;
