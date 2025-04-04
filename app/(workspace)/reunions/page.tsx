"use client";
import { DialogComponent } from "@/app/_components/dialogComponent";
import { Button } from "@/components/ui/button";
import { getOrganization } from "@/lib/api/organisation";
import { getMeetings } from "@/lib/api/reunion";
import { Meeting, MeetingType } from "@/lib/types";
import { useMeetingStore } from "@/store/meetings";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CreateMeeting from "./components/createMeeting";
import MeetingCard from "./components/meetingCard";
import { AxiosError } from "axios";
import EmptyState from "@/app/_components/EmptyState";

export default function Reunions() {
  const [filterValue, setFilterValue] = useState<string>("all");
  const { meetings, setMeetings } = useMeetingStore();
  const [filteredMeeting, setFilteredMeetings] = useState<Meeting[] | null>(
    meetings
  );

  type FilterType = "all" | MeetingType;

  // Filter function
  const filterMeetings = (filter: FilterType) => {
    if (!meetings || !Array.isArray(meetings)) {
      return [];
    }

    if (!filter || filter === "all") {
      return meetings;
    }

    return meetings.filter((meeting) => meeting.type_reunion === filter);
  };

  const handleClick = (filterValue: string) => {
    setFilterValue(filterValue);
    const filtered = filterMeetings(filterValue as FilterType);
    setFilteredMeetings(filtered);
  };

  // Update filtered meetings when main meetings change
  useEffect(() => {
    const filtered = filterMeetings(filterValue as FilterType);
    setFilteredMeetings(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetings, filterValue]);

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

  const router = useRouter();

  useEffect(() => {

    const getOrg = async () => {
      try {
        await getOrganization();
        
      } catch (error : unknown) {
      if (error instanceof AxiosError) {
        toast.error("Vous devez d'abord créer une organisation");
        router.push("/equipe");
      }
        
      }
      
      
    };
    getOrg();
  }, [router]);

  return (
    <div className="flex flex-col gap-5 relative">
      <div className="flex flex-row gap-2">
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
          {filteredMeeting && filteredMeeting?.length > 0 ? (
            filteredMeeting.map((meeting) => (
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
          {meetings?.length > 0 ? (
            meetings.map((meeting) => (
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
            className={`cursor-pointer bg-gradient-to-r from-[#FE6539] to-crimson-400 w-fit absolute -top-10 right-6`}
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
