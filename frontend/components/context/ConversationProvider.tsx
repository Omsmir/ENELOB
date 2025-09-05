"use client"
import { User } from "@/types";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface ConversationProviderProps {
  setFriend: Dispatch<SetStateAction<User | undefined>>;
  friend: User | undefined;
}

const ConversationContext = createContext<ConversationProviderProps | null>(
  null
);

export const ConversationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [friend, setFriend] = useState<User | undefined>(undefined);
  return (
    <ConversationContext.Provider value={{ friend, setFriend }}>
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
