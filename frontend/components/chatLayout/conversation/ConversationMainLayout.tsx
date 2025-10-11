"use client";
import React from "react";
import ConversationHeader from "./conversationHeader/ConversationHeaderLayout";
import ConversationMessageSend from "./ConversationMessageSend";
import ConversationArchitecture from "./ConversationArchitecture";

const ConversationMainLayout = () => {
  return (
    <div className="flex flex-col col-span-6 space-y-4 border-r-[1px]">
      <ConversationHeader />
      <ConversationArchitecture />
      <ConversationMessageSend />
    </div>
  );
};

export default ConversationMainLayout;
