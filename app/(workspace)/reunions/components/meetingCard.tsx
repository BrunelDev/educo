import { Meeting } from "@/lib/types";
import {
  CalendarDays,
  Check,
  Download,
  Ellipsis,
  FilePenLine,
  LucideIcon,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Popover } from "../../components/popover";

interface MeetingCatdProps {
  meeting: Meeting;
}

export default function MeetingCard({ meeting }: MeetingCatdProps) {
  return (
    <div className="bg-[#FFFFFF99] rounded-[8px] py-2 px-3 w-[350px] relative">
      <Link
        href={`/reunions/details_de_la_reunion/${meeting.id}`}
        className="flex flex-col gap-2"
      >
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-coral-100"></div>{" "}
              <h6 className="text-xs font-semibold">{meeting.type_reunion}</h6>
            </div>
            <h3 className="font-bold">{meeting.titre}</h3>
            <p className="text-sm text-gray-600 text-nowrap">{meeting.objet}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="w-fit flex gap-2 text-xs">
            <CalendarDays size={14} />
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
            {meeting.participants && meeting.participants.length > 0 ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                <span className="text-xs text-gray-600">
                  +{meeting.participants.length}
                </span>
              </div>
            ) : null}
          </div>

          <div
            className={`w-6 h-6 rounded-full bg-white-50 border border-crimson-200 flex justify-center items-center cursor-pointer`}
          >
            {new Date(meeting.date_heure).getTime() < new Date().getTime() && (
              <Check color="#FF264F" size={18} />
            )}
          </div>
        </div>
      </Link>
      <Popover
        PopoverContent={<PopoverContent />}
        PopoverTrigger={
          <div className="p-1 absolute right-2 top-3 z-50 hover:bg-white-100 flex justify-center items-center rounded-[8px]">
            <Ellipsis size={20} />
          </div>
        }
      />
    </div>
  );
}

interface PopoverContent {
  label: string;
  handleClick: () => void;
  icon?: LucideIcon;
}

const deleteItem = () => {
  console.log("delete");
};
const download = () => {
  console.log("delete");
};
const rename = () => {
  console.log("delete");
};

const PopoverContent = () => {
  const content = [
    {
      label: "Télécharger",
      icon: Download,
      handleClick: download,
    },
    {
      label: "Renommer",
      icon: FilePenLine,
      handleClick: rename,
    },
    {
      label: "Supprimer",
      icon: Trash2,
      handleClick: deleteItem,
    },
  ];
  return (
    <div className="py-2 px-1 text-sm w-[125px] flex flex-col gap-[6px]">
      {content.map((content, i) => {
        const Icon = content.icon;
        return (
          <div
            key={content.label + i}
            className="hover:bg-gray-100 cursor-pointer rounded-[4px] px-2 flex  items-center justify-around py-1"
            onClick={() => {
              content.handleClick();
            }}
          >
            {Icon ? <Icon size={18} /> : null}
            <h6>{content.label}</h6>
          </div>
        );
      })}
    </div>
  );
};
