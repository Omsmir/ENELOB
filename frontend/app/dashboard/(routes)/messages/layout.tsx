import { ConversationProvider } from "@/components/context/ConversationProvider";
import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
    description:"ENELOB - Conversations"
}

const layout = ({ children }: { children: React.ReactNode }) => {
  return <ConversationProvider>{children}</ConversationProvider>;
};

export default layout;
