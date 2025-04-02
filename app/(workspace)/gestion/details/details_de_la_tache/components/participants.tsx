import React from 'react'
import Image from 'next/image'
import { Minus } from 'lucide-react';


interface ParticipantComponentProps {
  participant: {
    id: number;
    email: string;
    nom_complet: string;
    photo: string;
} 
}
export default function ParticipantComponent({ participant } : ParticipantComponentProps) {
  return (
    <div className='w-[320px] p-4 flex justify-between bg-[#FFFFFF99] rounded-[8px]'>
          <Image src={"/userProfile-img.png"} width={36} height={36} alt={`${participant.nom_complet } profile image`} className='rounded-full' />
          <h6 className='w-2/3 truncate'>{participant.nom_complet}</h6>
          <Minus />
    </div>
  )
}
