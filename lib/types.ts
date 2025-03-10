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

export type {
  Associate,
  AssociateProps,
  Attendee,
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
  Project,
  ProjectProps,
  SearchBarProps,
  TabsProps,
  Webinar,
  WebinarCardProps,
};

export {
  FileType,
  MeetingType,
  NotificationType,
  ProjectStatus,
  TabsState,
  TagType,
};
