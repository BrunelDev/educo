import { Message, MessageHeaderProps, MessageType, Room, User } from "@/lib/types";
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
 

// Sample users
const users: User[] = [
  { id: 1, name: 'Marie Durant', avatar: '/userProfile-img.png' },
  { id: 2, name: 'Thomas Bernard', avatar: '/userProfile-img.png' },
  { id: 3, name: 'Sophie Martin', avatar: '/userProfile-img.png' },
];

// Sample room
const room: Room = {
  id: 1,
  name: 'CSE General',
  participants: users,
};


  return (
    <div className="w-full">
      <MessageHeader {...messageHeader} />
      <MessageList />
    </div>
  );
}
