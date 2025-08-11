"use client";
import { DialogComponent } from "@/app/_components/dialogComponent";
import { Button } from "@/components/ui/button";
import { getMeetings } from "@/lib/api/reunion";
import { Meeting, MeetingType } from "@/lib/types";
import { useMeetingStore } from "@/store/meetings";
import { useEffect, useState } from "react";
import CreateMeeting from "./components/createMeeting";
import MeetingCard from "./components/meetingCard";
import EmptyState from "@/app/_components/EmptyState";

export default function Reunions() {
  const [filterValue, setFilterValue] = useState<string>("all");
  const { meetings, setMeetings } = useMeetingStore();
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[] | null>(null);
  const [pastMeetings, setPastMeetings] = useState<Meeting[] | null>(null);

  type FilterType = "all" | MeetingType;

  // Filter function
  const processMeetings = (filter: FilterType) => {
    if (!meetings || !Array.isArray(meetings)) {
      return { upcoming: [], past: [] };
    }

    const now = new Date();

    const typeFilteredMeetings = 
      !filter || filter === "all"
        ? meetings
        : meetings.filter((meeting) => meeting.type_reunion === filter);

    const upcoming = typeFilteredMeetings.filter(meeting => {
      const meetingDate = new Date(meeting.date_heure_debut);
      return meetingDate > now;
    });

    const past = typeFilteredMeetings.filter(meeting => {
      const meetingDate = new Date(meeting.date_heure_debut);
      return meetingDate <= now;
    });

    return { upcoming, past };
  };

  const handleClick = (newFilterValue: string) => {
    setFilterValue(newFilterValue);
    const { upcoming, past } = processMeetings(newFilterValue as FilterType);
    setUpcomingMeetings(upcoming);
    setPastMeetings(past);
  };

  // Update upcoming and past meetings when main meetings or filterValue change
  useEffect(() => {
    const { upcoming, past } = processMeetings(filterValue as FilterType);
    setUpcomingMeetings(upcoming);
    setPastMeetings(past);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetings, filterValue]); // Note: processMeetings is stable if meetings/filterValue are its only deps indirectly


  // Fetch meetings on component mount
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await getMeetings();
        setMeetings(data.results);
        console.log("Fetched meetings:", data);
      } catch (error: unknown) {
        console.error("Error fetching meetings:", (error as Error).message);
      }
    };
    fetchMeetings();
  }, [setMeetings]);

 

  return (
    <div className="flex flex-col gap-5 relative">
      <div className="flex flex-row flex-wrap gap-2">
        <Button
          className={`cursor-pointer ${
            filterValue === "all"
              ? "bg-gradient-to-r from-[#FE6539] to-crimson-400"
              : "bg-[#FFFFFF99] border border-white-50 text-white-800 hover:bg-coral-50"
          }`}
          variant={"default"}
          onClick={() => {
            handleClick("all");
          }}
        >
          Toutes
        </Button>
        <Button
          className={`cursor-pointer ${
            filterValue === MeetingType.CSSCT
              ? "bg-gradient-to-r from-[#FE6539] to-crimson-400"
              : "bg-[#FFFFFF99] border border-white-50 text-white-800 hover:bg-coral-50"
          }`}
          variant={"default"}
          onClick={() => {
            handleClick(MeetingType.CSSCT);
          }}
        >
          CSSCT
        </Button>
        <Button
          className={`cursor-pointer ${
            filterValue === MeetingType.Ordinary
              ? "bg-gradient-to-r from-[#FE6539] to-crimson-400"
              : "bg-[#FFFFFF99] border border-white-50 text-white-800 hover:bg-coral-50"
          }`}
          variant={"default"}
          onClick={() => {
            handleClick(MeetingType.Ordinary);
          }}
        >
          Ordinaire
        </Button>
        <Button
          className={`cursor-pointer ${
            filterValue === MeetingType.Extraordinal
              ? "bg-gradient-to-r from-[#FE6539] to-crimson-400"
              : "bg-[#FFFFFF99] border border-white-50 text-white-800 hover:bg-coral-50"
          }`}
          variant={"default"}
          onClick={() => {
            handleClick(MeetingType.Extraordinal);
          }}
        >
          Extraordinaire
        </Button>
        <Button
          className={`cursor-pointer ${
            filterValue === MeetingType.Others
              ? "bg-gradient-to-r from-[#FE6539] to-crimson-400"
              : "bg-[#FFFFFF99] border border-white-50 text-white-800 hover:bg-coral-50"
          }`}
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
          {upcomingMeetings && upcomingMeetings?.length > 0 ? (
            upcomingMeetings.map((meeting) => (
              <MeetingCard
                key={meeting.id} // Use unique ID instead of title + index
                meeting={meeting}
              />
            ))
          ) : (
              <div className="w-full flex justify-center items-center">
                <EmptyState title={"Aucune réunion à venir"} description={"Veuillez patienter"}/>
              </div>
            
          )}
        </div>
      </div>
      <div>
        <h6 className="mb-4">Historique des Réunions</h6>
        <div className="w-full flex flex-row flex-wrap gap-5">
          {pastMeetings && pastMeetings?.length > 0 ? (
            pastMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))
          ) : (
            <div className="w-full flex justify-center items-center">
              
                <EmptyState title={"Aucun historique de réunion"} description={"Veuillez patienter"} />
        </div>
                
          )}
        </div>
      </div>
      <DialogComponent
        dialogTitle={null}
        className={"sm:max-w-[980px] flex items-center justify-center p-0"}
        dialoTrigger={
          <Button
            className={`cursor-pointer bg-gradient-to-r from-[#FE6539] to-crimson-400 w-full mt-4 md:w-fit md:absolute md:-top-10 md:right-6 md:mt-0`}
            variant={"default"}
          >
            Créer une nouvelle réunion
          </Button>
        }
        dialogContent={<CreateMeeting />}
      />
    </div>
  );
}
