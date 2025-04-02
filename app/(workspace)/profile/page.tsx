"use client"
import React from 'react'
import { FirstBox, SecondBox, ThirdBox } from './components/box'
import { Button } from '@/components/ui/button'
import { logout } from '@/lib/api/users'
import { useRouter } from 'next/navigation'

export default function Profile() {
  const router = useRouter()
  return (
    <div className='flex flex-col gap-6 relative'>
          <FirstBox />
          <SecondBox />
      <ThirdBox />
      <Button variant="destructive" onClick={() => {
        logout()
        router.replace("/login")
        

      }} className='w-fit absolute right-6 -top-11 cursor-pointer'>Se déconnecter</Button>
    </div>
  )
}
