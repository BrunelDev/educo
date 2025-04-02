import React from 'react'
import { MeetingDocument } from '@/lib/types'
import { File } from 'lucide-react'
import Link from 'next/link'

export default function DocumentComponent({ document } : {document :MeetingDocument}) {
  return (
      <div className='bg-[#FFFFFF99] w-fit flex gap-3 rounded-[8px] p-3'>
          <Link href={document.fichier}>
          <div className='flex justify-center items-center'>
                  <File className='text-coral-500' />
                  <h6>{ document.nom_fichier}</h6>
          </div></Link>
          
      
    </div>
  )
}
