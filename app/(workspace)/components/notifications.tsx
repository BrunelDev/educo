"use client";
import { NotificationItemProps, NotificationType, Notification } from "@/lib/types";
import Image from "next/image";
import { useState } from "react";

const notifications: Notification[] = [
    {
        id: 1,
        title: "New message received",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed volutpat ipsum sed turpis faucibus, ac tincidunt odio consectetur.",
        hour: "15:45",
        type: NotificationType.meeting,
        iconUrl: "/meeting-icon.svg",
        isRead: true,
      },{
        id: 1,
        title: "New message received",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed volutpat ipsum sed turpis faucibus, ac tincidunt odio consectetur.",
        hour: "15:45",
        type: NotificationType.meeting,
        iconUrl: "/meeting-icon.svg",
        isRead: false,
      },{
        id: 1,
        title: "New message received",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed volutpat ipsum sed turpis faucibus, ac tincidunt odio consectetur.",
        hour: "15:45",
        type: NotificationType.meeting,
        iconUrl: "/meeting-icon.svg",
        isRead: false,
      },{
        id: 1,
        title: "New message received",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed volutpat ipsum sed turpis faucibus, ac tincidunt odio consectetur.",
        hour: "15:45",
        type: NotificationType.meeting,
        iconUrl: "/meeting-icon.svg",
        isRead: false,
      },{
        id: 1,
        title: "New message received",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed volutpat ipsum sed turpis faucibus, ac tincidunt odio consectetur.",
        hour: "15:45",
        type: NotificationType.meeting,
        iconUrl: "/meeting-icon.svg",
        isRead: false,
      },
    
]
export default function Notifications() {
  const [displayNotifications, setDisplayNotifications] =
        useState<boolean>(false);
    
  return (
    <main className="z-50">
      {displayNotifications ? (
        <NotificationComponent
          handleClick={() => {
            setDisplayNotifications((v) => !v);
          }}
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
}: {
  handleClick: () => void;
}) => {
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
          <div className="flex flex-col gap-4">
              {notifications.map((notification, index) => (
                  <NotificationItem notification={notification} key={index +notification.id}/>
              ))}
          </div>
    </div>
  );
};



const NotificationItem = ({notification} : NotificationItemProps) => {
    return (
      <div className="relative border-b border-dashed hover:px-3 group hover:bg-white-100 rounded-lg py-1 duration-200 w-full">
        {notification.isRead ? (<div className="absolute top-1/2 right-0 rounded-full bg-coral-500 w-1 h-1 group-hover:right-3 duration-200"></div>) : null}
                <div className="flex w-full gap-2">
                    <div className="rounded-full bg-gradient-to-r from-[#FE6539] to-crimson-400 w-[24px] h-[24px] flex justify-center items-center">
                    <Image
                        src={notification.iconUrl}
                        width={13}
                        height={11.5}
                        alt="notification icon"
                    />
                    </div>
                    
                    <div className="flex justify-between w-[288px]">
                        <h3 className="text-sm text-white-800 font-bold">{notification.title}</h3>
                        <h6 className="text-xs text-gray-600">{notification.hour}</h6>
                    </div>
                </div>
                
            <p className="text-sm truncate">{notification.content}</p>

        </div>
    )
}