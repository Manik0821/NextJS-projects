'use client';
import React, { useState } from 'react'
import { Card } from '../card/card'
import './sliding-carousel.css';
import { useRef } from 'react';
import '../carousel.css';
import Arrow from '../card/arrow/arrow';

const Carousel = () => {

    const carouselRef = useRef<HTMLDivElement>(null);
    const [dir,changeDir] = useState('up');

    const accClick = () => {
        if(carouselRef.current) {
            carouselRef.current.classList.toggle('accordion-cont-expanded');
            carouselRef.current.classList.toggle('accordion-cont-collapsed');
            if(dir === 'up') {
                changeDir('down');
            } else {
                changeDir('up');
            }
        }else {
            console.error('Carousel container not found');
        }
    }

  return (
    <div>
        <div className="carousel">
            <div className="carousel-header" onClick={accClick} >
                <div className="carousel-title" >Sliding Carousel </div>
                <Arrow direction={dir} /> 
                </div>
            <div className="carousel-container accordion-cont-expanded" ref={carouselRef}>
                <Card title='Card 1'>This is Card 1</Card>
                <Card title='Card 2'>This is Card 2</Card>
                <Card title='Card 3'>This is Card 3</Card>
                <Card title='Card 4'>This is Card 4</Card>
                <Card title='Card 5'>This is Card 5</Card>
                <Card title='Card 6'>This is Card 6</Card>
                <Card title='Card 1'>This is Card 1</Card>
                <Card title='Card 2'>This is Card 2</Card>
                <Card title='Card 3'>This is Card 3</Card>
                <Card title='Card 4'>This is Card 4</Card>
                <Card title='Card 5'>This is Card 5</Card>
                <Card title='Card 6'>This is Card 6</Card>
                <Card title='Card 1'>This is Card 1</Card>
                <Card title='Card 2'>This is Card 2</Card>
                <Card title='Card 3'>This is Card 3</Card>
                <Card title='Card 4'>This is Card 4</Card>
                <Card title='Card 5'>This is Card 5</Card>
                <Card title='Card 6'>This is Card 6</Card>
            </div>
        </div>
    </div>
  )
}

export default Carousel;
