import React from 'react'
import Carousel from './multi-slide-carousel';

const MultiSlideCarousel = ({children}:{children: React.ReactNode}) => {
  return (
    <div className='carousel-wrapper' style={{width: 'maxContent', margin: '0 auto'}}>
      <Carousel>
        {children}
      </Carousel>
    </div>
  )
}

export default MultiSlideCarousel
