enum NotificationType {
  meeting,
  formation,
  asistance,
  document,
  maj,
}
interface Notification {
  id: number;
  iconUrl: string;
  title: string;
  hour: string;
  content: string;
  isRead: boolean;
  type: NotificationType;
}
interface NotificationItemProps {
  notification: Notification;
}

enum TagType {
  Online = "En ligne",
  InPerson = "En présence",
}
//Meeting--------------------------------------------------------
enum InvitationStatus {
  EN_ATTENTE = "EN_ATTENTE",
  ACCEPTE = "ACCEPTE",
  REFUSE = "REFUSE",
}

// Interface for meeting participants
interface MeetingParticipant {
  utilisateur: number;
  est_hote: boolean;
  statut_invitation?  : InvitationStatus;
}

// Interface for meeting documents
interface MeetingDocument {
  fichier: string;
  nom_fichier: string;
  type_fichier?:
    | "pdf"
    | "doc"
    | "docx"
    | "xls"
    | "xlsx"
    | "ppt"
    | "pptx"
    | "image";
}

// Interface for agenda items
interface AgendaItem {
  description: string;
}

// Main meeting interface
interface Meeting {
  id: number;
  type_reunion: string;
  titre: string;
  objet: string;
  emplacement: string;
  lien_reunion: string;
  date_heure: string | Date;
  frequence: string;
  participants: MeetingParticipant[];
  documents: MeetingDocument[];
  ordre_du_jour: AgendaItem[];
}

interface MeetingComponentProps {
  meeting: Meeting;
}
//Meeting--------------------------------------------------------

interface TabsProps {
  activeTab: TabsState;
  setActiveTab: (tab: TabsState) => void;
}
enum TabsState {
  Webinaires = "Webinaires",
  Ressources = "Ressources",
}
interface SearchBarProps {
  value: string;
  handleChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

interface WebinarCardProps {
  tag: string;
  title: string;
  description: string;
  hostName: string;
  hostProfileImageUrl: string;
  hostProfession: string;
  backgroundImageUrl: string;
  id: string;
}
interface Webinar {
  webinar: WebinarCardProps;
}

interface AssociateProps {
  profileImageUrl: string;
  name: string;
  email: string;
  id: string;
}
interface Associate {
  associate: AssociateProps;
}

interface Attendee {
  name: string;
  imageUrl: string;
}
enum MeetingType {
  CSSCT = "CSSCT",
  Ordinary = "Ordinaire",
  Extraordinal = "Extraordinaire",
  Others = "Autres",
}

interface MeetingCardProps {
  meetingType: MeetingType;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  attendees: Attendee[];
  remainingAttendees?: number;
  isOnline?: boolean;
  isInPerson?: boolean;
  isFinished?: boolean;
}

enum ProjectStatus {
  Ongoing = "En cours",
  Completed = "Terminée",
}

interface ProjectProps {
  title: string;
  description: string;
  link: string;
  status: ProjectStatus;
}
interface Project {
  project: ProjectProps;
}
enum FileType {
  img,
  other,
}

interface FileProps {
  name: string;
  id: number;
  type: FileType;
}
interface File {
  file: FileProps;
}
interface FolderProps {
  name: string;
  id: number;
}
interface Folder {
  folder: FolderProps;
}

interface DocumentProps {
  name: string;
  id: number;
}
interface Document {
  document: DocumentProps;
}

interface ParticipantProps {
  name: string;
  role: string;
  profileImage: string;
  id: string;
}
interface Participant {
  participant: ParticipantProps;
}
interface Error1 {
  title?: string;
  purpose?: string;
  location?: string;
  link?: string;
}

interface Error2 {
  date?: string;
  time?: string;
  frequency?: string;
}

enum ConsultationType {
  Orientation = "Orientations stratégiques de l’entreprise",
  Situation = "Situation économique et financière",
  Politique = "Politique sociale, conditions de travail et emploi",
  Gestion = "Gestion de la qualité et des processus",
  Accord = "Accords et plans de sauvegarde de l’emploi (PSE)",
  Introduction = "Introduction de nouvelles technologies",
  Modification = "Modifications importantes des conditions de travail",
  Fusion = "Fusion, acquisition, cession d’entreprise",
}

interface ConsultationProps {
  consultationType: ConsultationType;
  createdOn: string;
  documentReceived: string;
  date: string;
  status: "En attente" | "Terminé";
  id: string;
}

interface ConsultationDialogProps {
  consultationType: ConsultationType;
  description: string;
  process: string[];
}

interface ConsultationDialog {
  consultation: ConsultationDialogProps;
}
interface MessageHeaderProps {
  conversationName: string;
  speakers: string[] | string;
  conversationImageUrl: string;
}

interface ConversationListProps {
  conversations: Array<{
    id: string;
    messages: Array<{
      title: string;
      text: string;
      type?: "text" | "image" | "audio" | "video";
      createdAt?: Date;
      user?: {
        _id: string;
        name: string;
        avatar?: string;
      };
      files?: Array<{ url: string; name: string; type: string }>;
    }>;
    unreadCount?: number;
    lastActivity?: Date;
  }>;
}

// Enum for message types
enum MessageType {
  TEXT = "texte",
  IMAGE = "image",
  AUDIO = "audio",
  FILE = "fichier",
}

// Interface for User (sender)
interface User {
  id: number;
  name: string;
  avatar?: string;
}

// Interface for Room
interface Room {
  id: number;
  name: string;
  participants: User[];
}

// Interface for Message
interface Message {
  id: number;
  room: Room;
  sender: User;
  content?: string;
  type_message: MessageType;
  fichier?: {
    url: string;
    name: string;
    type: string;
  };
  image?: {
    url: string;
    name: string;
    dimensions?: {
      width: number;
      height: number;
    };
  };
  audio?: {
    url: string;
    name: string;
    duration?: number;
  };
  timestamp: Date;
  is_read: boolean;
  is_deleted: boolean;
}

// Props interface for MessageBox component
interface MessageBoxProps {
  message: Message;
  onRead?: (messageId: number) => void;
  onDelete?: (messageId: number) => void;
  className?: string;
}
interface FileInputChangeEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    files: FileList;
  };
}

export type {
  Associate,
  AssociateProps,
  Attendee,
  ConsultationDialog,
  ConsultationDialogProps,
  ConsultationProps,
  ConversationListProps,
  Document,
  DocumentProps,
  Error1,
  Error2,
  File,
  FileInputChangeEvent,
  FileProps,
  Folder,
  FolderProps,
  Meeting,
  MeetingCardProps,
  MeetingComponentProps,
  Message,
  MessageBoxProps,
  MessageHeaderProps,
  Notification,
  NotificationItemProps,
  Participant,
  ParticipantProps,
  Project,
  ProjectProps,
  Room,
  SearchBarProps,
  TabsProps,
  User,
  Webinar,
  WebinarCardProps,
};

export {
  ConsultationType,
  FileType,
  MeetingType,
  MessageType,
  NotificationType,
  ProjectStatus,
  TabsState,
  TagType,
};
