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
  meetingType: MeetingType
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

export type {
  Associate,
  AssociateProps,
  Attendee,
  Meeting,
  MeetingCardProps,
  MeetingComponentProps,
  Notification,
  NotificationItemProps,
  SearchBarProps,
  TabsProps,
  Webinar,
  WebinarCardProps,
};

export { MeetingType, NotificationType, TabsState, TagType };
