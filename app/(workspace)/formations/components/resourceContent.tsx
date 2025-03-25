import { getRessources, Ressource, RessourcesResponse } from '@/lib/api/formations'
import { useEffect, useState } from 'react'

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
      {ressources && JSON.stringify(ressources)}
    </div>
  )
}
