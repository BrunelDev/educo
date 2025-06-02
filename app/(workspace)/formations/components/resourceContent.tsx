import { getRessources, RessourcesResponse } from '@/lib/api/formations'
import { useEffect, useState } from 'react'
import { RessourceCard } from './RessourceCards'
import EmptyState from '@/app/_components/EmptyState'

export default function ResourceContent() {
  const [ressources, setRessources] = useState<RessourcesResponse>()
  useEffect(() => {
    
    const fetchData = async () => {
      const data = await getRessources()
      setRessources(data)
    }
    fetchData()
  }, [])
if(ressources?.results.length === 0){
  return <EmptyState title="Aucune ressource trouvée" description="" />
}
  return (
    <div>
      <div className='flex flex-wrap gap-3'>{ressources?.results.map((ressource, index) => (
        <RessourceCard ressource={ressource} key={ressource.id + index} />
      ))}</div>
      
    </div>
  )
}
