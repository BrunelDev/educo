"use client"
import { Consultation, getOneConsultation } from '@/lib/api/consultation';
import React, { use, useEffect, useState } from 'react'

export default function ConsultationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
  }) {
  const { id } = use(params);
  const [consultation, setConsultation] = useState<Consultation>();
  useEffect(() => {
    const fetchConsultationData = async() => {
      const response = await getOneConsultation(id)
      setConsultation(response)
    }
    fetchConsultationData()
  }, [id])
  return (
    <div>
      {consultation ? JSON.stringify(consultation) : null}
    </div>
  )
}
