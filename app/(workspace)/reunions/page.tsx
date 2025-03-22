"use client";
import { Button } from "@/components/ui/button";
import { MeetingType } from "@/lib/types";
import { useEffect, useState } from "react";
import MeetingCard from "./components/meetingCard";
import { DialogComponent } from "@/app/_components/dialogComponent";
import CreateMeeting from "./components/createMeeting";
export { DialogComponent } from "@/app/_components/dialogComponent"
import { useMeetingStore } from "@/store/meetings"
import {getMeetings} from "@/lib/api/reunion"

export default function Reunions() {
  const [filterValue, setFilterValue] = useState<string>("all");
  /*const meetings: MeetingCardProps[] = [
    {
      title: "Réunion CSE Mensuelle",
      subtitle: "Discussion des points clés du mois",
      date: "2024-03-15",
      time: "10:00",
      attendees: [
        { name: "Marie Durant", imageUrl: "/avatars/marie.jpg" },
        { name: "Thomas Bernard", imageUrl: "/avatars/thomas.jpg" },
        { name: "Sophie Martin", imageUrl: "/avatars/sophie.jpg" },
      ],
      remainingAttendees: 2,
      isOnline: true,
      isInPerson: false,
      isFinished: false,
      meetingType: MeetingType.CSSCT,
    },
    {
      title: "Point Sécurité Trimestriel",
      subtitle: "Revue des incidents et mesures préventives",
      date: "2024-03-20",
      time: "14:30",
      attendees: [
        { name: "Pierre Dubois", imageUrl: "/avatars/pierre.jpg" },
        { name: "Julie Lefebvre", imageUrl: "/avatars/julie.jpg" },
      ],
      remainingAttendees: 0,
      isOnline: false,
      isInPerson: true,
      isFinished: true,
      meetingType: MeetingType.Extraordinal,
    },
    {
      title: "Formation CSSCT",
      subtitle: "Module avancé sur les risques psychosociaux",
      date: "2024-03-25",
      time: "09:00",
      attendees: [
        { name: "Lucas Moreau", imageUrl: "/avatars/lucas.jpg" },
        { name: "Emma Richard", imageUrl: "/avatars/emma.jpg" },
        { name: "Hugo Martin", imageUrl: "/avatars/hugo.jpg" },
      ],
      remainingAttendees: 5,
      isOnline: true,
      isInPerson: true,
      isFinished: false,
      meetingType: MeetingType.Ordinary,
    },
  ];*/
  type FilterType = "all" | MeetingType;

  // Filter function
  const filterMeetings = (filter: FilterType) => {
    switch (filter) {
      case "all":
        return meetings;
      case MeetingType.Ordinary:
        return meetings.filter(
          (meeting) => meeting.type_reunion === MeetingType.Ordinary
        );
      case MeetingType.Extraordinal:
        return meetings.filter(
          (meeting) => meeting.type_reunion === MeetingType.Extraordinal
        );
      case MeetingType.Others:
        return meetings.filter(
          (meeting) => meeting.type_reunion === MeetingType.Others
        );
      case MeetingType.CSSCT:
        return meetings.filter(
          (meeting) => meeting.type_reunion === MeetingType.CSSCT
        );
      default:
        return meetings;
    }
  };
  const handleClick = (filterValue: string) => {
    setFilterValue(filterValue);
    setFilteredMeetings(filterMeetings(filterValue as FilterType));
  };

  const {meetings, setMeetings} = useMeetingStore()
  const [filteredMeeting, setFilteredMeetings] = useState(meetings);
  useEffect(() => {
    const handler = async () => {
      try {
        const data = await getMeetings()
        setMeetings(data?.results)
        console.log(data?.results);
        
      } catch (error : unknown) {
        console.error("Error fetching meetings:", (error as Error).message);
        
      }
      
    }
    handler()
    
  }, [setMeetings])
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row gap-2">
        <Button
          className={`cursor-pointer ${filterValue === "all" ? "bg-gradient-to-r from-[#FE6539] to-crimson-400" : "bg-[#FFFFFF99] border border-white-50 text-white-800 hover:bg-coral-50"}`}
          variant={"default"}
          onClick={() => {
            handleClick("all");
          }}
        >
          Toutes
        </Button>
        <Button
          className={`cursor-pointer ${filterValue === MeetingType.CSSCT ? "bg-gradient-to-r from-[#FE6539] to-crimson-400" : "bg-[#FFFFFF99] border border-white-50 text-white-800 hover:bg-coral-50"}`}
          variant={"default"}
          onClick={() => {
            handleClick(MeetingType.CSSCT);
          }}
        >
          CSSCT
        </Button>
        <Button
          className={`cursor-pointer ${filterValue === MeetingType.Ordinary ? "bg-gradient-to-r from-[#FE6539] to-crimson-400" : "bg-[#FFFFFF99] border border-white-50 text-white-800 hover:bg-coral-50"}`}
          variant={"default"}
          onClick={() => {
            handleClick(MeetingType.Ordinary);
          }}
        >
          Ordinaire
        </Button>
        <Button
          className={`cursor-pointer ${filterValue === MeetingType.Extraordinal ? "bg-gradient-to-r from-[#FE6539] to-crimson-400" : "bg-[#FFFFFF99] border border-white-50 text-white-800 hover:bg-coral-50"}`}
          variant={"default"}
          onClick={() => {
            handleClick(MeetingType.Extraordinal);
          }}
        >
          Extraordinaire
        </Button>
        <Button
          className={`cursor-pointer ${filterValue === MeetingType.Others ? "bg-gradient-to-r from-[#FE6539] to-crimson-400" : "bg-[#FFFFFF99] border border-white-50 text-white-800 hover:bg-coral-50"}`}
          variant={"default"}
          onClick={() => {
            handleClick(MeetingType.Others);
          }}
        >
          Autres
        </Button>
      </div>
      <div>
        <h6 className="mb-4">Réunions à venir</h6>
        <div className="w-full flex flex-row flex-wrap gap-5">
        {filteredMeeting.map((meeting, index) => (
          <MeetingCard meeting={meeting} key={meeting.titre + index} />
        ))}
        </div>
      </div>
      <div>
        <h6 className="mb-4">Historique des Réunions</h6>
        <div className="w-full flex flex-row flex-wrap gap-5">
        {meetings.length>0 && meetings?.map((meeting, index) => (
          <MeetingCard meeting={meeting} key={meeting.titre + index} />
        ))}
        </div>
      </div>
      <DialogComponent dialogTitle={null}  className={"sm:max-w-[980px] flex items-center justify-center p-0"} dialoTrigger={<Button>Créer une nouvelle réunion</Button>} dialogContent={<CreateMeeting/>}/>
      
      
    </div>
  );
}
