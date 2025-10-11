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
import { User } from "@/types";
import { socketEventTypes, SocketListener } from "@/lib/utils";
import {
  addUser,
  removeUser,
} from "../store/slices/usersReducer";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "next-themes";
import { RootState } from "../store/store";
import { useSession } from "../store/slices/AuthReducer";
import { Mutations } from "@/actions/mutations";
import useMediaQuery from "@mui/material/useMediaQuery";
import { JoinSocketController } from "@/lib/socket";

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
  isActive: (id: string) => boolean;
  UseMediaQuery: ({ MEDIA_TYPE }: UseMediaQueryProps) => boolean;
  unseenMessages: number;
  setUnseenMessages: Dispatch<SetStateAction<number>>;
}

export enum ResponsiveMedia {
  IS_MOBILE = "640px",
  IS_TABLET = "768px",
  IS_LAPTOP = "1024px",
  IS_DESKTOP = "1280px",
  IS_WIDE = "1536px",
}

type UseMediaQueryProps = {
  MEDIA_TYPE: ResponsiveMedia;
};

const DashboardContext = createContext<DashboardContextProps | null>(null);

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useDispatch();

  const [api, contextHolder] = notification.useNotification();
  const updateSession = Mutations.useReissueAccessToken(api);
  const [state, setState] = useState<boolean>(false);

  const { session } = useSession();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [friend, setFriend] = useState<User | undefined>(undefined);
  const { theme, setTheme } = useTheme();
  const { onlineUsers } = useSelector((state: RootState) => state.users);
  const [unseenMessages, setUnseenMessages] = useState<number>(0);
  const UseMediaQuery = ({ MEDIA_TYPE }: UseMediaQueryProps): boolean => {
    return useMediaQuery(`(min-width:${MEDIA_TYPE})`);
  };
  const isActive = (id: string): boolean => {
    const filiteredActiveUser = onlineUsers.filter((user) => user === id);

    return filiteredActiveUser && filiteredActiveUser.length > 0;
  };

  const reissueAccessToken = (userId: string) => {
    updateSession.mutate({ id: userId });
    api.success({
      description: "profile update",
      message: "image updated successfully",
      duration: 1000,
      showProgress: false,
    });
  };
  const handleAddUserOnline = (id: string) => {
    dispatch(addUser(id));
  };

  const handleRemoveUserOnline = (id: string) => {
    dispatch(removeUser(id));
  };
  // 👇 initialize socket only when session is ready
  const SocketContructor = new JoinSocketController(session);

  useEffect(() => {
    const token = session.accessToken;
    if (!token) return;

    if (!socketRef.current) {
      socketRef.current = io(
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090",
        {
          auth: { token },
          withCredentials: true,
          autoConnect: true,
          reconnection: true,
        }
      );
      setSocket(socketRef.current);

      socketRef.current.on("connect", () => {
        console.log("✅ Socket connected:", socketRef.current?.id);
        if (socketRef.current)
          SocketContructor.initializeEventHandlers(socketRef.current);
      });

      SocketListener({
        socket: socketRef.current,
        eventValue: socketEventTypes.ONLINE_USERS,
        setUser: handleAddUserOnline,
      });

      SocketListener({
        socket: socketRef.current,
        eventValue: socketEventTypes.OFFLINE_USERS,
        setUser: handleRemoveUserOnline,
      });

      SocketListener({
        socket: socketRef.current,
        eventValue: socketEventTypes.IMAGE_UPDATED,
        setUser: reissueAccessToken,
      });

      socketRef.current.on("disconnect", () => {
        console.log("❌ Socket disconnected");
        if (socketRef.current)
          SocketContructor.leaveSocketHandler(socketRef.current); // needs refactoring, no emition on disconnection
      });
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [session.accessToken]);
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
        isActive,
        UseMediaQuery,
        setUnseenMessages,
        unseenMessages,
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
