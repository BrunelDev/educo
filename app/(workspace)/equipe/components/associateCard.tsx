import { removeFromTeam, User } from "@/lib/api/equipe";
import Image from "next/image";
import Link from "next/link";

interface AssociateCardProps {
  associate: User;
}
export default function AssociateCard({ associate }: AssociateCardProps) {
  return (
    <div className="bg-[#FFFFFF99] w-[330px] h-[140px] p-3 rounded-[8px] flex flex-col justify-between">
      <div className="flex justify-between">
        <Image
          src={associate.image || "/userProfile-img.png"}
          width={60}
          height={60}
          alt="user image"
        />
        <button
          className="p-3 h-1 overflow-hidden hover:bg-gray-100 rounded-lg"
          onClick={async () => {
            try {
              const res = await removeFromTeam(associate.id);
              console.log(res);
            } catch (error: unknown) {
              console.error("Failed to remove associate from team", error);
            }
          }}
        >
          <Image
            src={"/dash-icon.svg"}
            width={9.3}
            height={1}
            alt="dash icon"
          />
        </button>
      </div>

      <h6 className="text-xl font-semibold text-white-800">
        {associate.first_name}
      </h6>
      <div className="flex justify-between">
        <h6 className="font-medium text-xs">{associate.email}</h6>
        <Link href={"/messages"} className="rounded-[8px] flex items-center justify-center bg-white-100 text-white-800 text-xs font-semibold h-[28px] w-fit py[6px] px-[8px] p-x">
          <h6>Message</h6>
        </Link>
      </div>
    </div>
  );
}
