"use client";
import { getMeetings } from "@/lib/api/reunion";
import { Meeting, MeetingComponentProps } from "@/lib/types";
import Image from "next/image";
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
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-[14px]">Réunins à venir</h3>
        <h6 className="underline text-xs text-coral-500">Tout Voir</h6>
      </div>

      <div className="flex flex-col gap-4">
        {meetings
          ? meetings
              .slice(0, 3)
              .map((meeting, index) => (
                <ReunionComponent key={meeting.id + index} meeting={meeting} />
              ))
          : null}
      </div>
    </div>
  );
}

const ReunionComponent = ({ meeting }: MeetingComponentProps) => {
  return (
    <div className="bg-[#FFFFFF99] flex flex-col gap-3 h-[142px] w-full rounded-[12px] p-3 text-white-800 truncate">
      <div className="flex justify-between ">
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
          <h6>{meeting.date_heure.toLocaleString()} :</h6>
          <h6>{meeting.date_heure.toLocaleString()}</h6>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <h6 className="font-extrabold text-[14px]">{meeting.titre}</h6>
        <div className="cursor-pointer">
          <Image
            src={"/dots-icon.svg"}
            width={13.5}
            height={1.5}
            alt="calendar icon"
          />
        </div>
      </div>
      <p className="text-sm break-all">{meeting.objet}</p>
      <div className="flex gap-2">
        {meeting.ordre_du_jour.map((tag, index) => (
          <div
            className="bg-white-50 flex justify-center items-center p-1 break-all"
            key={tag.description + index}
          >
            <h6 className="text-sm">{tag.description}</h6>
          </div>
        ))}
      </div>
    </div>
  );
};
