import { MessageHeaderProps } from "@/lib/types";
import { Ellipsis } from "lucide-react";
import Image from "next/image";

export default function MessageHeader({ ...props }: MessageHeaderProps) {
  return (
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
          <h6 className="text-sm font-semibold text-start">{props.conversationName}</h6>
          {Array.isArray(props.speakers) ? (
            <div className="flex gap-1">
              {props.speakers.map((speaker, index) => (
                  <h6 key={speaker + index} className="text-xs">{speaker}{
                      index < props.speakers.length - 1? "," : ""
                  }</h6>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <Ellipsis size={18} />
    </div>
  );
}
