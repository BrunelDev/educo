"use client";
import { User } from "@/lib/api/users";
import { MessageHeaderProps } from "@/lib/types";
import { getCookies } from "@/lib/utils/cookies";
import { useMessageStore } from "@/store/message";
import { Ellipsis } from "lucide-react";
import Image from "next/image";

const MessageHeader = ({ ...props }: MessageHeaderProps) => {
  const { activeConversation } = useMessageStore();
  const userInfo: User = JSON.parse(getCookies("userInfo") || "{}");
  if(activeConversation)
  {return (
    <div className="flex justify-between items-center mx-6 py-6 border-b">
      <div className="flex items-center gap-3">
        <Image
          src={props.conversationImageUrl}
          alt={"conversation image"}
          height={40}
          width={40}
          className="rounded-full"
        />
        <div className="flex flex-col justify-self-start">
          <h6 className="text-sm font-semibold text-start">
            {activeConversation
              ? activeConversation?.participants.filter(
                  (participant) => participant._id === userInfo.id
                )[0]?.name
              : "John Doe"}
          </h6>
          {Array.isArray(props.speakers) ? (
            <div className="flex gap-1">
              {activeConversation?.participants.map((speaker, index) => (
                <h6 key={speaker._id + index} className="text-xs">
                  {(speaker && speaker.name) || "John Does"}
                  {index < activeConversation?.participants.length - 1
                    ? ","
                    : ""}
                </h6>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <Ellipsis size={18} />
    </div>
  );}
};

export default MessageHeader;
