import { Button } from "@/components/ui/button";
import { Associate } from "@/lib/types";
import Image from "next/image";

export default function AssociateCard({ associate }: Associate) {
  return (
    <div className="bg-[#FFFFFF99] w-[330px] h-fit p-3 rounded-[8px] flex flex-col justify-between">
      <div className="flex justify-between">
        <Image
          src={associate.profileImageUrl}
          width={60}
          height={60}
          alt="user image"
        />
        <Image
          src={"/dash-icon.svg"}
          width={9.3}
          height={1}
          alt="dash icon"
        />
      </div>

          <h6 className="text-xl font-semibold text-white-800">{associate.name}</h6>
          <div className="flex justify-between">
      <h6>{associate.email}</h6>
              <Button className="bg-white-100"><h6>Message</h6></Button>
          </div>
    </div>
  );
}
