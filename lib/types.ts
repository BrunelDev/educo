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
interface Meeting {
  id: number;
  type: string;
  date: string;
  time: string;
  title: string;
  description: string;
  tags: TagType[];
  participants: string[];
}

interface MeetingComponentProps {
  meeting: Meeting;
}

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

export type {
  Associate,
  AssociateProps,
  Attendee,
  ConsultationProps,
  Document,
  DocumentProps,
  File,
  FileProps,
  Folder,
  FolderProps,
  Meeting,
  MeetingCardProps,
  MeetingComponentProps,
  Notification,
  NotificationItemProps,
  Participant,
  ParticipantProps,
  Project,
  ProjectProps,
  SearchBarProps,
  TabsProps,
  Webinar,
  WebinarCardProps,
  ConsultationDialog,ConsultationDialogProps
};

export {
  ConsultationType,
  FileType,
  MeetingType,
  NotificationType,
  ProjectStatus,
  TabsState,
  TagType,
};
