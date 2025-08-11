import { Input } from "@/components/ui/input";
import { deleteMeeting, updateMeeting } from "@/lib/api/reunion";
import { formatDateToFrench } from "@/lib/functions";
import { Meeting } from "@/lib/types";
import { useMeetingStore } from "@/store/meetings";
import {
  CalendarDays,
  Check,
  Ellipsis,
  FilePenLine,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Popover } from "../../components/popover";

interface MeetingCardProps {
  meeting: Meeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  return (
    <div className="bg-[#FFFFFF99] rounded-[8px] py-2 px-3 w-full sm:w-[350px] relative">
      <Link
        href={`/reunions/details_de_la_reunion/${meeting.id}`}
        className="flex flex-col gap-2"
      >
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-coral-100"></div>{" "}
              <h6 className="text-xs font-semibold">{meeting.type_reunion}</h6>
            </div>
            <h3 className="font-bold">{meeting.titre}</h3>
            <p className="text-sm text-gray-600">{meeting.objet}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="w-fit flex gap-2 text-xs">
            <CalendarDays size={14} />
            <h6>{formatDateToFrench(meeting.date_heure_debut.toString())}</h6>
          </div>

          <div className="flex gap-2">
            {meeting.emplacement.includes("En ligne") && (
              <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-600">
                En ligne
              </span>
            )}
            {meeting.emplacement.includes("En Physique") && (
              <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-600">
                En présence
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex -space-x-2 overflow-hidden">
            {meeting.participants && meeting.participants.length > 0 ? (
              meeting.participants.map((attendee, index) => (
                <Image
                  key={attendee.utilisateur_details?.id || index} // Use a more stable key if possible
                  src={attendee.utilisateur_details?.photo || "/userProfile-img.png"} // Fallback to a default icon
                  alt={attendee.utilisateur_details?.nom_complet || `Participant ${index + 1}`}
                  width={32}
                  height={32}
                  className="rounded-full h-8 w-8 border-2 border-white object-cover"
                  onError={(e) => {
                    // Fallback if the primary image fails to load
                    (e.target as HTMLImageElement).onerror = null; 
                    (e.target as HTMLImageElement).src = "/userProfile-img.png";
                  }}
                />
              ))
            ) : (
              <div className="text-xs text-gray-500 italic pr-2">Aucun participant</div>
            )}
          </div>

          <div
            className={`w-6 h-6 rounded-full bg-white-50 border border-crimson-200 flex justify-center items-center cursor-pointer`}
          >
            {new Date(meeting.date_heure_debut).getTime() < new Date().getTime() && (
              <Check color="#FF264F" size={18} />
            )}
          </div>
        </div>
      </Link>
      <Popover
        PopoverContent={<PopoverContent meeting={meeting} />}
        PopoverTrigger={
          <div className="p-1 absolute right-2 top-3 z-50 hover:bg-white-100 flex justify-center items-center rounded-[8px]">
            <Ellipsis size={20} />
          </div>
        }
      />
    </div>
  );
}

interface PopoverContentProps {
  meeting: Meeting;
}

const PopoverContent = ({ meeting }: PopoverContentProps) => {
  const [updatedName, setUpdatedName] = useState(meeting.titre);
  const deleteMeetingFromStore = useMeetingStore(
    (state) => state.deleteMeeting
  );

 

  // Function to handle meeting deletion
  const handleDelete = async () => {
    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer la réunion "${meeting.titre}" ?`
      )
    ) {
      try {
        await deleteMeeting(meeting.id);
        // Update the store if it's being used
        deleteMeetingFromStore(meeting.id);
        toast.success("Réunion supprimée avec succès");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting meeting:", error);
        toast.error("Erreur lors de la suppression de la réunion");
      }
    }
  };

  // Function to update the meeting name
  const handleUpdateMeetingName = async () => {
    if (!updatedName.trim()) {
      toast.error("Le nom de la réunion ne peut pas être vide");
      return;
    }

    try {
      await updateMeeting(meeting.id, { titre: updatedName });
      toast.success("Réunion renommée avec succès");
      window.location.reload();
    } catch (error) {
      console.error("Error updating meeting:", error);
      toast.error("Erreur lors de la mise à jour de la réunion");
    }
  };

  return (
    <div className="py-2 px-1 text-sm w-[125px] flex flex-col gap-[6px]">
     

      <div className="hover:bg-gray-100 cursor-pointer rounded-[4px] px-2 flex items-center justify-around py-1">
        <FilePenLine size={18} />
        <Popover
          PopoverContent={
            <div>
              <Input
                placeholder="Nom de la réunion"
                value={updatedName}
                onChange={(e) => {
                  setUpdatedName(e.target.value);
                }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    handleUpdateMeetingName();
                  }
                }}
              />
            </div>
          }
          PopoverTrigger={<h6>Renommer</h6>}
        />
      </div>

      <div
        className="hover:bg-gray-100 cursor-pointer rounded-[4px] px-2 flex items-center justify-around py-1 text-red-600"
        onClick={handleDelete}
      >
        <Trash2 size={18} />
        <h6>Supprimer</h6>
      </div>
    </div>
  );
};
