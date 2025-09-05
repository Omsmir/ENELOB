"use client";
import React, { useEffect } from "react";
import ChatHeader from "./ChatHeader";
import Emulator from "./Emulator";

import MessagesLayout from "./MessagesLayout";

const Chat = () => {
  return (
    <div className="flex flex-col col-span-6 space-y-4 border-r-[1px] ">
      <ChatHeader />

      <MessagesLayout />
      <Emulator />
    </div>
  );
};

export default Chat;
