import { Input } from '@/components/ui/input'
import { getTeams, Team } from '@/lib/api/equipe'
import { useEffect, useState } from 'react'

export default function ProjectForm() {
    const [teamMembers, setTeamMembers] =useState<Team[]>()
    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await getTeams()
                setTeamMembers(response.results)
            } catch (error) {
                console.error("Error fetching team members", error)
                throw error
                
            }
        }
        fetchTeamMembers()
    }, [])
  return (
    <div className="flex flex-col gap-6">
      <h6>Equipe</h6>
      <Contact />
      <div className="flex justify-between">
        <h6>{teams?.results.length} associés</h6>
        <div className="flex gap-3 items-center ">
          <SearchBar
            value={searchValue}
            handleChange={setSearchValue}
            placeholder={"Recherhcer"}
          />{" "}
          <div className="w-full">
            <DialogComponent
              className={"sm:max-w-[768px]"}
              dialoTrigger={
                <Button
                  variant={"default"}
                  className="cursor-pointer bg-gradient-to-r from-[#FE6539] to-crimson-400"
                >
                  <Plus /> Ajouter une organisation
                </Button>
              }
              dialogContent={<AddOrganisation/>}
              dialogTitle={null}
            />
            <DialogComponent
              dialoTrigger={
                <Button
                  variant={"default"}
                  className="cursor-pointer bg-gradient-to-r from-[#FE6539] to-crimson-400"
                >
                  <Plus /> Ajouter un membre
                </Button>
              }
              dialogContent={teams?.results[0] ? <AddMemberDialog teamId={teams?.results[0].id} /> : <div></div>}
              dialogTitle={null}
            />
          </div>
        </div>
      </div>
      <div>
        {teams
          ? teams.results.map((team, index) => (
              <div key={index + team.id} className="flex flex-wrap gap-6">
                {team.membres.map((member, index) => (
                  <AssociateCard key={member.id + index} associate={member} />
                ))}
              </div>
            ))
          : null}
      </div>
      {/*<div className="flex flex-wrap gap-6">
        {associates.map((associate, index) => (
          <AssociateCard key={associate.id + index} associate={associate} />
        ))}
      </div>*/}
    </div>
  )
}
