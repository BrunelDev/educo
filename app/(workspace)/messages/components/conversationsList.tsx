"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
//import SearchBar from "../../components/searchBar";
import { useMessageStore } from "@/store/message";
import { Conversation, ConversationResponse, getConversationList } from "@/lib/api/message";
import { getCookies } from "@/lib/utils/cookies";
import { User } from "@/lib/api/users";
import { getGroups, Group } from "@/lib/api/messagerie";


const userInfo : User = JSON.parse(getCookies("userInfo") || "{}")

export default function ConversationsList() {
  //const [serachValue, setSearchValue] = useState<string>("");
  const [conversations, setConversations] = useState<ConversationResponse>();
  const [groups, setGroups] = useState<Group[] | null>();
  useEffect(() => {
    const fetchData = async () => {
      const response = await getConversationList();
      setConversations(response);
      const groupsResponse = await getGroups();
      setGroups(groupsResponse?.results);
      console.log(groupsResponse);
    };
    fetchData();
  }, []);
  return (
    <div className="h-[calc(100vh-93px)] w-[280px] flex flex-col gap-3 pt-4 px-2 text-xs">
      <h6 className="text-lg font-semibold">Messages</h6>
      {/*<SearchBar
        value={serachValue}
        handleChange={setSearchValue}
        placeholder={"Rechercher"}
        className="w-full"
      />*/}
      {/*<div className="flex flex-col gap-3">
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
      </div>*/}
      <div className="flex flex-col gap-3">
        <h6 className="font-semibold">Groupes</h6>
      </div>
      {groups ? groups.map((group) => (
        <GroupDiscussion
          {...group}
          key={group.id}
        />
      )) : null}
      <div className="flex flex-col gap-3">
        <h6 className="font-semibold">Discussion</h6>
        <div className="flex flex-col gap-3">
          {conversations ? conversations.results.map((discussion) => (
            <Discussion
             {...discussion}
            key={JSON.stringify(discussion.participants) + discussion.id}            />
          )) : null}
        </div>
      </div>
    </div>
  );
}




const Discussion = ({ ...props }: Conversation ) => {
  const { 
    setActiveConversation,  
  } = useMessageStore();
  
  return (
    <div className="flex flex-col gap-3 bg-gray-50 cursor-pointer hover:bg-gray-100 p-2 rounded-[8px]" onClick={() => {
      setActiveConversation(props)
    }}>
      <div className="w-full flex justify-between items-center ">
        <div className="flex w-2/3 gap-2 items-center">
          <Image
            src={props.participants.filter((participant)=>participant._id !== userInfo.id)[0].avatar || "/userProfile-img.png"}
            width={28}
            height={28}
            alt="group icon"
            className="rounded-full"
          />
          <h6 className="gap-2 truncate">{props.participants.filter((participant)=>participant._id !== userInfo.id)[0].name || "Anonyme"}</h6>
        </div>
      </div>
    </div>
  );
};

const GroupDiscussion = ({ ...props }: Group ) => {
  /*const { 
    setActiveConversation,  
  } = useMessageStore();*/
  
  return (
    <div className="flex flex-col gap-3 hover:bg-[#ffffffd4] p-2 rounded-[8px]" onClick={() => {
      /*setActiveConversation({
        id: props.id,
        //name: props.nom,
        description: props.description,
        members: props.membres,
      })*/
    }}>
      <div className="w-full flex justify-between items-center ">
        <div className="flex w-2/3 gap-2 items-center">
          <Image
            src={"/group-img.png"}
            width={28}
            height={28}
            alt="group icon"
            className="rounded-full"
          />
          <h6 className="gap-2 truncate">{props.nom || "Group Name"}</h6>
        </div>
      </div>
    </div>
  );
};

