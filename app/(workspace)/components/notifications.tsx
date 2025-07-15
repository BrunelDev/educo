"use client";
import { getNotifications } from "@/lib/api/notifications";
import { Notification, NotificationApiResponse } from "@/lib/api/notifications";
import Image from "next/image";
import { useEffect, useState } from "react";

export function Notifications() {
  const [displayNotifications, setDisplayNotifications] =
    useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationApiResponse>();
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        console.log(response);
        setNotifications(response);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <main className="z-[9999999999]">
      {displayNotifications ? (
        <NotificationComponent
          handleClick={() => {
            setDisplayNotifications((v) => !v);
          }}
          notifications={notifications?.results}
        />
      ) : (
        <NotificationIcon
          handleClick={() => {
            setDisplayNotifications((v) => !v);
          }}
        />
      )}
    </main>
  );
}

const NotificationIcon = ({ handleClick }: { handleClick: () => void }) => (
  <div
    className="bg-[#FFFFFF80] border border-white-50 w-8 h-8 rounded-lg flex justify-center items-center cursor-pointer hover:bg-white-100"
    onClick={() => {
      handleClick();
    }}
  >
    <div className="relative">
      <Image src={"/bell.svg"} width={16.6} height={18} alt="bell icon" />
      <div className="absolute bg-crimson-500 w-2 h-2 rounded-full top-0 right-0"></div>
    </div>
  </div>
);

const NotificationComponent = ({
  handleClick,
  notifications,
}: {
  notifications?: Notification[];
  handleClick: () => void;
}) => {
  if (notifications) {
    return (
      <div className="h-screen w-[360px] rounded-[12px] py-10 px-5 flex flex-col gap-[10px] border border-white-100 bg-white">
        <div className="flex justify-between">
          <h3 className="text-xl text-white-800 font-bold">Notifications</h3>
          <div className="h-7 w-7 rounded-lg flex justify-center items-center hover:bg-coral-50">
            <Image
              src={"/cross.svg"}
              width={15}
              height={15}
              alt="cross icon"
              onClick={() => {
                handleClick();
              }}
              className="cursor-pointer"
            />
          </div>
        </div>
        {notifications.length === 0 ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-white-800">Aucune notification</p>
          </div>
        ) : (
          <div className="flex flex-col py-2 w-full overflow-scroll no-scrollbar">
            {notifications.map((notification, index) => (
              <NotificationItem
                notification={notification}
                key={index + notification.id}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
};

const NotificationItem = ({ notification }: { notification: Notification }) => {
  return (
    <div className="relative border-b border-dashed hover:px-3 group hover:bg-white-100 rounded-lg py-1 duration-200 w-full">
      {notification.est_lu ? (
        <div className="absolute top-1/2 right-0 rounded-full bg-coral-500 w-1 h-1 group-hover:right-3 duration-200"></div>
      ) : null}
      <div className="flex w-full gap-2">
        <div className="rounded-full bg-gradient-to-r from-[#FE6539] to-crimson-400 w-[24px] h-[24px] flex justify-center items-center">
          <Image
            src={"/bell.svg"}
            width={13}
            height={11.5}
            alt="notification icon"
          />
        </div>

        <div className="flex justify-between w-[288px]">
          <h3 className="text-sm text-white-800 font-semibold">
            {notification.titre}
          </h3>
          <h6 className="text-xs text-gray-600">
            {new Date(notification.date_creation).getHours() +
              ":" +
              (new Date(notification.date_creation).getMinutes() < 10
                ? "0" + new Date(notification.date_creation).getMinutes()
                : new Date(notification.date_creation).getMinutes())}
          </h6>
        </div>
      </div>

      <p className="text-sm truncate">
        {notification.contenu_associe_info.str_representation}
      </p>
    </div>
  );
};
