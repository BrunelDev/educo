import React from 'react'
import { FirstBox, SecondBox, ThirdBox } from './components/box'

export default function Profile() {
  return (
    <div className='flex flex-col gap-6'>
          <FirstBox />
          <SecondBox />
          <ThirdBox/>
    </div>
  )
}
