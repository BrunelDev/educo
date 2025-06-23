import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  getOrganisationMembers,
  OrganizationMember,
} from "@/lib/api/organisation";
import { createProject } from "@/lib/api/projets";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CreateProjectParams {
  title: string;
  description: string;
  status: string;
  participants: number[];
  team: number;
}

export default function ProjectForm({
  teamId,
  onSubmit,
}: {
  teamId: number;
  onSubmit: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await getOrganisationMembers();
        setMembers(response);
      } catch (error: unknown) {
        console.error("Error fetching members:", error);
      }
    };
    fetchMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error("Le titre du projet est requis");
      return;
    }

    if (!description.trim()) {
      toast.error("La description du projet est requise");
      return;
    }

    if (selectedMembers.length === 0) {
      toast.error("Veuillez sélectionner au moins un participant");
      return;
    }

    try {
      const projectData: CreateProjectParams = {
        title: title.trim(),
        description: description.trim(),
        status: "en_cours", // default status
        participants: selectedMembers,
        team: teamId,
      };
      console.log(projectData);

      await createProject(projectData);
      toast.success("Projet créé avec succès");

      // Reset form
      setTitle("");
      setDescription("");
      setSelectedMembers([]);
      onSubmit();
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.detail);
      }

      console.error("Error creating project:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-3">
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Titre du projet"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Description du projet"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      <div>
        <ScrollArea className="h-[100px] flex flex-col gap-2 mt-3">
          <h6 className="text-sm text-white-500 mb-3">Assigner à</h6>
          {members.map((member, index) => (
            <div key={member.id + index} className="flex justify-between px-4">
              <h6>
                {member.first_name ? member.first_name : member.email}{" "}
                {member.last_name}
              </h6>{" "}
              <Checkbox
                color="black"
                checked={selectedMembers.includes(member.id)}
                value={member.id}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedMembers([...selectedMembers, member.id]);
                  } else {
                    setSelectedMembers(
                      selectedMembers.filter((id) => id !== member.id)
                    );
                  }
                }}
              />
            </div>
          ))}
        </ScrollArea>
      </div>
      <Button
        type="submit"
        className="w-fit ml-auto self-end bg-linear-to-r from-coral-400 to-crimson-400"
      >
        Terminé
      </Button>
    </form>
  );
}
