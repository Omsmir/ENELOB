"use client";
import React from "react";
import MessageEncasuplate from "./MessageEncasuplate";
import MessageContent from "./MessageContent";
import Image from "next/image";
import { group } from "./SingleMessageLayout";

interface MessageWrapperProps extends group {
  profileImgUrl: string | undefined;
  full_name: string;
  className?:string
}

const MessageWrapper = ({
  sentAt,
  messages,
  profileImgUrl,
  full_name,
  className
}: MessageWrapperProps) => {
  return (
    <div className={`flex flex-rowjustify-start p-4 ${className}`}>
      <div className="size-16 overflow-hidden rounded-full ">
        <Image
          src={profileImgUrl || "/assets/images/dr-green.png"}
          width={1000}
          height={1000}
          alt="logo"
          className=" w-full h-full object-center object-cover"
        />
      </div>
      <MessageEncasuplate displayName={full_name} sentAt={sentAt}>
        {messages.map((message, index) => (
          <MessageContent
            userId={message.userId}
            seen={message.seen}
            content={message.content as string}
            key={index}
          />
        ))}
      </MessageEncasuplate>
    </div>
  );
};

export default MessageWrapper;
