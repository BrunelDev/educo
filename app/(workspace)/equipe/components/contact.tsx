import { DialogComponent } from "@/app/_components/dialogComponent";
import { Button } from "@/components/ui/button";
import { getOrganization, OrganizationResponse } from "@/lib/api/organisation";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import UpdateOrganisationForm from "./updateOrganisation";
export default function Contact() {
  const contact = {
    enterpriseImageUrl: "/enterprise-image.png",
    enterpriseName: "ACME Solutions",
    expertiseDomain: "Technologie & Innovation",
    telephone: "00000075112",
    email: "contact@acme-solutions.com",
    address: "10 Rue des Startups, 75000 Paris, France",
  };
  const [organisation, setOrganisation] = useState<OrganizationResponse>()
  useEffect(() => {
    const fetchOrganisation = async () => {
      const response = await getOrganization()
      setOrganisation(response)
    }
      fetchOrganisation()
  }, [])
  if(organisation)
  {return (
    <div className="w-full bg-[#FFFFFF99] flex flex-col gap-3 rounded-[8px] p-3">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <Image
            src={organisation.organisation.logo ? organisation.organisation.logo : "/enterprise-image.png"}
            width={60}
            height={60}
            alt="enterprise logo"
            className="rounded-full w-[60px] h-[60px]"
          />
          <div className="flex flex-col justify-around">
            <h4 className="font-bold text-2[18px]">{organisation?.organisation.nom_entreprise}</h4>
            <h6 className="font-medium text-[14px]">
              {organisation?.organisation.secteur_activite}
            </h6>
          </div>
        </div>
        <DialogComponent className={
          "sm:max-w-[768px] flex justify-center items-center"
        } dialoTrigger={<Button className="bg-white-100 hover:bg-white-200 text-white-800 text-xs">
          Modifier
          </Button>} dialogContent={<UpdateOrganisationForm orgId={organisation?.organisation.id} />} dialogTitle={null}/>
        
      </div>

      <div className="flex justify-between text-sm font-medium">
        <div className="w-fit flex items-center gap-2">
          <Phone />
          <h6>{contact.telephone}</h6>
        </div>
        <div className="w-fit flex items-center gap-2">
          <MapPin />

          <h6>{organisation.organisation.adresse_siege}</h6>
        </div>

        <div className="w-fit flex items-center gap-2">
          <Mail />

          <h6>{organisation.organisation.createur.email}</h6>
        </div>
      </div>
    </div>
  );}
}
