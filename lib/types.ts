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

interface AssociateProps  {
  profileImageUrl: string;
  name: string;
  email: string;
  id: string;
}
interface Associate {
  associate : AssociateProps;
}

export type {
  Meeting,
  MeetingComponentProps,
  Notification,
  NotificationItemProps,
  SearchBarProps,
  TabsProps,
  WebinarCardProps,
  Webinar, Associate, AssociateProps
};

export { NotificationType, TabsState, TagType };
