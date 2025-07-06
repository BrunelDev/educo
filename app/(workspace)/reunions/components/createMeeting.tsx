"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import "../../../_components/editorPlugins/style.css";
import { StepProgress } from "./stepProgress";

import Editor from "@/app/_components/editor";
import { handleFileUpload } from "@/app/actions/actions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { extractFilenameFromUrl } from "@/lib/api/fichiers";
import {
  getOrganisationMembers,
  OrganizationMember,
} from "@/lib/api/organisation";
import { createMeeting } from "@/lib/api/reunion";
import { uploadToS3 } from "@/lib/s3-upload";
import { Error1, Error2, FileInputChangeEvent, MeetingType } from "@/lib/types";
import { getCookies } from "@/lib/utils/cookies";
import { useFileStore } from "@/store/files";
import { useMeetingForm } from "@/store/meetingForm";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import FileComponent from "./fileComponent";

export default function CreateMeeting() {
  const [currentStep, setCurrentStep] = useState(1);
  const formData = useMeetingForm();
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
    <div className="flex flex-col gap-6 py-6 sm:py-8 md:py-10 px-4 sm:px-8 md:px-12 lg:px-20 w-full max-w-[900px] mx-auto">
      <StepProgress steps={steps} />
      <div className="w-full">
        {currentStep === 1 ? (
          <StepOne errors={form1Error} setErrors={setForm1Error} />
        ) : currentStep === 2 ? (
          <StepTwo errors={form2Error} setErrors={setForm2Error} />
        ) : currentStep === 3 ? (
          <StepThree />
        ) : currentStep === 4 ? (
          <StepFour />
        ) : null}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <div className="self-start sm:self-auto">
          {currentStep > 1 ? (
            <Button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors w-full sm:w-auto"
            >
              Retour
            </Button>
          ) : (
            <div className="hidden sm:block"></div>
          )}
        </div>

        <div className="w-full sm:w-auto flex justify-end">
          <Button
            onClick={async () => {
              if (currentStep === 1) {
                const isValid = validateStep1(form1Error);
                if (!isValid) {
                  toast.error(
                    "Veuillez remplir tous les champs obligatoires de l'étape 1"
                  );
                  return;
                }
              } else if (currentStep === 2) {
                const isValid = validateStep2(form2Error);
                if (!isValid) {
                  toast.error(
                    "Veuillez remplir tous les champs obligatoires de l'étape 2"
                  );
                  return;
                }
              } else if (currentStep === 3) {
                if (
                  !formData.participants ||
                  formData.participants.length === 0
                ) {
                  toast.error(
                    "Veuillez sélectionner au moins un participant à la réunion"
                  );
                  return;
                }
              }

              if (currentStep === 4) {
                try {
                  toast.loading("Création de la réunion en cours...");
                  const filesToUpload = filesList.map((item) => item.file);
                  await handleFileUpload(filesToUpload);
                  const res = await uploadToS3(
                    filesList.map((item) => item.file)
                  );
                  formData.documents = res.map((item) => ({
                    fichier: item,
                    nom_fichier: extractFilenameFromUrl(item),
                    type_document: "DOCUMENT",
                  }));

                  await createMeeting(formData);
                  toast.dismiss();
                  toast.success("La réunion a été créée avec succès!");
                  window.location.reload();
                } catch (error) {
                  //hide loading toast
                  toast.dismiss();
                  toast.error("Erreur lors de la création de la réunion");
                  console.error("Error creating meeting:", error);
                  return;
                }
                return;
              }

              setCurrentStep(Math.min(4, currentStep + 1));
            }}
            className="px-4 py-2 bg-gradient-to-r from-[#FE6539] to-crimson-400 text-white rounded-md hover:bg-rose-600 transition-colors w-full sm:w-auto"
          >
            {currentStep === 4 ? "Soumettre" : "Suivant"}
          </Button>
        </div>
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
  const { type_reunion, objet, emplacement, lien_reunion, updateStep1 } =
    useMeetingForm();

  // Meeting type state
  const [localMeetingType, setLocalMeetingType] =
    useState<MeetingType>(type_reunion);
  const [localMeetingTitle, setLocalMeetingTitle] = useState<string>("Ordinaire");
  const [localMeetingPurpose, setLocalMeetingPurpose] = useState<string>(objet);
  const [localLocation, setLocalLocation] = useState<string[]>(emplacement);
  const [localMeetingLink, setLocalMeetingLink] = useState<string>(
    lien_reunion || ""
  );

  // Update store whenever local state changes
  useEffect(() => {
    updateStep1({
      type_reunion: localMeetingType,
      titre: localMeetingTitle,
      objet: localMeetingPurpose,
      emplacement: localLocation,
      lien_reunion: localMeetingLink,
    });
  }, [
    localMeetingType,
    localMeetingTitle,
    localMeetingPurpose,
    localLocation,
    localMeetingLink,
    updateStep1,
  ]);

  // Form validation state

  //const [error, setError] = useState<Error1>({});

  // Use useEffect to validate form whenever inputs change
  useEffect(() => {
    const newErrors: Error1 = {};

    // Title validation
    if (!localMeetingTitle.trim()) {
      newErrors.title = "Le titre est requis";
    }

    // Purpose validation
    if (!localMeetingPurpose.trim()) {
      newErrors.purpose = "L'objet est requis";
    } else if (localMeetingPurpose.length < 3) {
      newErrors.purpose = "L'objet doit contenir au moins 3 caractères";
    }

    // Location validation
    if (localLocation.length === 0) {
      newErrors.location = "Sélectionnez au moins un type d'emplacement";
    }

    // Meeting link validation
    if (localLocation.includes("EN_LIGNE")) {
      if (!localMeetingLink) {
        newErrors.link = "Le lien est requis pour une réunion en ligne";
      } else if (!isValidUrl(localMeetingLink)) {
        newErrors.link = "Le lien n'est pas valide";
      }
    }

    setErrors(newErrors);
  }, [
    localMeetingTitle,
    localMeetingPurpose,
    localLocation,
    localMeetingLink,
    setErrors,
  ]);

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
    <div className="flex flex-col gap-5 w-full">
      <div className="w-full">
        <Label className="text-sm font-medium text-gray-700 block mb-2">
          Type de réunion
        </Label>
        <RadioGroup
          value={localMeetingType}
          defaultValue={MeetingType.Ordinary}
          onValueChange={(value: MeetingType) => {
            setLocalMeetingType(value);
            if (value === MeetingType.Others) {
              setLocalMeetingTitle("");
            }
          }}
          className="flex flex-wrap gap-x-6 gap-y-3"
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
      <div className="space-y-2 w-full">
        {localMeetingType === MeetingType.Others && (
          <>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Titre de la réunion
            </label>
            <Input
              type="text"
              value={localMeetingTitle}
              onChange={(e) => {
                setLocalMeetingTitle(e.target.value);
              }}
              placeholder="Titre de la réunion"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </>
        )}
        {errors.title && localMeetingType === MeetingType.Others && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* Objet */}
      <div className="space-y-2 w-full">
        <label className="text-sm font-medium text-gray-700 block mb-1">
          Objet
        </label>
        <Input
          type="text"
          value={localMeetingPurpose}
          onChange={(e) => {
            setLocalMeetingPurpose(e.target.value);
          }}
          placeholder="Suivi des activités du CSE"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.purpose && (
          <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>
        )}
      </div>
      {/* Emplacement */}
      <div className="space-y-2 w-full">
        <label className="text-sm font-medium text-gray-700 block mb-1">
          Emplacement
        </label>
        <div className="flex flex-wrap gap-4 sm:gap-6 mb-1">
          <label className="flex items-center">
            <Input
              type="checkbox"
              value="PHYSIQUE"
              checked={localLocation.includes("PHYSIQUE")}
              onChange={(e) => {
                if (e.target.checked) {
                  setLocalLocation((prev) => [...prev, "PHYSIQUE"]);
                } else {
                  setLocalLocation((prev) =>
                    prev.filter((item) => item !== "PHYSIQUE")
                  );
                }
              }}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Physique</span>
          </label>

          <label className="flex items-center">
            <Input
              type="checkbox"
              value="EN_LIGNE"
              checked={localLocation.includes("EN_LIGNE")}
              onChange={(e) => {
                if (e.target.checked) {
                  setLocalLocation((prev) => [...prev, "EN_LIGNE"]);
                } else {
                  setLocalLocation((prev) =>
                    prev.filter((item) => item !== "EN_LIGNE")
                  );
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
      <div className="space-y-2 w-full">
        <label className="text-sm font-medium text-gray-700 block mb-1">
          Lien de la réunion
        </label>
        <Input
          required
          type="text"
          value={localMeetingLink}
          onChange={(e) => {
            setLocalMeetingLink(e.target.value);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://meet.google.com/abc-defg-hij"
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
  const { frequence, updateStep2 } = useMeetingForm();
  const { filesList, addFileWithUrl, removeFileWithUrl } = useFileStore();

  const [localDate, setLocalDate] = useState<string>("");
  const [localTime, setLocalTime] = useState<string>("");
  const [localFrequency, setLocalFrequency] = useState<string>(frequence);

  useEffect(() => {
    const newErrors: Error2 = {};

    // Date validation
    if (!localDate) {
      newErrors.date = "La date est requise";
    }

    // Time validation
    if (!localTime) {
      newErrors.time = "L'heure est requise";
    }

    // Frequency validation
    if (!localFrequency) {
      newErrors.frequency = "La fréquence est requise";
    }

    setErrors(newErrors);

    if (localDate && localTime) {
      const combinedDateTime = new Date(
        `${localDate}T${localTime}`
      ).toISOString();
      updateStep2({
        date_heure: combinedDateTime,
        frequence: localFrequency,
        documents: filesList.map((f) => ({
          nom_fichier: "le nom",
          fichier: f.fileUrl,
          type_document: "DOCUMENT",
        })),
      });
    }
  }, [localDate, localTime, localFrequency, filesList, updateStep2, setErrors]);

  const handleFileInputChange = (e: FileInputChangeEvent): void => {
    const newFile = e.target.files[0];
    if (newFile) {
      const url = URL.createObjectURL(newFile);
      const name = newFile.name;
      addFileWithUrl(newFile, url, name);
      console.log(url);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row w-full gap-4 justify-between">
        <div className="w-full sm:w-1/3">
          <label className="font-medium text-white-800 text-xs block mb-1">
            Date
          </label>
          <Input
            type="date"
            value={localDate}
            onChange={(e) => setLocalDate(e.target.value)}
            className={`w-full ${errors.date ? "border-red-500" : ""}`}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
        </div>
        <div className="w-full sm:w-1/3">
          <label className="font-medium text-white-800 text-xs block mb-1">
            Heure
          </label>
          <Input
            type="time"
            value={localTime}
            onChange={(e) => setLocalTime(e.target.value)}
            className={`w-full ${errors.time ? "border-red-500" : ""}`}
          />
          {errors.time && (
            <p className="text-red-500 text-sm mt-1">{errors.time}</p>
          )}
        </div>
        <div className="w-full sm:w-1/3">
          <label className="font-medium text-white-800 text-xs block mb-1">
            Fréquence
          </label>
          <Select value={localFrequency} onValueChange={setLocalFrequency}>
            <SelectTrigger
              className={`w-full h-[36px] ${
                errors.frequency ? "border-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Sélectionner la fréquence" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fréquence</SelectLabel>
                <SelectItem value="Une fois">Une fois</SelectItem>
                <SelectItem value="Hebdomadaire">Hebdomadaire</SelectItem>
                <SelectItem value="Mensuel">Mensuel</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.frequency && (
            <p className="text-red-500 text-sm mt-1">{errors.frequency}</p>
          )}
        </div>
      </div>
      <div className="w-full">
        <label className="font-medium text-white-800 text-xs block mb-2">
          Pièces jointes
        </label>
        <div className="relative rounded-[8px] overflow-hidden border border-dashed border-white-300">
          <Input
            name="media"
            onChange={handleFileInputChange}
            type="file"
            className="w-full h-[136px] bg-white-50 cursor-pointer"
          />
          <div className="absolute top-0 left-0 w-full h-[135px] bg-white-50 flex flex-col gap-2 justify-center items-center pointer-events-none">
            <CirclePlus />
            <h6 className="text-sm text-center px-4">
              Glissez et déposez ou cliquez ici pour choisir un fichier
            </h6>
            <div className="text-xs">Taille maximale 10MB</div>
          </div>
        </div>
      </div>
      {filesList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {filesList.map((file, index) => (
            <FileComponent
              key={index}
              link={file.fileUrl}
              fileName={file.name}
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

const StepThree = () => {
  const { participants, updateStep3 } = useMeetingForm();
  const [localParticipants, setLocalParticipants] =
    useState<string[]>(participants);

  const handleParticipantChange = (userEmail: string, checked: boolean) => {
    setLocalParticipants((prev) => {
      if (checked) {
        // Add participant if not already in the list
        if (!prev.some((p) => p === userEmail)) {
          return [...prev, userEmail];
        }
      } else {
        // Remove participant if unchecked
        return prev.filter((p) => p !== userEmail);
      }
      return prev;
    });
  };

  useEffect(() => {
    updateStep3(localParticipants);
  }, [localParticipants, updateStep3]);

  const [users, setUsers] = useState<OrganizationMember[]>([]);
  useEffect(() => {
    const fun = async () => {
      try {
        let storedData = "";
        if (typeof window !== "undefined") {
          storedData = JSON.parse(getCookies("userInfo") || "{}");
        }

        console.log("token", storedData);
        const response = await getOrganisationMembers();
        setUsers(response);
      } catch (error) {
        console.error(error);
      }
    };
    fun();
  }, []);
  const [localEmail, setLocalEmail] = useState<string>("");

  return (
    <div className="flex flex-col gap-4 rounded-[12px] py-5 sm:py-8 md:py-10 px-4 sm:px-8 md:px-16 lg:px-20 w-full">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-end w-full">
        <div className="relative w-full">
          <Label
            htmlFor="membres_cse_invites"
            className="font-medium text-white-800 text-xs mb-2 block"
          >
            Invitez des gens à votre réunion (emails séparés par virgule)
          </Label>
          <Input
            value={localEmail}
            onChange={(e) => {
              setLocalEmail(e.target.value);
            }}
            id="membres_cse_invites"
            name="membres_cse_invites"
            type="email"
            placeholder="invite1@gmail.com, invite2@gmail.com"
            className="w-full"
          />
        </div>

        <Button
          variant="default"
          className="rounded-[8px] bg-gradient-to-r from-[#FE6539] to-crimson-400 mt-2 sm:mt-0 whitespace-nowrap"
          onClick={() => {
            console.log("localEmail", localEmail);
            const tempEmail: string = localEmail.replace(" ", "");
            const emails = tempEmail.split(",");
            emails.forEach((email) => {
              email.trim();
            });
            const validEmails = emails.filter((email) => {
              const emailRegex =
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
              return emailRegex.test(email);
            });
            if (validEmails.length < emails.length) {
              console.log("emails", emails);
              console.log("validEmails", validEmails);
              console.log("emails.length", emails.length);
              console.log("validEmails.length", validEmails.length);
              toast.error(
                "Veuillez entrer des adresses email valides et les séparés d'une virgule"
              );
              return;
            }

            validEmails.forEach((email) => {
              setLocalParticipants((prev) => {
                if (!prev.some((p) => p === email)) {
                  return [...prev, email];
                }
                return prev;
              });
            });
            console.log(validEmails);
            setLocalEmail("");
            toast.success(
              "Des messages d'invitations seront envoyés à ces adresses une fois la réunion créée"
            );
          }}
        >
          Inviter
        </Button>
      </div>
      <div className="w-full">
        <h6 className="font-medium text-[10px] mb-2">Qui a accès ?</h6>
        {users.length === 0 ? (
          <p>Aucun membre appartenant à votre organisation trouvé</p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {users.map((user, index) => (
              <div
                key={index}
                className="flex justify-between items-center flex-wrap sm:flex-nowrap p-1 hover:bg-gray-50 rounded"
              >
                <div className="flex gap-3 items-center mb-1 sm:mb-0">
                  <div className="h-[28px] w-[28px] flex items-center justify-center border border-dashed rounded-full flex-shrink-0">
                    <Image
                      src={"user-icon.svg"}
                      width={16}
                      height={19}
                      alt="user icon"
                    />
                  </div>

                  <span className="text-sm truncate max-w-[240px] sm:max-w-xs">
                    {user.email}
                  </span>
                </div>
                <Checkbox
                  color="black"
                  checked={localParticipants.some((p) => p === user.email)}
                  onCheckedChange={(checked) =>
                    handleParticipantChange(user.email, checked as boolean)
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StepFour = () => {
  return (
    <div className="w-full px-4 sm:px-0">
      <h6 className="font-medium text-gray-700 text-sm mb-3">Ordre du jour</h6>
      <Editor />
    </div>
  );
};
