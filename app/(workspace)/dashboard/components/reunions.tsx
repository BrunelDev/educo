import { Meeting, MeetingComponentProps, TagType } from "@/lib/types";
import Image from "next/image";

const meetings: Meeting[] = [
  {
    id: 1,
    type: "Reunion",
    date: "2022-07-15",
    time: "10:00",
    title: "Meeting avec Dr. Alice",
    description: "Nouvelle décision importante pour la société",
    participants: ["", ""],
    tags: [TagType.Online, TagType.InPerson],
  },
  {
    id: 1,
    type: "Reunion",
    date: "2022-07-15",
    time: "10:00",
    title: "Meeting avec Dr. Alice",
    description: "Nouvelle décision importante pour la société",
    participants: ["", ""],
    tags: [TagType.Online, TagType.InPerson],
  },
  {
    id: 1,
    type: "Reunion",
    date: "2022-07-15",
    time: "10:00",
    title: "Meeting avec Dr. Alice",
    description: "Nouvelle décision importante pour la société",
    participants: ["", ""],
    tags: [TagType.Online, TagType.InPerson],
  },
  {
    id: 1,
    type: "Reunion",
    date: "2022-07-15",
    time: "10:00",
    title: "Meeting avec Dr. Alice",
    description: "Nouvelle décision importante pour la société",
    participants: ["", ""],
    tags: [TagType.Online, TagType.InPerson],
  },
  {
    id: 1,
    type: "Reunion",
    date: "2022-07-15",
    time: "10:00",
    title: "Meeting avec Dr. Alice",
    description: "Nouvelle décision importante pour la société",
    participants: ["", ""],
    tags: [TagType.Online, TagType.InPerson],
  },
];
export default function Reunions() {
  return (
    <div className="flex flex-col gap-4">
      <h6>Réunins à venir</h6>
      <div className="flex flex-col gap-4">{meetings.map((meeting, index) => (
        <ReunionComponent key={meeting.id + index} meeting={meeting} />
      ))}</div>
      
    </div>
  );
}

const ReunionComponent = ({ meeting }: MeetingComponentProps) => {
  return (
    <div className="bg-[#FFFFFF99] flex flex-col gap-3 h-[142px] w-full rounded-[12px] p-3 text-white-800">
      <div className="flex justify-between ">
        <div className="flex gap-2 items-center">
          <div className="bg-crimson-100 w-2 h-2 rounded-full">
          </div>

            <h6 className="font-bold text-[13px]">{meeting.type}</h6>
        </div>
        <div className="flex gap-2 font-medium text-xs items-center">
          <Image src={"/calendar-icon.svg"} width={12} height={12} alt="calendar icon"/>
          <h6>{meeting.date} :</h6>
          <h6>{meeting.time}</h6>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <h6 className="font-extrabold text-[14px]">{meeting.title}</h6>
        <div className="cursor-pointer"><Image src={"/dots-icon.svg"} width={13.5} height={1.5} alt="calendar icon"/></div>
        
      </div>
      <h6 className="text-sm">{meeting.description}</h6>
      <div className="flex gap-2">
        {meeting.tags.map((tag, index) => (
          <div
            className="bg-white-50 flex justify-center items-center p-1"
            key={tag + index}
          >
            <h6 className="text-sm">{tag}</h6>
          </div>
        ))}
      </div>
    </div>
  );
};
