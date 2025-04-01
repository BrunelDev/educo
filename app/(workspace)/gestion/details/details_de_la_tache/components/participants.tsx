import React from 'react'
import Image from 'next/image'
import { Minus } from 'lucide-react';
import { TaskUser } from '@/lib/api/tache';


interface ParticipantComponentProps {
  participant: TaskUser; 
}
export default function ParticipantComponent({ participant } : ParticipantComponentProps) {
  return (
    <div className='w-[320px] p-4 flex justify-between bg-[#FFFFFF99]'>
          <Image src={"/userProfile-img.png"} width={36} height={36} alt={`${participant.first_name + " " + participant.last_name} profile image`} className='rounded-full' />
          <h6>{participant.first_name + " " + participant.last_name}</h6>
          <Minus />
    </div>
  )
}
