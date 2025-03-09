import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
export default function Contact() {
  const contact = {
    enterpriseImageUrl: "/enterprise-image.png",
    enterpriseName: "ACME Solutions",
    expertiseDomain: "Technologie & Innovation",
    telephone: "00000075112",
    email: "contact@acme-solutions.com",
    address: "10 Rue des Startups, 75000 Paris, France",
  };
  return (
    <div className="w-full bg-[#FFFFFF99] flex flex-col gap-3 rounded-[8px] p-3">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <Image
            src={contact.enterpriseImageUrl}
            width={80}
            height={80}
            alt="enterprise logo"
            className="rounded-full"
          />
          <div className="flex flex-col justify-around">
            <h4 className="font-bold text-2[18px]">{contact.enterpriseName}</h4>
            <h6 className="font-medium text-[14px]">
              {contact.expertiseDomain}
            </h6>
          </div>
        </div>
        <Button className="bg-white-100 text-white-800 text-xs">
          Modifier
        </Button>
      </div>

      <div className="flex justify-between text-sm font-medium">
        <div className="w-fit flex items-center gap-2">
          <Phone />
          <h6>{contact.telephone}</h6>
        </div>
        <div className="w-fit flex items-center gap-2">
          <MapPin />

          <h6>{contact.address}</h6>
        </div>

        <div className="w-fit flex items-center gap-2">
          <Mail />

          <h6>{contact.email}</h6>
        </div>
      </div>
    </div>
  );
}
