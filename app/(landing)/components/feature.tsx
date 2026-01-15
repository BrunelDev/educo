import Image from 'next/image';
import { JSX } from 'react';

interface FeatureProps {
  imageUrl: string;
  title: JSX.Element;
  description: string;
}

export default function Feature({ imageUrl, title, description }: FeatureProps) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
      <Image
        src={imageUrl}
        width={500}
        height={500}
        alt="feature image"
        className="w-full h-auto rounded-lg shadow-lg"
      />
      <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-white/90 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
