import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { getCookies } from '@/lib/utils/cookies';
import { getOrganisationMembers, OrganizationMember } from '@/lib/api/organisation';

export default function TeamFormHandler() {
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
  return (
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
                <Input type="checkbox" />
              </div>
            </div>
          ))}
        </div>
  )
}
