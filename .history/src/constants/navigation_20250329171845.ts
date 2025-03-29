import { 
  Users, 
  LayoutGrid, 
  Sparkles, 
  NotepadText, 
  CircleCheck, 
  GraduationCap, 
  MessageSquareMore, 
  FolderClosed, 
  UsersRound 
} from "lucide-react";

export const NAVIGATION_ITEMS = [
  {
    title: "Tableau de bord",
    url: "/dashboard",
    icon: LayoutGrid,
  },
  {
    title: "Assistance IA",
    url: "/assistance", 
    icon: Sparkles,
  },
  {
    title: "Réunions",
    url: "/reunions",
    icon: Users,
  },
  {
    title: "Consultations CSE",
    url: "/consultations",
    icon: NotepadText,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquareMore,
  },
  {
    title: "Gestion des tâches",
    url: "/gestion",
    icon: CircleCheck,
  },
  {
    title: "Formations",
    url: "/formations",
    icon: GraduationCap,
  },
  {
    title: "Fichiers",
    url: "/fichiers",
    icon: FolderClosed,
  },
  {
    title: "Equipe",
    url: "/equipe",
    icon: UsersRound,
  },
] as const; 