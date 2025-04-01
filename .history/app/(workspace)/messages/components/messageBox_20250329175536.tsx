import { Message } from "@/lib/api/message";
import { MessageType } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Ellipsis } from "lucide-react";
import Image from "next/image";


const MessageBox = async({ message, className }: { message: Message, className: string }) =>{
  
  
  const renderContent = () => {
    switch (message.type_message) {
      case MessageType.IMAGE:
        return message.image && (
          <Image
            src={message.image}
            alt={`${message.sender} image`}
            width={300}
            height={200}
            className="rounded-lg"
          />
        );
      case MessageType.AUDIO:
        return message.audio && (
          <audio controls className="max-w-full">
            <source src={message.audio} type="audio/mpeg" />
          </audio>
        );
      case MessageType.FILE:
        return message.fichier && (
          <a
            href={message.fichier}
            download
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            📎 {message.fichier.toString()}
          </a>
        );
      default:
        return <p className={`text-gray-800 bg-white-50  p-2 w-fit ${message.sender.id == JSON.parse(cookieStorage.get("userInfo")?.value || "")?.id ? "" : "rounded-b-[8px] rounded-tr-[8px]"}`}>{message.content}</p>;
    }
  };

  return (
    <div className={`flex gap-4 p-4 ${className} my-8`}>
      <Image
        src={"/userProfile-img.png"}
        alt={message.sender.email}
        width={30}
        height={30}
        className="rounded-full w-[30px] h-[30px]"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">{message.sender.email}</span>
          
        </div>
        <div className="relative w-fit">{renderContent()}
        <span className="text-sm text-gray-500 absolute right-0 -bottom-6">
            {formatDistanceToNow(message.timestamp, { locale: fr, addSuffix: true })}
          </span>
          <Ellipsis size={18}  className="absolute top-1 -right-6"/>
        </div>
        
      </div>
      
    </div>
  );
}

export default MessageBox;