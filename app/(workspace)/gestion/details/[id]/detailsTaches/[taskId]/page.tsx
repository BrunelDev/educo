"use client"
import { getTaskById, Task } from '@/lib/api/tache';
import { Ellipsis, Plus, Users } from 'lucide-react';
import { use, useEffect, useState } from 'react'
import CommentInput from '../../../details_de_la_tache/components/commentInput';
import ParticipantComponent from '../../../details_de_la_tache/components/participants';

export default function DetailTache({
    params,
  }: {
    params: Promise<{ id: string }>;
    }) {
    const { id } = use(params)
    const [task, setTask] = useState<Task>()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getTaskById(parseInt(id))
                // Update the state with the fetched data
                setTask(response)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [id])
  return (
    <div className="flex flex-col gap-4">
    <div className="flex justify-between">
      <div className="space-y-1">
        <h1 className="text-lg font-bold">
          Planifier la formation des élus sur le droit du travail
        </h1>

        <h6>
          Rédiger et structurer le compte rendu de la réunion du 15 mars sur
          les sujets abordés : budget, formation des élus, actions sociales,
          etc.
        </h6>
      </div>
      <div>
        <Ellipsis />
      </div>
    </div>
    <div className="flex gap-3">
      <Users />
      <h6>Participants</h6>
      <div className="h-6 w-6 bg-[#FFFFFF] flex justify-center items-center">
        <Plus size={20}/>
      </div>
    </div>

    <div className="flex justify-between">
      <div className="grid grid-cols-2 gap-y-3 max-w-2/3 gap-x-5">
        {task?.assigned_members ? task.assigned_members.map((participant, index) => (
          <ParticipantComponent
            key={participant.id + index}
            participant={{
              id: participant.id,
              email: participant.email,
              nom_complet: participant.first_name + " " + participant.last_name,
              photo: participant.email
          }}
          />
        )) : null}
      </div>
      <div className="w-1/3">
        <CommentInput />
      </div>
        </div>
        

        <div className="flex gap-3 mt-6">
      <Users />
      <h6>Documents joints</h6>
      <div className="h-6 w-6 bg-[#FFFFFF] flex justify-center items-center">
        <Plus size={20}/>
      </div>
      </div>
  </div>
  )
}
