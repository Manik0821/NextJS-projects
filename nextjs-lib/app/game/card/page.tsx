import React from 'react'
import { Card } from './card'

export default function CardPage() {
  return (
    <main className='p-4 grid grid-cols-3 gap-4 bg-gray-200 border-2 border-gray-400 rounded-lg m-4 align-middle'>
        <Card title='Card'>This is a card Component</Card>
        <Card title='Card'>This is a card Component</Card>
        <Card title='Card'>This is a card Component</Card>
        <Card title='Card'>This is a card Component</Card>
        <Card title='Card'>This is a card Component</Card>
        <Card title='Card'>This is a card Component</Card>
        <Card title='Card'>This is a card Component</Card>
    </main>
  )
}
