// src/app/carousel/page.tsx
import React from 'react';

// 1. Fixed absolute imports pointing cleanly from your new 'src' folder
import { Card } from '@/lib/card/card';
import MultiSlideCarousel from '@/features/carousel/multi-slide-carousel/multi-slide-carousel';
import SlidingCarousel from '@/features/carousel/sliding-carousel/sliding-carousel';
import SingleFrameCarousel from '@/features/carousel/single-frame-carousel/single-frame-carousel';

const CarouselPage = () => {
    return (
        <div className='carousel-page'>
            {/* Your carousel components remain exactly the same below... */}


            <SingleFrameCarousel>
                <div className='h-64 bg-red-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 1</div>
                <div className='h-64 bg-green-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 2</div>
                <div className='w-64 h-64 bg-red-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 1</div>
                <div className='w-64 h-64 bg-green-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 2</div>
                <Card title='Card 2'>This is Card 2</Card>
                <Card title='Card 1'>This is Card 1</Card><div className='w-64 h-64 bg-red-500 flex items-center justify-center text-white text-2xl font-bold'>Slide 1</div>

            </SingleFrameCarousel>

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

        </div>
    )
}

export default CarouselPage;
