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

const sampleMessages: Message[] = [
  {
    id: 1,
    room: room,
    sender: users[0],
    content: 'Bonjour à tous, voici l\'ordre du jour de notre prochaine réunion CSE.',
    type_message: MessageType.TEXT,
    timestamp: new Date('2024-03-15T09:00:00'),
    is_read: true,
    is_deleted: false,
  },
  {
    id: 2,
    room: room,
    sender: users[0],
    type_message: MessageType.FILE,
    fichier: {
      url: '/files/ordre-du-jour.pdf',
      name: 'Ordre du jour - Réunion CSE Mars 2024.pdf',
      type: 'application/pdf',
    },
    timestamp: new Date('2024-03-15T09:01:00'),
    is_read: true,
    is_deleted: false,
  },
  {
    id: 3,
    room: room,
    sender: users[1],
    content: 'Merci Marie, j\'ai quelques photos de la dernière formation CSSCT à partager.',
    type_message: MessageType.TEXT,
    timestamp: new Date('2024-03-15T09:15:00'),
    is_read: true,
    is_deleted: false,
  },
  {
    id: 4,
    room: room,
    sender: users[1],
    type_message: MessageType.IMAGE,
    image: {
      url: '/about_us-img.png',
      name: 'Formation CSSCT - Photo 1',
      dimensions: {
        width: 1920,
        height: 1080,
      },
    },
    timestamp: new Date('2024-03-15T09:16:00'),
    is_read: true,
    is_deleted: false,
  },
  {
    id: 5,
    room: room,
    sender: users[2],
    type_message: MessageType.AUDIO,
    audio: {
      url: '/audio/compte-rendu-verbal.mp3',
      name: 'Compte-rendu verbal - Formation CSSCT',
      duration: 120, // 2 minutes
    },
    timestamp: new Date('2024-03-15T10:30:00'),
    is_read: false,
    is_deleted: false,
  },
  {
    id: 6,
    room: room,
    sender: users[2],
    content: 'Voici le bilan financier du premier trimestre 2024',
    type_message: MessageType.TEXT,
    timestamp: new Date('2024-03-15T11:00:00'),
    is_read: false,
    is_deleted: false,
  },
  {
    id: 7,
    room: room,
    sender: users[0],
    type_message: MessageType.FILE,
    fichier: {
      url: '/files/bilan-q1-2024.xlsx',
      name: 'Bilan financier Q1 2024.xlsx',
      type: 'application/xlsx',
    },
    timestamp: new Date('2024-03-15T11:01:00'),
    is_read: false,
    is_deleted: false,
  },
  {
    id: 8,
    room: room,
    sender: users[1],
    type_message: MessageType.IMAGE,
    image: {
      url: '/about_us-img.png',
      name: 'Graphique bilan Q1 2024',
      dimensions: {
        width: 800,
        height: 600,
      },
    },
    timestamp: new Date('2024-03-15T11:05:00'),
    is_read: false,
    is_deleted: false,
  },
  {
    id: 9,
    room: room,
    sender: users[2],
    content: "Mon seul boss c'est Armel. Un jour je veux devenir comme lui",
    type_message: MessageType.TEXT,
    timestamp: new Date('2024-03-15T11:10:00'),
    is_read: false,
    is_deleted: false,
  },
  {
    id: 10,
    room: room,
    sender: users[0],
    type_message: MessageType.TEXT,
    content: 'D\'accord, je vais envoyer un sondage Doodle pour trouver une date qui convient à tous.',
    timestamp: new Date('2024-03-15T11:15:00'),
    is_read: false,
    is_deleted: false,
  },
];
  return (
    <div className="w-full">
      <MessageHeader {...messageHeader} />
      <MessageList />
    </div>
  );
}
