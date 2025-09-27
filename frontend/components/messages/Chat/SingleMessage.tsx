"use client";
import { DashboardHook } from "@/components/context/Dashboardprovider";
import { useSession } from "@/components/store/slices/AuthReducer";
import { Message } from "@/types";
import { CheckOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";
import { DoneAll } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store/store";
interface SingleProp {
  displayName: string;
  sentAt: Date;
  children: React.ReactNode;
}

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
  const { friend } = DashboardHook();
  const conversationId = useSelector((state:RootState) => state.users.conversationId)

  const MessageContent = ({
    content,
    seen,
    userId,
  }: {
    content: string;
    seen?: boolean;
    userId: string;
  }) => {
    return (
      <div className="relative flex w-full bg-white dark:bg-slate-800 p-4 rounded-md shadow-sm my-2 max-w-xs md:max-w-md lg:max-w-md  break-words whitespace-pre-wrap ">
        <p>{content}</p>
        {userId === session._id && (
          <span className="absolute right-0 bottom-0 mr-2 mb-1">
            <DoneAll
              className={`${
                seen === true ? "text-green-700" : "text-slate-500"
              } !text-[16px]`}
            />
          </span>
        )}
      </div>
    );
  };
  if (group.userId === session._id) {
    return (
      <div className={`flex flex-row-reverse justify-start p-4 `}>
        <div className="size-16 overflow-hidden rounded-full ">
          <Image
            src={session.profileImg || "/assets/images/dr-green.png"}
            width={1000}
            height={1000}
            alt="logo"
            className=" w-full h-full object-center object-cover"
          />
        </div>
        <MessageComponent
          displayName={"You"}
          sentAt={group.sentAt}
        >
          {group.messages.map((message, index) => (
            <MessageContent
              userId={message.userId}
              seen={message.seen}
              content={message.content as string}
              key={index}
            />
          ))}
        </MessageComponent>
      </div>
    );
  } else if(group.userId === conversationId) {
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
        <MessageComponent
          displayName={friend?.full_name || ""}
          sentAt={group.sentAt}
        >
          {group.messages.map((message, index) => (
            <MessageContent
              userId={message.userId}
              key={index}
              content={message.content as string}
            />
          ))}
        </MessageComponent>
      </div>
    );
  }
};

export default SingleMessage;
