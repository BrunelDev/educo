"use client";
import Image from "next/image";
import { useState } from "react";
import SearchBar from "../../components/searchBar";

export default function ConversationsList() {
    const [serachValue, setSearchValue] = useState<string>("");
    const discussionList: DiscussionProps[] = [
        { id: "1", lastMessage: "Bonjour", lastMessageHour: "10:45", speakerName: "John Doe", speakerImageUrl: "/userProfile-img.png", isLastMessageRead: true },
        { id: "2", lastMessage: "Salut", lastMessageHour: "11:45", speakerName: "Jane Doe", speakerImageUrl: "/userProfile-img.png", isLastMessageRead: false },
        { id: "3", lastMessage: "Comment allez-vous?", lastMessageHour: "12:45", speakerName: "Alice Doe", speakerImageUrl: "/userProfile-img.png", isLastMessageRead: true },
        { id: "4", lastMessage: "Je suis content", lastMessageHour: "13:45", speakerName: "Bob Doe", speakerImageUrl: "/userProfile-img.png", isLastMessageRead: false },
    ]
  return (
    <div className="h-[calc(100vh-93px)] w-[280px] flex flex-col gap-3 pt-4 px-2 text-xs">
      <h6 className="text-lg font-semibold">Messages</h6>
      <SearchBar
        value={serachValue}
        handleChange={setSearchValue}
        placeholder={"Rechercher"}
        className="w-full"
      />
      <div className="flex flex-col gap-3">
        <h6 className="font-semibold">Equipe</h6>
        <TeamGroup
          groupName={"ACME Solutions"}
          groupImageUrl={"/group-img.png"}
          lastSpeakerImageUrl={"/userProfile-img.png"}
          lastMessage={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat."
          }
          lastMessageHour={"10:45"}
          lastSpeakerName={"John"}
        />
          </div>
          <div className="flex flex-col gap-3">
              <h6 className="font-semibold">Discussion</h6>
          <div className="flex flex-col gap-3">
          {discussionList.map((discussion) => (
              <Discussion {...discussion} key={discussion.lastMessage + discussion.id}/>
          ))}
          </div>
          </div>
          
          
    </div>
  );
}

interface TeamGroupProps {
  groupName: string;
  groupImageUrl: string;
  lastSpeakerImageUrl: string;
  lastMessage: string;
  lastMessageHour: string;
  lastSpeakerName: string;
}
const TeamGroup = ({ ...props }: TeamGroupProps) => {
  return (
    <div className="w-full bg-[#FFFFFF80] border border-white-50 p-2 flex flex-col gap-[6px] items-center rounded-[8px] h-fit">
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Image
            src={props.groupImageUrl}
            width={28}
            height={28}
            alt="group icon"
            className="rounded-full"
          />
          <h6>{props.groupName}</h6>
        </div>
        <h6>{props.lastMessageHour}</h6>
      </div>
      <div className="w-full flex items-center gap-1">
        <Image
          src={props.lastSpeakerImageUrl}
          width={32}
          height={32}
          alt="speaker icon"
          className="rounded-full"
        />
        <h6 className="">{props.lastSpeakerName}: </h6>
        <h6 className="truncate">{props.lastMessage}</h6>
      </div>
    </div>
  );
};


interface DiscussionProps {
    id: string;
    lastMessage: string;
    lastMessageHour: string;
    speakerName: string;
    speakerImageUrl: string;
    isLastMessageRead : boolean;
    
}



const Discussion = ({...props} : DiscussionProps) => {
    return (
        <div className="flex flex-col gap-3 hover:bg-[#ffffffd4] p-2 rounded-[8px]">
<div className="w-full flex justify-between items-center ">
        <div className="flex gap-2 items-center">
          <Image
            src={props.speakerImageUrl}
            width={28}
            height={28}
            alt="group icon"
            className="rounded-full"
          />
          <h6>{props.speakerName}</h6>
        </div>
        <h6>{props.lastMessageHour}</h6>
            </div>
            <p className="w-full truncate">
                {props.lastMessage}
            </p>
        </div>
    )
}