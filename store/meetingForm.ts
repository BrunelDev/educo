import { MeetingType } from "@/lib/types";
import { create } from "zustand";

export interface MeetingFormState {
  // Step 1 - General Information
  type_reunion: MeetingType;
  titre: string;
  objet: string;
  emplacement: string[];
  lien_reunion?: string;

  // Step 2 - Schedule
  date_heure_debut: string;
  date_heure_fin?: string;
  frequence: string;
  documents: Array<{
    fichier: string;
    nom_fichier: string;
    type_document: string;
  }>;

  // Step 3 - Participants
  participants: string[];

  // Step 4 - Agenda
  ordre_du_jour: Array<{
    description: string;
  }>;

  // Form Actions
  updateStep1: (
    data: Partial<{
      type_reunion: MeetingType;
      titre: string;
      objet: string;
      emplacement: string[];
      lien_reunion: string;
    }>
  ) => void;

  updateStep2: (
    data: Partial<{
      date_heure_debut: string;
      date_heure_fin?: string;
      frequence: string;
      documents: Array<{
        fichier: string;
        nom_fichier: string;
        type_document: string;
      }>;
    }>
  ) => void;

  updateStep3: (participants: string[]) => void;

  updateStep4: (ordre_du_jour: Array<{ description: string }>) => void;

  resetForm: () => void;
}

const initialState = {
  type_reunion: MeetingType.Course,
  titre: "",
  objet: "",
  emplacement: [],
  lien_reunion: "",
  date_heure_debut: "",
  date_heure_fin: undefined,
  frequence: "Une fois",
  documents: [],
  participants: [],
  ordre_du_jour: [],
};

export const useMeetingForm = create<MeetingFormState>((set) => ({
  ...initialState,

  updateStep1: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  updateStep2: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  updateStep3: (participants) =>
    set((state) => ({
      ...state,
      participants: participants.map((p) => p),
    })),

  updateStep4: (ordre_du_jour) =>
    set((state) => ({
      ...state,
      ordre_du_jour,
    })),

  resetForm: () => set(initialState),
}));
