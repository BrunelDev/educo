"use client"
import { Button } from '@/components/ui/button'
import { getUser, logout, User } from '@/lib/api/users'
import { getCookies } from '@/lib/utils/cookies'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FirstBox, SecondBox, ThirdBox } from './components/box'

export default function Profile() {
  const userInfo: User = JSON.parse(getCookies("userInfo") || "{}");
   const [user, setUser] = useState<User>(userInfo);
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const res = await getUser();
          setUser(res);
        } catch (error) {
console.error(error)
          ;
        }
      };
      fetchUser();
    }, []);
  const router = useRouter()
  return (
    <div className='flex flex-col gap-4 sm:gap-6 w-full px-3 sm:px-6 relative pt-16 sm:pt-6 pb-6 max-w-6xl mx-auto'>
      {/* Profile sections */}
      <div className='space-y-4 sm:space-y-6'>
        <FirstBox user={user} />
        <SecondBox user={user} />
        <ThirdBox user={user} />
      </div>
      
      {/* Logout button */}
      <Button 
        variant="destructive" 
        onClick={() => {
          logout()
          router.replace("/login")
        }}
        className='w-full max-w-[200px] mx-auto sm:w-fit sm:max-w-none sm:mx-0 absolute top-3 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 sm:-top-11 cursor-pointer text-sm sm:text-base'
      >
        Se déconnecter
      </Button>
    </div>
  )
}
