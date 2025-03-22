import { Meeting } from "@/lib/types";
import { CalendarDays, Check, Ellipsis } from "lucide-react";
import Image from "next/image";

interface MeetingCatdProps {
  meeting: Meeting;
}

export default function MeetingCard({meeting} : MeetingCatdProps) {
  return (
    <div className="bg-[#FFFFFF99] rounded-[8px] py-2 px-3 w-[350px] flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-coral-100"></div>{" "}
            <h6 className="text-xs font-semibold">{meeting.type_reunion}</h6>
          </div>
          <h3 className="font-bold">
            {meeting.titre}
          </h3>
          <p className="text-sm text-gray-600 text-nowrap">
            {meeting.objet}
          </p>
        </div>
        <Ellipsis />
      </div>

      <div className="flex justify-between items-center">
              
              <div className="w-fit flex gap-2 text-xs">
              <CalendarDays size={14}/>
                  <h6>{meeting.date_heure.toLocaleString()}</h6>
                  <h6>{meeting.date_heure.toLocaleString()}</h6>
              </div>

        <div className="flex gap-2">
          {meeting.emplacement == "En ligne" && (
            <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-600">
              En ligne
            </span>
          )}
          {meeting.emplacement == "En Physique" && (
            <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-600">
              En présence
            </span>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex -space-x-2">
          {meeting.participants.map((attendee, index) => (
            <Image
              key={index}
              src={attendee.utilisateur ? "/userProfile-img.png" : "null"}
              alt={`Attendee ${index + 1}`}
              width={32}
              height={32}
              className="rounded-full h-8 w-8 border-2 border-white"
            />
          ))}
          {(meeting.remainingAttendees && meeting.remainingAttendees > 0) ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
              <span className="text-xs text-gray-600">
                +{meeting.remainingAttendees}
              </span>
            </div>
          ) : null}
        </div>
        
          <div className={`w-6 h-6 rounded-full bg-white-50 border border-crimson-200 flex justify-center items-center cursor-pointer`}>{meeting.isFinished && <Check color="#FF264F" size={18}/>}</div>
        </div>
    </div>
  );
}
