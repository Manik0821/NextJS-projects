import React from 'react'
import { Card } from './card/card';
import MultiSlideCarousel from './multi-slide-carousel/multi-slide-carousel';
import SlidingCarousel from './sliding-carousel/sliding-carousel';

const CarouselPage = () => {
    return (
        <div className='carousel-page'>
            <MultiSlideCarousel>
            <Card title='Card 1'>This is Card 1</Card><div className='w-64 h-64 bg-red-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 1</div>
                <div className='w-64 h-64 bg-green-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 2</div>
                <Card title='Card 2'>This is Card 2</Card>
                <div className='w-64 h-64 bg-red-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 1</div>
                <div className='w-64 h-64 bg-green-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 2</div>
                <Card title='Card 2'>This is Card 2</Card>
                <Card title='Card 1'>This is Card 1</Card><div className='w-64 h-64 bg-red-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 1</div>
                <div className='w-64 h-64 bg-green-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 2</div>
                <Card title='Card 2'>This is Card 2</Card>
                <Card title='Card 1'>This is Card 1</Card><div className='w-64 h-64 bg-red-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 1</div>
                <div className='w-64 h-64 bg-green-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 2</div>
                <Card title='Card 2'>This is Card 2</Card>
                <Card title='Card 1'>This is Card 1</Card><div className='w-64 h-64 bg-red-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 1</div>
                <div className='w-64 h-64 bg-green-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 2</div>
                <Card title='Card 2'>This is Card 2</Card>
                <Card title='Card 1'>This is Card 1</Card>
            </MultiSlideCarousel>

            <SlidingCarousel>
            <div className='w-64 h-64 bg-green-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 2</div>
                <Card title='Card 2'>This is Card 2</Card>
                <div className='w-64 h-64 bg-red-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 1</div>
                <div className='w-64 h-64 bg-green-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 2</div>
                <Card title='Card 2'>This is Card 2</Card>
                <Card title='Card 1'>This is Card 1</Card><div className='w-64 h-64 bg-red-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 1</div>
                <div className='w-64 h-64 bg-green-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 2</div>
                <Card title='Card 2'>This is Card 2</Card>
                <Card title='Card 1'>This is Card 1</Card><div className='w-64 h-64 bg-red-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 1</div>
                <div className='w-64 h-64 bg-green-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 2</div>
                <Card title='Card 2'>This is Card 2</Card>
                <Card title='Card 1'>This is Card 1</Card><div className='w-64 h-64 bg-red-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 1</div>
                <div className='w-64 h-64 bg-green-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 2</div>
                <Card title='Card 2'>This is Card 2</Card>
                <Card title='Card 1'>This is Card 1</Card>
            </SlidingCarousel>

        </div>
    )
}

export default CarouselPage;
