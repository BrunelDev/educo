"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import "../../../_components/editorPlugins/style.css";
import { StepProgress } from "./stepProgress";

import Editor from "@/app/_components/editor";

export default function CreateMeeting() {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    {
      number: 1,
      title: "Informations Générales",
      description: "Basic details",
      isActive: currentStep === 1,
      isCompleted: currentStep > 1,
    },
    {
      number: 2,
      title: "Programmation & détails",
      description: "Schedule and details",
      isActive: currentStep === 2,
      isCompleted: currentStep > 2,
    },
    {
      number: 3,
      title: "Participants & Invitations",
      description: "Add participants",
      isActive: currentStep === 3,
      isCompleted: currentStep > 3,
    },
    {
      number: 4,
      title: "Ordre du Jour",
      description: "Agenda",
      isActive: currentStep === 4,
      isCompleted: currentStep > 4,
    },
  ];
  return (
    <div className="flex flex-col gap-6 py-10 px-20 w-[900px]">
      <StepProgress steps={steps} />
      <div>
        {currentStep === 1 ? (
          <StepOne />
        ) : currentStep === 2 ? (
          <StepTwo />
        ) : currentStep === 3 ? null : currentStep === 4 ? (
          <StepFour />
        ) : null}
      </div>

      <div className="flex justify-between gap-4">
        {currentStep > 1 ? (
          <Button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Retour
          </Button>
        ) : (
          <div></div>
        )}

        <Button
          onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
          className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors"
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}

const StepOne = () => {
  //const [meetingType, setMeetingType] = useState("CSSCT");
  const [location, setLocation] = useState<string[]>([]);
  return (
    <div className="flex flex-col gap-5">
      <div className="">
        <RadioGroup defaultValue="Ordinaire" className="flex flex-row gap-6">
          <div className="flex items-center space-x-2">
            <Input
              type="radio"
              value="ordinaire"
              id="r1"
              className="w-5 h-5 text-coral-500"
            />
            <Label htmlFor="r1">Ordinaire</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="radio"
              value="cssct"
              id="r2"
              className="w-5 h-5 text-coral-500"
            />
            <Label htmlFor="r2">CSSCT</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="radio"
              value="extraordinaire"
              id="r3"
              className="w-5 h-5 text-coral-500"
            />
            <Label htmlFor="r3">Extraordinaire</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="radio"
              value="autres"
              id="r4"
              className="w-5 h-5 text-coral-500"
            />
            <Label htmlFor="r4">Autres</Label>
          </div>
        </RadioGroup>
      </div>
      {/* Titre de la réunion */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Titre de la réunion
        </label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
          <option>Réunion ordinaire du CSE</option>
        </select>
      </div>

      {/* Objet */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Objet</label>
        <Input
          type="text"
          placeholder="Suivi des activités du CSE"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      {/* Emplacement */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Emplacement</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <Input
              type="checkbox"
              value="physique"
              checked={location.includes("physique")}
              onChange={(e) => {
                if (e.target.checked) {
                  setLocation([...location, "physique"]);
                } else {
                  setLocation(location.filter((l) => l !== "physique"));
                }
              }}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Physique</span>
          </label>

          <label className="flex items-center">
            <Input
              type="checkbox"
              value="enligne"
              checked={location.includes("enligne")}
              onChange={(e) => {
                if (e.target.checked) {
                  setLocation([...location, "enligne"]);
                } else {
                  setLocation(location.filter((l) => l !== "enligne"));
                }
              }}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">En ligne</span>
          </label>
        </div>
      </div>
      {/* Lien de la réunion */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Lien de la réunion
        </label>
        <Input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

const StepTwo = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <div>
          <label className="font-medium text-white-800 text-xs">Date</label>
          <Input type="text" className="" />
        </div>
        <div>
          <label className="font-medium text-white-800 text-xs">Date</label>
          <Input type="text" className="" />
        </div>
        <div>
          <label className="font-medium text-white-800 text-xs">Date</label>
          <Input type="text" className="" />
        </div>
      </div>
      <div>
        <label className="font-medium text-white-800 text-xs">
          Pièces jointes
        </label>
        <div className="relative rounded-[8px] overflow-hidden">
          <Input
            type="file"
            className="w-full h-[136px] border border-white-300 bg-white-50 border-dashed cursor-pointer"
          />
          <div className="absolute top-0 left-0 w-full h-[135px] bg-white-50 flex flex-col gap-2 justify-center items-center pointer-events-none">
            <CirclePlus />
            <h6>Glissez et déposez ou cliquez ici pour choisir un fichier</h6>
            <div>Taille maximale 10MB</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StepFour = () => {
  return (
    <div>
      <Editor />
    </div>
  );
};
