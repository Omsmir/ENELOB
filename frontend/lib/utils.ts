"use client";
import { clsx, type ClassValue } from "clsx";
import { renderToStaticMarkup } from "react-dom/server";
import { twMerge } from "tailwind-merge";
import {
  ConversationUpatingResponseI,
  theme as CurrTheme,
  GroupMessageResponse,
  Message,
  ObjectType,
  tone,
  User,
} from "@/types";
import { GetProp, UploadProps } from "antd";
import { notificationSounds } from "./constants";
import * as Tone from "tone";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
export const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const theme = (
  theme: string | undefined,
  darkTheme: CurrTheme,
  lightTheme: CurrTheme
) => {
  switch (theme) {
    case "dark":
      return darkTheme;
    case "light":
      return lightTheme;
  }
};

export const ChangeJsxToString = ({
  Jsx,
}: {
  Jsx: React.ReactNode;
}): string => {
  const code = renderToStaticMarkup(Jsx);

  return code;
};
export const groupMessages = (
  messages: Message[]
): GroupMessageResponse | [] => {
  // const sorted = [...messages].sort(
  //   (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
  // );

  const groups: { userId: string; sentAt: Date; messages: typeof messages }[] =
    [];

  let currentGroup = null;

  for (const msg of messages) {
    if (!msg) return [];
    if (!currentGroup || currentGroup.userId !== msg.userId) {
      // start a new group
      currentGroup = {
        userId: msg.userId,
        sentAt: msg.sentAt,
        messages: [msg],
      };
      groups.push(currentGroup);
    } else {
      // push into existing group
      currentGroup.messages.push(msg);
    }
  }

  return groups.sort().reverse();
};

export const playSound = (tone: string) => {
  const notificationTone = notificationSounds("message");
  const player = new Tone.Player(`${notificationTone}`).toDestination();
  player.autostart = true;
};

export enum socketEventTypes {
  RECEIVE_NEW_MESSAGE = "receivePrivateMessage",
  ONLINE_USERS = "userOnline",
  OFFLINE_USERS = "userOffline",
}

type SocketListenerProps = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  setMessages?: (
    value: React.SetStateAction<ConversationUpatingResponseI[] | undefined>
  ) => void;
  setUser?: (id: string) => void;
  tone: tone;
  socketEvent?: string;
  eventValue: socketEventTypes;
  container?: React.RefObject<HTMLDivElement | null>;
};

export const SocketListener = ({
  socket,
  setMessages,
  tone,
  socketEvent,
  eventValue,
  setUser,
  container,
}: SocketListenerProps) => {
  if (!socket) return;

  switch (eventValue) {
    case socketEventTypes.RECEIVE_NEW_MESSAGE:
      const handleNewMessage = (data: { message: Message }) => {
        console.log("new message");
        if (setMessages) {
          setMessages((prev) => {
            if (!prev || prev.length === 0) {
              return [
                {
                  messages: [data.message],
                  prevCursor: "", // or provide an appropriate value
                  nextCursor: undefined,
                  count: 1,
                },
              ];
            }

            // clone previous pages
            const updated = [...prev];

            // update last page
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              messages: [...updated[updated.length - 1].messages, data.message],
            };

            return updated;
          });
        }
        playSound(tone);

        if (!container?.current) return;

        container.current.scrollTop = 0;
      };

      socket.on(
        `${socketEventTypes.RECEIVE_NEW_MESSAGE}`,
        (data: { message: Message }) => {
          handleNewMessage(data);
        }
      );
      break;
    case socketEventTypes.ONLINE_USERS:
      socket.on(
        `${socketEventTypes.ONLINE_USERS}`,
        async (data: { id: string }) => {
          if (setUser) {
            setUser(data.id);
          }
        }
      );
      break;

    case socketEventTypes.OFFLINE_USERS:
      socket.on(`${socketEventTypes.OFFLINE_USERS}`, (data: { id: string }) => {
        if (setUser) {
          setUser(data.id);
        }
      });
      break;
    default:
      return null;
  }
};
