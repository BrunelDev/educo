"use client";
import EmptyState from "@/app/_components/EmptyState";
import LexicalView from "@/app/_components/LexicalView";
import { getMeetings } from "@/lib/api/reunion";
import { formatDateToFrench } from "@/lib/functions";
import { Meeting, MeetingComponentProps } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Reunions() {
  const [meetings, setMeetings] = useState<Meeting[]>();
  useEffect(() => {
    const fetchMeetings = async () => {
      const response = await getMeetings();
      setMeetings(response.results);
    };
    fetchMeetings();
  }, []);
  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-[14px]">Réunions à venir</h3>
        <Link href={"/reunions"} className="underline text-xs text-coral-500">
          Tout Voir
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {meetings && meetings.length > 0 ? (
          meetings
            .slice(0, 3)
            .map((meeting, index) => (
              <ReunionComponent key={meeting.id + index} meeting={meeting} />
            ))
        ) : (
          <EmptyState
            title="Aucune réunion à venir"
            description="Il n'y a pas de réunions planifiées pour le moment."
          />
        )}
      </div>
    </div>
  );
}

const ReunionComponent = ({ meeting }: MeetingComponentProps) => {
  return (
    <div className="bg-[#FFFFFF99] flex flex-col gap-3 min-h-[142px] h-auto w-full rounded-[12px] p-3 text-white-800 truncate">
      <div className="flex flex-col sm:flex-row sm:justify-between">
        <div className="flex gap-2 items-center">
          <div className="bg-crimson-100 w-2 h-2 rounded-full"></div>

          <h6 className="font-bold text-[13px]">{meeting.type_reunion}</h6>
        </div>
        <div className="flex gap-2 font-medium text-xs items-center">
          <Image
            src={"/calendar-icon.svg"}
            width={12}
            height={12}
            alt="calendar icon"
          />
          <h6>{formatDateToFrench(meeting.date_heure_debut.toLocaleString())}</h6>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1 sm:gap-0">
        <h6 className="font-extrabold text-[14px] text-wrap">
          {meeting.titre}
        </h6>
      </div>
      <p className="text-sm break-all">{meeting.objet}</p>
      <div className="flex flex-wrap gap-2">
        {meeting.ordre_du_jour.map((ordre, index) => (
          <div
            className="bg-white-50 flex justify-center items-center p-1 "
            key={ordre.description.length + index}
          >
            <LexicalView editorStateJSON={ordre.description} />
          </div>
        ))}
      </div>
    </div>
  );
};
