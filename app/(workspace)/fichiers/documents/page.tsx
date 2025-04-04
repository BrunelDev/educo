import EmptyState from '@/app/_components/EmptyState'
import React from 'react'

export default function page() {
  return (
    <div>
      <EmptyState title={'Documents obligatoires vides'} description={'Veuillez attendre les administrateurs'}/>
    </div>
  )
}
