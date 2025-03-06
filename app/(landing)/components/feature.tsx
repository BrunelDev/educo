import Image from 'next/image';
import { JSX } from 'react';

interface FeatureProps {
    imageUrl: string;
    title: JSX.Element;
    description: string;
  
}
export default function Feature({imageUrl, title, description} : FeatureProps) {
  return (
      <div className='h-fit flex flex-col gap-3'>
          <Image src={imageUrl} width={500} height={500} alt='feature image' className='w-[90%]' />
          <h6 className="text-2xl font-extrabold text-white-800 w-[90%]">
          {title}
          </h6>
          <p className='w-[90%] text-sm text-white-800'>
              {description}
          </p>
      
    </div>
  )
}
