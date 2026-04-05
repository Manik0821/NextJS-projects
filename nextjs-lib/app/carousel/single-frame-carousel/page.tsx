import React from 'react'
import Carousel from './single-frame-carousel';

const SingleFrameCarousel = ({children}:{children: React.ReactNode}) => {
  return (
    <div className='carousel-wrapper single-frame-carousel' style={{width: 'maxContent', margin: '0 auto', minHeight: '20rem'}}>
      <Carousel children={children} ></Carousel>
    </div>
  )
}

export default SingleFrameCarousel;
