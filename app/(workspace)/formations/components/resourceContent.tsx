import { getRessources, RessourcesResponse } from '@/lib/api/formations'
import { useEffect, useState } from 'react'
import { RessourceCard } from './RessourceCards'

export default function ResourceContent() {
  const [ressources, setRessources] = useState<RessourcesResponse>()
  useEffect(() => {
    
    const fetchData = async () => {
      const data = await getRessources()
      setRessources(data)
    }
    fetchData()
  }, [])
  return (
    <div>
      <div className='flex flex-wrap gap-3'>{ressources && ressources.results.map((ressource, index) => (
        <RessourceCard ressource={ressource} key={ressource.id + index} />
      ))}</div>
      
    </div>
  )
}
