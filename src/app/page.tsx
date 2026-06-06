'use client'
import Image from 'next/image'

import { useState } from 'react';
import Dropdown from '../lib/Filter-list-dropdown/Dropdown';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Elderberry', value: 'elderberry' },
  { label: 'Fig', value: 'fig' },
  { label: 'Grape', value: 'grape' },
  { label: 'Honeydew', value: 'honeydew' },
  { label: 'Kiwi', value: 'kiwi' },
  { label: 'Lemon', value: 'lemon' },
  { label: 'Mango', value: 'mango' },
  { label: 'Nectarine', value: 'nectarine' },
  { label: 'Orange', value: 'orange' },
  { label: 'Papaya', value: 'papaya' },
  { label: 'Quince', value: 'quince' },
  { label: 'Raspberry', value: 'raspberry' },
  { label: 'Strawberry', value: 'strawberry' },
  { label: 'Tangerine', value: 'tangerine' },
  { label: 'Ugli Fruit', value: 'ugli_fruit' },
  { label: 'Watermelon', value: 'watermelon' }
];
const cities = [
  { label: 'Tokyo, Japan', value: 'tokyo', country: 'Japan' },
  { label: 'Delhi, India', value: 'delhi', country: 'India' },
  { label: 'Shanghai, China', value: 'shanghai', country: 'China' },
  { label: 'São Paulo, Brazil', value: 'sao_paulo', country: 'Brazil' },
  { label: 'Mexico City, Mexico', value: 'mexico_city', country: 'Mexico' },
  { label: 'Cairo, Egypt', value: 'cairo', country: 'Egypt' },
  { label: 'Mumbai, India', value: 'mumbai', country: 'India' },
  { label: 'Beijing, China', value: 'beijing', country: 'China' },
  { label: 'Dhaka, Bangladesh', value: 'dhaka', country: 'Bangladesh' },
  { label: 'Osaka, Japan', value: 'osaka', country: 'Japan' },
  { label: 'New York, United States', value: 'new_york', country: 'United States' },
  { label: 'Karachi, Pakistan', value: 'karachi', country: 'Pakistan' },
  { label: 'Buenos Aires, Argentina', value: 'buenos_aires', country: 'Argentina' },
  { label: 'Chongqing, China', value: 'chongqing', country: 'China' },
  { label: 'Istanbul, Turkey', value: 'istanbul', country: 'Turkey' },
  { label: 'Kolkata, India', value: 'kolkata', country: 'India' },
  { label: 'Manila, Philippines', value: 'manila', country: 'Philippines' },
  { label: 'Lagos, Nigeria', value: 'lagos', country: 'Nigeria' },
  { label: 'Rio de Janeiro, Brazil', value: 'rio_de_janeiro', country: 'Brazil' },
  { label: 'Tianjin, China', value: 'tianjin', country: 'China' },
  { label: 'Kinshasa, DR Congo', value: 'kinshasa', country: 'DR Congo' },
  { label: 'Guangzhou, China', value: 'guangzhou', country: 'China' },
  { label: 'Los Angeles, United States', value: 'los_angeles', country: 'United States' },
  { label: 'Moscow, Russia', value: 'moscow', country: 'Russia' },
  { label: 'Shenzhen, China', value: 'shenzhen', country: 'China' },
  { label: 'Lahore, Pakistan', value: 'lahore', country: 'Pakistan' },
  { label: 'Bangalore, India', value: 'bangalore', country: 'India' },
  { label: 'Paris, France', value: 'paris', country: 'France' },
  { label: 'Bogotá, Colombia', value: 'bogota', country: 'Colombia' },
  { label: 'Jakarta, Indonesia', value: 'jakarta', country: 'Indonesia' },
  { label: 'Chennai, India', value: 'chennai', country: 'India' },
  { label: 'Lima, Peru', value: 'lima', country: 'Peru' },
  { label: 'Bangkok, Thailand', value: 'bangkok', country: 'Thailand' },
  { label: 'Seoul, South Korea', value: 'seoul', country: 'South Korea' },
  { label: 'Nagoya, Japan', value: 'nagoya', country: 'Japan' },
  { label: 'Hyderabad, India', value: 'hyderabad', country: 'India' },
  { label: 'London, United Kingdom', value: 'london', country: 'United Kingdom' },
  { label: 'Tehran, Iran', value: 'tehran', country: 'Iran' },
  { label: 'Chicago, United States', value: 'chicago', country: 'United States' },
  { label: 'Chengdu, China', value: 'chengdu', country: 'China' },
  { label: 'Nanjing, China', value: 'nanjing', country: 'China' },
  { label: 'Wuhan, China', value: 'wuhan', country: 'China' },
  { label: 'Ho Chi Minh City, Vietnam', value: 'ho_chi_minh_city', country: 'Vietnam' },
  { label: 'Luanda, Angola', value: 'luanda', country: 'Angola' },
  { label: 'Ahmedabad, India', value: 'ahmedabad', country: 'India' },
  { label: 'Kuala Lumpur, Malaysia', value: 'kuala_lumpur', country: 'Malaysia' },
  { label: 'Xi\'an, China', value: 'xian', country: 'China' },
  { label: 'Hong Kong, China', value: 'hong_kong', country: 'China' },
  { label: 'Dongguan, China', value: 'dongguan', country: 'China' },
  { label: 'Hangzhou, China', value: 'hangzhou', country: 'China' },
  { label: 'Surat, India', value: 'surat', country: 'India' },
  { label: 'Suzhou, China', value: 'suzhou', country: 'China' },
  { label: 'Houston, United States', value: 'houston', country: 'United States' },
  { label: 'Nairobi, Kenya', value: 'nairobi', country: 'Kenya' },
  { label: 'Baghdad, Iraq', value: 'baghdad', country: 'Iraq' },
  { label: 'Santiago, Chile', value: 'santiago', country: 'Chile' },
  { label: 'Riyadh, Saudi Arabia', value: 'riyadh', country: 'Saudi Arabia' },
  { label: 'Miami, United States', value: 'miami', country: 'United States' },
  { label: 'Madrid, Spain', value: 'madrid', country: 'Spain' },
  { label: 'Belo Horizonte, Brazil', value: 'belo_horizonte', country: 'Brazil' },
  { label: 'Pune, India', value: 'pune', country: 'India' },
  { label: 'Harbin, China', value: 'harbin', country: 'China' },
  { label: 'Dallas, United States', value: 'dallas', country: 'United States' },
  { label: 'Toronto, Canada', value: 'toronto', country: 'Canada' },
  { label: 'Singapore, Singapore', value: 'singapore', country: 'Singapore' },
  { label: 'Addis Ababa, Ethiopia', value: 'addis_ababa', country: 'Ethiopia' },
  { label: 'Atlanta, United States', value: 'atlanta', country: 'United States' },
  { label: 'Fukuoka, Japan', value: 'fukuoka', country: 'Japan' },
  { label: 'Khartoum, Sudan', value: 'khartum', country: 'Sudan' },
  { label: 'Barcelona, Spain', value: 'barcelona', country: 'Spain' },
  { label: 'Johannesburg, South Africa', value: 'johannesburg', country: 'South Africa' },
  { label: 'Saint Petersburg, Russia', value: 'saint_petersburg', country: 'Russia' },
  { label: 'Qingdao, China', value: 'qingdao', country: 'China' },
  { label: 'Dalian, China', value: 'dalian', country: 'China' },
  { label: 'Washington D.C., United States', value: 'washington_dc', country: 'United States' },
  { label: 'Yangon, Myanmar', value: 'yangon', country: 'Myanmar' },
  { label: 'Alexandria, Egypt', value: 'alexandria', country: 'Egypt' },
  { label: 'Jinan, China', value: 'jinan', country: 'China' },
  { label: 'Guadalajara, Mexico', value: 'guadalajara', country: 'Mexico' },
  { label: 'Casablanca, Morocco', value: 'casablanca', country: 'Morocco' },
  { label: 'Melbourne, Australia', value: 'melbourne', country: 'Australia' },
  { label: 'Sydney, Australia', value: 'sydney', country: 'Australia' },
  { label: 'Abidjan, Ivory Coast', value: 'abidjan', country: 'Ivory Coast' },
  { label: 'Busan, South Korea', value: 'busan', country: 'South Korea' },
  { label: 'Cape Town, South Africa', value: 'cape_town', country: 'South Africa' },
  { label: 'Durban, South Africa', value: 'durban', country: 'South Africa' },
  { label: 'Berlin, Germany', value: 'berlin', country: 'Germany' },
  { label: 'Rome, Italy', value: 'rome', country: 'Italy' },
  { label: 'Montreal, Canada', value: 'montreal', country: 'Canada' },
  { label: 'Vancouver, Canada', value: 'vancouver', country: 'Canada' },
  { label: 'Milan, Italy', value: 'milan', country: 'Italy' },
  { label: 'Lisbon, Portugal', value: 'lisbon', country: 'Portugal' },
  { label: 'Vienna, Austria', value: 'vienna', country: 'Austria' },
  { label: 'Amsterdam, Netherlands', value: 'amsterdam', country: 'Netherlands' },
  { label: 'Brussels, Belgium', value: 'brussels', country: 'Belgium' },
  { label: 'Prague, Czech Republic', value: 'prague', country: 'Czech Republic' },
  { label: 'Copenhagen, Denmark', value: 'copenhagen', country: 'Denmark' },
  { label: 'Dublin, Ireland', value: 'dublin', country: 'Ireland' },
  { label: 'Helsinki, Finland', value: 'helsinki', country: 'Finland' },
  { label: 'Oslo, Norway', value: 'oslo', country: 'Norway' }
];


export default function Home() {

  const [selectedFruit, setSelectedFruit] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  return (
    <main className='bg-yellow'><h1 className='p-4'>Hello</h1>

      <div style={{display:'flex'}}>

      <Dropdown
          options={options}
          value={selectedFruit}
          onChange={setSelectedFruit}
        />
        <Dropdown
          options={cities}
          value={selectedCity}
          onChange={setSelectedCity}
        />
      </div>
    </main>
  )
}
