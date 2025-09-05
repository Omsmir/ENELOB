"use client";
import {
  Dispatch,
  JSXElementConstructor,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
} from "react";

import { createContext, useContext, useState } from "react";
import { notification } from "antd";
import { NotificationInstance } from "antd/es/notification/interface";

import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useSession } from "next-auth/react";
import { User } from "@/types";
import { socketEventTypes, SocketListener } from "@/lib/utils";
import { addUser, removeUser } from "../store/slices/usersReducer";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "next-themes";
import { RootState } from "../store/store";

interface DashboardContextProps {
  api: NotificationInstance;
  contextHolder: ReactElement<any, string | JSXElementConstructor<any>>;
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  setFriend: Dispatch<SetStateAction<User | undefined>>;
  friend: User | undefined;
  theme: string | undefined;
  setTheme: Dispatch<SetStateAction<string>>;
  isActive: (id: string) => boolean
}

const DashboardContext = createContext<DashboardContextProps | null>(null);

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
    const dispatch = useDispatch();

  const [api, contextHolder] = notification.useNotification();
  const [state, setState] = useState<boolean>(false);

  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [friend, setFriend] = useState<User | undefined>(undefined);
  const { theme, setTheme } = useTheme();
  const { onlineUsers } = useSelector((state: RootState) => state.users);

  const isActive = (id: string): boolean => {
    const filiteredActiveUser = onlineUsers.filter((user) => user === id);

    return filiteredActiveUser && filiteredActiveUser.length > 0;
  };


  const handleAddUserOnline = (id: string) => {
    dispatch(addUser(id));
  };

  const handleRemoveUserOnline = (id: string) => {
    console.log("remove", id);
    dispatch(removeUser(id));
  };
  // 👇 initialize socket only when session is ready
  useEffect(() => {
    const token = session?.user.accessToken;
    if (!token) return;

    if (!socketRef.current) {
      socketRef.current = io("http://localhost:8090", {
        auth: { token },

        autoConnect: true,
        reconnection: true,
      });

      socketRef.current.on("connect", () => {
        console.log("✅ Socket connected:", socketRef.current?.id);
      });

      SocketListener({
        socket: socketRef.current,
        eventValue: socketEventTypes.ONLINE_USERS,
        tone: "message",
        setUser: handleAddUserOnline,
      });

      SocketListener({
        socket: socketRef.current,
        eventValue: socketEventTypes.OFFLINE_USERS,
        tone: "message",
        setUser: handleRemoveUserOnline,
      });

      socketRef.current.on("disconnect", () => {
        console.log("❌ Socket disconnected");
      });

      setSocket(socketRef.current);
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [session?.user.accessToken]);
  // Tables

  return (
    <DashboardContext.Provider
      value={{
        api,
        contextHolder,
        state,
        setState,
        setIsLoading,
        isLoading,
        loading,
        setLoading,
        socket,
        setFriend,
        friend,
        theme,
        setTheme,
        isActive
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const DashboardHook = () => {
  const Context = useContext(DashboardContext);
  if (!Context) {
    throw new Error("Dashboard Context Must Be within the DashboardHook");
  }

  return Context;
};
