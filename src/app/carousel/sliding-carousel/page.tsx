import React from 'react'
import Carousel from '@/features/carousel/single-frame-carousel/single-frame-carousel';

const SlidingCarousel = ({children}:{children: React.ReactNode}) => {
  return (
    <div className='carousel-wrapper sliding-carousel' style={{width: 'maxContent', margin: '0 auto'}}>
      <Carousel children={children} ></Carousel>
    </div>
  )
}

export default SlidingCarousel;
