import Image from 'next/image'
import MultiSlideCarousel from './carousel/multi-slide-carousel/page'
import { Card } from './carousel/card/card'

export default function Home() {
  return (
    <main className='bg-yellow'><h1 className='p-4'>Hello</h1>
      <MultiSlideCarousel>
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
    </main>
  )
}
