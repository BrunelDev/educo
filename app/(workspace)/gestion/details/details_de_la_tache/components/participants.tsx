import React from 'react'
import Image from 'next/image'
import { Minus } from 'lucide-react';
import { Participant } from '@/lib/types';


export default function ParticipantComponent({ participant } : Participant) {
  return (
    <div className='w-[320px] p-4 flex justify-between bg-[#FFFFFF99]'>
          <Image src={participant.profileImage} width={36} height={36} alt={`${participant.name} profile image`} className='rounded-full' />
          <h6>{participant.name}</h6>
          <h6>({participant.role})</h6>
          <Minus />
    </div>
  )
}
