import { DialogComponent } from "@/app/_components/dialogComponent";
import { Button } from "@/components/ui/button";
import { getOrganization, OrganizationResponse } from "@/lib/api/organisation";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import UpdateOrganisationForm from "./updateOrganisation";
export default function Contact() {
 
  const [organisation, setOrganisation] = useState<OrganizationResponse>();
  const [isUpdateOrgFormOpen, setIsUpdateOrgFormOpen] = useState(false);

  const fetchOrganisation = useCallback(async () => {
    try {
      const response = await getOrganization();
      setOrganisation(response);
    } catch (error) {
      console.error("Error fetching organisation:", error);
    }
  }, []);

  useEffect(() => {
    fetchOrganisation();
  }, [fetchOrganisation]);

  const handleFormClose = async () => {
    setIsUpdateOrgFormOpen(false);
    await fetchOrganisation();
  };
  if(organisation)
  {return (
    <div className="w-full bg-[#FFFFFF99] flex flex-col gap-3 rounded-[8px] p-3 sm:p-4">
      {/* Header with logo and organization info */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0">
        <div className="flex gap-3 items-center">
          <Image
            src={organisation.organisation.logo ? organisation.organisation.logo : "/enterprise-image.png"}
            width={60}
            height={60}
            alt="enterprise logo"
            className="rounded-full w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] object-cover"
          />
          <div className="flex flex-col justify-center">
            <h4 className="font-bold text-[16px] sm:text-[18px] line-clamp-1">{organisation?.organisation.nom_entreprise}</h4>
            <h6 className="font-medium text-[12px] sm:text-[14px] text-gray-600 line-clamp-1">
              {organisation?.organisation.secteur_activite}
            </h6>
          </div>
        </div>
        <div className="self-start sm:self-center">
          <DialogComponent
            open={isUpdateOrgFormOpen}
            onOpenChange={setIsUpdateOrgFormOpen}
            className="sm:max-w-[768px] flex justify-center items-center"
            dialoTrigger={
              <Button className="bg-white-100 hover:bg-white-200 text-white-800 text-xs h-8">
                Modifier
              </Button>
            } 
            dialogContent={<UpdateOrganisationForm orgId={organisation?.organisation.id} handleClose={handleFormClose} />} 
            dialogTitle={null}
          />
        </div>
      </div>

      {/* Contact information section */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-2 text-sm font-medium">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-gray-500" />
          <h6 className="text-[12px] sm:text-sm truncate">{"organisation.organisation.createur.telephone"}</h6>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-gray-500" />
          <h6 className="text-[12px] sm:text-sm truncate max-w-[200px] sm:max-w-[250px]">{organisation.organisation.adresse_siege}</h6>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-gray-500" />
          <h6 className="text-[12px] sm:text-sm truncate">{organisation.organisation.createur.email}</h6>
        </div>
      </div>
    </div>
  );}
}
