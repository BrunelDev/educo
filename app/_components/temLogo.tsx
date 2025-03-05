import React from 'react'
interface TempLogoProps{
    color?: string  
 
}
export default function TempLogo({color} : TempLogoProps) {
  return (
    <div className={`rounded-lg ${color ? color : "bg-coral-500"} w-8 h-8`}>
      
    </div>
  )
}
