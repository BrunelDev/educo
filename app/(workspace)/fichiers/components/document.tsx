import { Document } from '@/lib/types';
import { Ellipsis } from 'lucide-react';
import Image from 'next/image';


export default function DocumentCard({document} : Document) {
  return (
      <div className='w-[186px] flex flex-col gap-2 justify-center items-center group hover:bg-[#ffffffdc] duration-200 rounded-[8px] relative'>
          <Image src={"/folder-icon.svg"} width={100} height={100} alt='document icon'/>
      <h6 className='text-center'>{document.name}</h6>
      <div className='w-6 h-6 justify-center items-center rounded-sm cursor-pointer hidden group-hover:flex hover:bg-coral-50 absolute top-2 right-2 duration-200'>
      <Ellipsis className=''size={18}/>
      </div>
      
    </div>
  )
}
