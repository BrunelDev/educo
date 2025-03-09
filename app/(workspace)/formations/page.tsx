"use client"
import { useState } from 'react'
import Tabs from './components/tabs'
import { TabsState } from '@/lib/types'
import WebinarContent from './components/webinarContent'
import ResourceContent from './components/resourceContent'
import SearchBar from '../components/searchBar'

export default function Formations() {
  const [searchValue, setSearchValue] = useState<string>("")
      const [activeTab, setActiveTab] =useState<TabsState>(TabsState.Webinaires)
  
  return (
    <div>
      <h6>Formations</h6>
      
      <div className='flex justify-between items-center'>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <SearchBar value={searchValue} handleChange={setSearchValue} placeholder='Rechercher'/>
      </div>
      {activeTab === TabsState.Webinaires ? <WebinarContent/> : <ResourceContent/>}
      
    </div>
  )
}
