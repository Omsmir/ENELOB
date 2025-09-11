"use client";
import { DashboardHook } from "@/components/context/Dashboardprovider";
import { useSession } from "@/components/store/slices/AuthReducer";
import { Message } from "@/types";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";

interface SingleProp {
  displayName: string;
  sentAt: Date;
  children: React.ReactNode;
}

const MessageContent = ({ content }: { content: string }) => {
  return (
    <div className="flex w-full bg-white dark:bg-slate-800 p-4 rounded-md shadow-sm my-2 sm:max-w-[350px]">
      <p className="">{content}</p>
    </div>
  );
};

const MessageComponent = ({ sentAt, displayName, children }: SingleProp) => {
  return (
    <div className="flex flex-col justify-start items-start px-4">
      <div className="flex justify-between items-center !min-w-[200px] w-full">
        <h1 className="font-medium capitalize ">{displayName}</h1>
        <p className="text-sm text-slate-400 uppercase">
          {format(sentAt, "p")}
        </p>
      </div>
      {children}
    </div>
  );
};

const SingleMessage = ({
  group,
}: {
  group: {
    userId: string;
    sentAt: Date;
    messages: Message[];
  };
}) => {
  const { session } = useSession();
  const {friend} = DashboardHook()

  if (group.userId === session._id) {
    return (
      <div className={`flex flex-row-reverse justify-start p-4 `}>
        <div className="size-16 overflow-hidden rounded-full ">
          <Image
            src={session.profileImg||"/assets/images/dr-green.png"}
            width={1000}
            height={1000}
            alt="logo"
            className=" w-full h-full object-center object-cover"
          />
        </div>
        <MessageComponent
          displayName={session.full_name || ""}
          sentAt={group.sentAt}
        >
          {group.messages.map((message, index) => (
            <MessageContent content={message.content as string} key={index} />
          ))}
        </MessageComponent>
      </div>
    );
  } else {
    return (
      <div className={`flex  justify-start p-4 `}>
        <div className="size-16 overflow-hidden rounded-full ">
          <Image
            src={friend?.profileImg?.url || "/assets/images/dr-green.png"}
            width={1000}
            height={1000}
            alt="logo"
            className=" w-full h-full object-center object-cover"
          />
        </div>
        <MessageComponent displayName={friend?.full_name || ""} sentAt={group.sentAt}>
          {group.messages.map((message, index) => (
            <MessageContent key={index} content={message.content as string} />
          ))}
        </MessageComponent>
      </div>
    );
  }
};

export default SingleMessage;
