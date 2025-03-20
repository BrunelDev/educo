"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import "../../../_components/editorPlugins/style.css";
import { StepProgress } from "./stepProgress";

import Editor from "@/app/_components/editor";
import { handleFileUpload } from "@/app/actions/actions";
import { Error1, Error2, FileInputChangeEvent, MeetingType } from "@/lib/types";
import { useFileStore } from "@/store/files";
import FileComponent from "./fileComponent";
import Image from "next/image";
import { getAllusers, User, UserApiResponse } from "@/lib/api/users";

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
  const {
    filesList,
    //removeFileWithUrl,
  } = useFileStore();
  const [form1Error, setForm1Error] = useState<Error1>({});
  const [form2Error, setForm2Error] = useState<Error2>({});

  const validateStep1 = (errors: Error1) => {
    setForm1Error(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (errors: Error2) => {
    setForm2Error(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="flex flex-col gap-6 py-10 px-20 w-[900px]">
      <StepProgress steps={steps} />
      <div>
        {currentStep === 1 ? (
          <StepOne errors={form1Error} setErrors={setForm1Error} />
        ) : currentStep === 2 ? (
          <StepTwo errors={form2Error} setErrors={setForm2Error} />
        ) : currentStep === 3 ? <StepThree/> : currentStep === 4 ? (
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
          onClick={async () => {
            if (currentStep === 1) {
              const isValid = validateStep1(form1Error);
              if (!isValid) {
                return;
              }
            } else if (currentStep === 2) {
              const isValid = validateStep2(form2Error);
              if (!isValid) {
                return;
              }
            }
            setCurrentStep(Math.min(4, currentStep + 1));

            if (currentStep === 4) {
              const filesToUpload = filesList.map((item) => item.file);
              await handleFileUpload(filesToUpload);
              console.log("etape finale soumission");
            }
          }}
          className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors"
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}

const StepOne = ({
  errors,
  setErrors,
}: {
  errors: Error1;
  setErrors: (error: Error1) => void;
}) => {
  // Meeting type state
  const [meetingType, setMeetingType] = useState<MeetingType>(
    MeetingType.Ordinary
  );

  // Meeting title and purpose states
  const [meetingTitle, setMeetingTitle] = useState<string>(
    "Réunion ordinaire du CSE"
  );
  const [meetingPurpose, setMeetingPurpose] = useState<string>("");

  // Location states
  const [location, setLocation] = useState<string[]>([]);
  const [meetingLink, setMeetingLink] = useState<string>("");

  // Form validation state

  //const [error, setError] = useState<Error1>({});

  // Use useEffect to validate form whenever inputs change
  useEffect(() => {
    const newErrors: Error1 = {};

    // Title validation
    if (!meetingTitle.trim()) {
      newErrors.title = "Le titre est requis";
    }

    // Purpose validation
    if (!meetingPurpose.trim()) {
      newErrors.purpose = "L'objet est requis";
    } else if (meetingPurpose.length < 10) {
      newErrors.purpose = "L'objet doit contenir au moins 10 caractères";
    }

    // Location validation
    if (location.length === 0) {
      newErrors.location = "Sélectionnez au moins un type d'emplacement";
    }

    // Meeting link validation
    if (location.includes("enligne")) {
      if (!meetingLink) {
        newErrors.link = "Le lien est requis pour une réunion en ligne";
      } else if (!isValidUrl(meetingLink)) {
        newErrors.link = "Le lien n'est pas valide";
      }
    }

    setErrors(newErrors);
  }, [meetingTitle, meetingPurpose, location, meetingLink, setErrors]);

  // Helper function to validate URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Add this to handle form submission

  return (
    <div className="flex flex-col gap-5">
      <div className="">
        <RadioGroup
          value={meetingType}
          defaultValue={MeetingType.Ordinary}
          onValueChange={(value: MeetingType) => setMeetingType(value)}
          className="flex flex-row gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={MeetingType.Ordinary} id="r1" />
            <Label htmlFor="r1">Ordinaire</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={MeetingType.CSSCT} id="r2" />
            <Label htmlFor="r2">CSSCT</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={MeetingType.Extraordinal} id="r3" />
            <Label htmlFor="r3">Extraordinaire</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={MeetingType.Others} id="r4" />
            <Label htmlFor="r4">Autres</Label>
          </div>
        </RadioGroup>
      </div>
      {/* Titre de la réunion */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Titre de la réunion
        </label>
        <select
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
        >
          <option>Réunion ordinaire du CSE</option>
        </select>
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* Objet */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Objet</label>
        <Input
          type="text"
          value={meetingPurpose}
          onChange={(e) => {
            setMeetingPurpose(e.target.value);
          }}
          placeholder="Suivi des activités du CSE"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.purpose && (
          <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>
        )}
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
        {errors.location && (
          <p className="text-red-500 text-sm mt-1">{errors.location}</p>
        )}
      </div>
      {/* Lien de la réunion */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Lien de la réunion
        </label>
        <Input
          required
          type="text"
          value={meetingLink}
          onChange={(e) => {
            setMeetingLink(e.target.value);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.link && (
          <p className="text-red-500 text-sm mt-1">{errors.link}</p>
        )}
      </div>
    </div>
  );
};

const StepTwo = ({
  errors,
  setErrors,
}: {
  errors: Error2;
  setErrors: (error: Error2) => void;
}) => {
  const { filesList, addFileWithUrl, removeFileWithUrl } = useFileStore();
  const [meetingDate, setMeetingDate] = useState<string>("");
  const [meetingTime, setMeetingTime] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("once");
  const [, setFile] = useState<File | undefined>(undefined);
  const [, setFileUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const newErrors: Error2 = {};

    // Date validation
    if (!meetingDate) {
      newErrors.date = "La date est requise";
    } else {
      const selectedDate = new Date(meetingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = "La date ne peut pas être dans le passé";
      }
    }

    // Time validation
    if (!meetingTime) {
      newErrors.time = "L'heure est requise";
    }

    // Frequency validation
    if (!frequency) {
      newErrors.frequency = "La fréquence est requise";
    }

    setErrors(newErrors);
  }, [meetingDate, meetingTime, frequency, setErrors]);

  const handleFileInputChange = (e: FileInputChangeEvent): void => {
    const newFile = e.target.files[0];
    setFile(newFile);
    /*if (fileUrl && filesList.length > 0 && .includes(fileUrl)) {
      URL.revokeObjectURL(fileUrl);
    }*/
    if (newFile) {
      const url = URL.createObjectURL(newFile);
      setFileUrl(url);
      addFileWithUrl(newFile, url);
      console.log(url);
    } else {
      setFileUrl(undefined);
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full gap-4 justify-between">
        <div className="w-1/3">
          <label className="font-medium text-white-800 text-xs">Date</label>
          <Input
            type="date"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            className={errors.date ? "border-red-500" : ""}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
        </div>
        <div className="w-1/3">
          <label className="font-medium text-white-800 text-xs">Heure</label>
          <Input
            type="time"
            value={meetingTime}
            onChange={(e) => setMeetingTime(e.target.value)}
            className={errors.time ? "border-red-500" : ""}
          />
          {errors.time && (
            <p className="text-red-500 text-sm mt-1">{errors.time}</p>
          )}
        </div>
        <div className="w-1/3">
          <label className="font-medium text-white-800 text-xs">
            Fréquence
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
              errors.frequency ? "border-red-500" : ""
            }`}
          >
            <option value="once">Une fois</option>
            <option value="weekly">Hebdomadaire</option>
            <option value="monthly">Mensuel</option>
          </select>
          {errors.frequency && (
            <p className="text-red-500 text-sm mt-1">{errors.frequency}</p>
          )}
        </div>
      </div>
      <div>
        <label className="font-medium text-white-800 text-xs">
          Pièces jointes
        </label>
        <div className="relative rounded-[8px] overflow-hidden">
          <Input
            name="media"
            onChange={handleFileInputChange}
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
      {filesList.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {filesList.map((file, index) => (
            <FileComponent
              key={index}
              link={file.fileUrl}
              fileName={`Fichier ${index}`}
              handleRemove={() => {
                removeFileWithUrl(file.file);
                URL.revokeObjectURL(file.fileUrl);
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

const StepThree =  () => {
  const [users, setUsers] = useState<User[]>([])
  useEffect(() => {
    const fun = async () => {
      try {
        const storedData = JSON.parse(localStorage.getItem("userInfo") || "")
        console.log("token", storedData)
        const response = await getAllusers()
        setUsers(response.results);
      } catch (error) {
        console.error(error);
      }
    }
    fun();
  }, [])
  return (
    <div className="flex flex-col gap-4 rounded-[12px] py-10 px-20 w-full">
     
      
      <div className=" flex gap-2 items-center">
        <Input
          type="email"
          placeholder="Invitez des gens par nom ou par email"
        />
        <Button
          variant="default"
          className="rounded-[8px] bg-gradient-to-r from-[#FE6539] to-crimson-400"
        >
          Inviter
        </Button>
      </div>
      <div>
              <h6 className="font-medium text-[10px]">Qui a accès ?</h6>
              <div className=" mt-3 flex flex-col gap-3">
                  {users.map((user, index) => (
          <div key={index} className="flex justify-between">
            <div className="flex gap-3">
              <div className="h-[28px] w-[28px] flex items-center justify-center border border-dashed rounded-full">
                <Image
                  src={"user-icon.svg"}
                  width={16}
                  height={19}
                  alt="user icon"
                />
              </div>

              {user.email}
                          </div>
                          <div className="h-5 w-5 rounded-sm flex justify-center items-center hover:bg-coral-50 cursor-pointer">
                        <Input
                        type="checkbox"/>
                          </div>
            
          </div>
        ))}
              </div>
        
      </div>
    </div>
  );
}

const StepFour = () => {
  return (
    <div className="w-full">
      <Editor />
    </div>
  );
};
