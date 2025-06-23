import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  getOrganisationMembers,
  OrganizationMember,
} from "@/lib/api/organisation";
import { createTask, CreateTaskDto, TaskType } from "@/lib/api/tache";
import { useEffect, useState } from "react";

import { uploadToS3 } from "@/lib/s3-upload";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function TaskForm({
  projectId,
  categoryLabel,
  onSubmitTask,
}: {
  projectId: number;
  categoryLabel: string;
  onSubmitTask: () => void;
}) {
  const defaultCategory =
    categoryLabel == "En cours"
      ? "en_cours"
      : categoryLabel == "Terminée"
      ? "termine"
      : "a_faire";
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateTaskDto>();
  setValue("task_type", defaultCategory);
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
  const [file, setFile] = useState<File>();

  const onSubmit = async (data: CreateTaskDto) => {
    try {
      if (file) {
        const file_url = await uploadToS3([file]);
        data.fichiers_urls = [file_url[0]];
      }

      data.project = projectId;
      // Set the selected members to assigned_member_ids
      data.assigned_member_ids = selectedMembers;

      console.log(data);
      await createTask(data);
      toast("La tâche a été créée");
      onSubmitTask();
      //window.location.reload();
    } catch (error: unknown) {
      toast("La création de la tâche a échoué");
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-3">
      <div>
        <Input
          {...register("title", { required: "Le titre est requis" })}
          placeholder="Titre de la tâche"
        />
        {errors.title && (
          <span className="text-red-500 text-sm">{errors.title.message}</span>
        )}
      </div>

      <div>
        <Textarea
          {...register("description")}
          placeholder="Description de la tâche"
        />
        {errors.description && (
          <span className="text-red-500 text-sm">
            {errors.description.message}
          </span>
        )}
      </div>

      <div>
        <Select
          onValueChange={(value) => setValue("task_type", value as TaskType)}
          defaultValue={defaultCategory}
        >
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Choisissez le statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel></SelectLabel>
              <SelectItem value="en_cours">En cours</SelectItem>
              <SelectItem value="a_faire">A faire</SelectItem>
              <SelectItem value="termine">Terminée</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.task_type && (
          <span className="text-red-500 text-sm">
            {errors.task_type.message}
          </span>
        )}
      </div>

      <div>
        <Input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
      </div>

      <div>
        <ScrollArea className="h-[100px] flex flex-col gap-2 mt-3">
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

        {errors.assigned_member_ids && (
          <span className="text-red-500 text-sm">
            {errors.assigned_member_ids.message}
          </span>
        )}
      </div>

      <Button
        className="text-white font-medium bg-linear-to-r from-[#FE6539] to-crimson-400 w-full"
        variant="default"
        type="submit"
      >
        Créer la tâche
      </Button>
    </form>
  );
}
