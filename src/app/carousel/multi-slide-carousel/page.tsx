import React from 'react'
import Carousel from '@/features/carousel/multi-slide-carousel/multi-slide-carousel';

const MultiSlideCarousel = ({children}:{children: React.ReactNode}) => {
  return (
    <div className='carousel-wrapper multi-slide-carousel' style={{width: 'maxContent', margin: '0 auto'}}>
      <Carousel children={children}></Carousel>
    </div>
  )
}

export default MultiSlideCarousel;
