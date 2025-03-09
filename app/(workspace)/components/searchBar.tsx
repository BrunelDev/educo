import React from 'react'
import { Input } from '@/components/ui/input'
import { SearchBarProps } from '@/lib/types'
import { Search } from 'lucide-react'



export default function SearchBar({value, handleChange, placeholder} : SearchBarProps) {
  return (
    <div className='w-fit relative'>
          <Input placeholder={placeholder} onChange={(e) => {
              handleChange(e.target.value)
            }} value={value} className='h-8 w-[289px] font-medium text-xs pl-8 border border-white-50 outline-none outline-0 focus:outline-none'/>
          <Search size={16} color='#464646' className='absolute top-2 left-2'/>
    </div>
  )
}
