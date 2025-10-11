"use client"
import ChatLayout from "@/components/chatLayout/ChatLayout";
import React from "react";

const page =  () => {

  return (
    <div className="flex flex-col justify-center items-start pt-14  h-screen space-y-8 ">
      <ChatLayout />
    </div>
  );
};

export default page;
