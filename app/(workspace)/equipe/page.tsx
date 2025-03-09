"use client"
import { useState } from 'react'
import Contact from './components/contact'
import AssociateCard from './components/associateCard'
import { AssociateProps } from '@/lib/types'
import SearchBar from '../components/searchBar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function Equipe() {
  const associates: AssociateProps[] = [
    {
      profileImageUrl: "/userProfile-img.png",
      name: "alice.smith@example.com",
      email: "Alice Smith",
      id: "541"
    },{
      profileImageUrl: "/userProfile-img.png",
      name: "alice.smith@example.com",
      email: "Alice Smith",
      id: "541"
    },{
      profileImageUrl: "/userProfile-img.png",
      name: "alice.smith@example.com",
      email: "Alice Smith",
      id: "541"
    },{
      profileImageUrl: "/userProfile-img.png",
      name: "alice.smith@example.com",
      email: "Alice Smith",
      id: "541"
    },{
      profileImageUrl: "/userProfile-img.png",
      name: "alice.smith@example.com",
      email: "Alice Smith",
      id: "541"
    },

  ]
  const [searchValue, setSearchValue] = useState<string>("")
  return (
    <div className='flex flex-col gap-6'>
      <h6>Equipe</h6>
      <Contact />
      <div className='flex justify-between'>
        <h6>{associates.length} associés</h6>
        <div className='flex gap-3 items-center'>
          <SearchBar value={searchValue} handleChange={setSearchValue} placeholder={'Recherhcer'}/> <Button><Plus/> Ajouter un membre</Button>
        </div>
      </div>
      <div className='flex flex-wrap gap-6'>
        {associates.map((associate, index) => (
          <AssociateCard key={associate.id + index} associate={associate} />
        ))}
      </div>
    </div>
  )
}


