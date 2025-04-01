import { Message, MessageHeaderProps } from "@/lib/types";
import MessageHeader from "./components/messageHeader";
import MessageList from "./components/messageList";

export default function MessagePage() {
  const messageHeader: MessageHeaderProps = {
    conversationName: "Nouvelle conversation",
    speakers: [
      "Victoria",
      "John DOE",
      "Jane SMITH",
      "Sarah Johnson",
      "Emily BROWN",
      "William TAYLOR",
      "Olivia MARTIN",
    ],
    conversationImageUrl: "/enterprise-image.png",
  };
 





  return (
    <div className="w-full">
      <MessageHeader {...messageHeader} />
      <MessageList />
    </div>
  );
}
