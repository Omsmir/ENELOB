"use client";
import { User } from "@/types";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface ConversationProviderProps {
  setUnseenMessages: Dispatch<SetStateAction<number>>;
  unseenMessages: number;
}

const ConversationContext = createContext<ConversationProviderProps | null>(
  null
);

export const ConversationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [unseenMessages, setUnseenMessages] = useState<number>(0);
  return (
    <ConversationContext.Provider value={{ unseenMessages, setUnseenMessages }}>
      {children}
    </ConversationContext.Provider>
  );
};

export const ConversationHook = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(
      "Conversation Hook must be used within Conversation Provider"
    );
  }
  return context;
};
