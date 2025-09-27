"use client";
import { clsx, type ClassValue } from "clsx";
import { renderToStaticMarkup } from "react-dom/server";
import { twMerge } from "tailwind-merge";
import {
  ConversationUpatingResponseI,
  theme as CurrTheme,
  GroupMessageResponse,
  Message,
  tone,
} from "@/types";
import { GetProp, UploadProps } from "antd";
import { notificationSounds } from "./constants";
import * as Tone from "tone";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { differenceInMinutes } from "date-fns";

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

  const groups: {
    index: string;
    userId: string;
    sentAt: Date;
    messages: typeof messages;
  }[] = [];

  let currentGroup = null;

  for (const msg of messages) {
    if (!msg) return [];
    if (
      !currentGroup ||
      currentGroup.userId !== msg.userId ||
      differenceInMinutes(msg.sentAt, currentGroup.sentAt) >= 1
    ) {
      // start a new group
      currentGroup = {
        index: msg._id,
        userId: msg.userId,
        sentAt: msg.sentAt,
        messages: [msg],
      };

      groups.push(currentGroup);
    } else {
      if (differenceInMinutes(msg.sentAt, currentGroup.sentAt) > 1) {
        currentGroup.sentAt = msg.sentAt;
      }
      // push into existing group
      currentGroup.messages.push(msg);
    }
  }

  return groups.sort().reverse();
};

export const playSound = (
  tone: "message-send" | "message-receive" | "message-notification"
) => {
  const notificationTone = notificationSounds(tone);
  const player = new Tone.Player(`${notificationTone}`).toDestination();
  player.autostart = true;
};

export enum socketEventTypes {
  RECEIVE_NEW_MESSAGE = "receivePrivateMessage",
  ONLINE_USERS = "userOnline",
  OFFLINE_USERS = "userOffline",
  MARK_AS_SEEN = "markAsSeen",
  IMAGE_UPDATED = "ImageUpdated",
}

type SocketListenerProps = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  setMessages?: (
    value: React.SetStateAction<ConversationUpatingResponseI[] | undefined>
  ) => void;
  setUser?: (id: string) => void;
  socketEvent?: string;
  eventValue: socketEventTypes;
  container?: React.RefObject<HTMLDivElement | null>;
  conversationId?: string | undefined;
  userId?: string;
};

export const SocketListener = ({
  socket,
  setMessages,
  socketEvent,
  eventValue,
  setUser,
  container,
  conversationId,
  userId,
}: SocketListenerProps) => {
  if (!socket) return;

  switch (eventValue) {
    case socketEventTypes.RECEIVE_NEW_MESSAGE:
      const handleNewMessage = (data: { message: Message }) => {
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

            if (conversationId && conversationId === data.message.userId) {
              // conversation is opened
              console.log("same conversation");
              if (setUser) {
                setUser(data.message.userId);
              }
            }
            return updated;
          });
        }
        if (data.message.userId === userId) {
          playSound("message-send");
        } else if (data.message.userId === conversationId) {
          playSound("message-receive");
        } else {
          playSound("message-notification");
        }

        if (!container?.current) return;

        container.current.scrollTop = 0;
      };

      socket.on(
        `${socketEventTypes.RECEIVE_NEW_MESSAGE}`,
        (data: { message: Message; recipientId: string }) => {
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

    case socketEventTypes.MARK_AS_SEEN:
      socket.on(
        `${socketEventTypes.MARK_AS_SEEN}`,
        (data: { recipientId: string }) => {
          console.log("recipient from seen message", data.recipientId);
          if (setMessages) {
            setMessages((prev) => {
              if (!prev || prev.length === 0) {
                return [
                  {
                    messages: [],
                    prevCursor: "", // or provide an appropriate value
                    nextCursor: undefined,
                    count: 1,
                  },
                ];
              }

              const updated = prev.map((page) => ({
                ...page,
                messages: page.messages.map((msg) =>
                  msg.userId === data.recipientId ? { ...msg, seen: true } : msg
                ),
              }));

              console.log("updated from listen", updated);

              return updated;
            });
          }
        }
      );
      break;
    case socketEventTypes.IMAGE_UPDATED:
      socket.on(
        `${socketEventTypes.IMAGE_UPDATED}`,
        (data: { userId: string }) => {
          if (setUser) {
            setUser(data.userId);
          }
        }
      );
      break;
    default:
      return null;
  }
};

export const getImageSize = async (
  file: File
): Promise<{ width: number; height: number }> => {
  // createImageBitmap is fast and avoids extra DOM elements
  const bitmap = await createImageBitmap(file);
  const width = bitmap.width;
  const height = bitmap.height;
  bitmap.close();
  return { width, height };
};
