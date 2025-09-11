"use client";
import React, { useEffect, useRef, useState } from "react";
import SingleMessage from "./SingleMessage";
import { ConversationUpatingResponseI } from "@/types";
import { Queries } from "@/actions/queries";
import Spinner from "@/components/Spinner";
import { DashboardHook } from "@/components/context/Dashboardprovider";
import { groupMessages, socketEventTypes, SocketListener } from "@/lib/utils";
import { ConversationHook } from "@/components/context/ConversationProvider";
import { useSession } from "@/components/store/slices/AuthReducer";


const MessagesLayout = () => {
  const { socket, friend } = DashboardHook();
  const {setUnseenMessages} = ConversationHook()

  const { session } = useSession();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isError,
    error,
    isFetching,
    isFetchingPreviousPage,
    fetchPreviousPage,
    hasPreviousPage,
  } = Queries.useGetMessages({
    id: session._id,
    recipientId: friend?._id as string,
 
  });

  const [messages, setMessages] = useState<
    ConversationUpatingResponseI[] | undefined
  >(data?.pages);

  useEffect(() => {
    if (Array.isArray(data?.pages) && data.pages.length > 0) {
      setMessages(data?.pages);
    }
  }, [isFetching, isFetchingPreviousPage,data?.pages]);

  useEffect(() => {
    if (!socket) return;

    if (!scrollRef.current) return;

    SocketListener({
      socket,
      eventValue: socketEventTypes.RECEIVE_NEW_MESSAGE,
      setMessages,
      tone: "message",
      container:scrollRef
    });
    scrollRef.current.scrollTop = 0;

    return () => {
      socket.off("receivePrivateMessage");
    };
  }, [socket, session._id]);

  const allMessages = messages?.flatMap((page) => page.messages) ?? [];

  // 2. Group properly
  const groupedMessages = groupMessages(allMessages);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollValue = container.scrollTop;
      const height = container.scrollHeight;

      if (
        scrollValue + height <= 770 &&
        hasPreviousPage &&
        !isFetchingPreviousPage
      ) {
        fetchPreviousPage();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasPreviousPage, isFetchingPreviousPage, fetchPreviousPage]);

  return (
    <div
      ref={scrollRef}
      className="flex flex-col-reverse h-[700px] overflow-y-scroll bg-slate-100 dark:bg-[var(--sidebar-accent)] w-full mb-1 "
    >
      {isFetching && !isFetchingPreviousPage ? (
        <Spinner className="flex" size="default" />
      ) : isError ? (
        <div className="flex justify-center items-center p-4">
          <p className="font-medium capitalize">{error.message}</p>
        </div>
      ) : (
        groupedMessages &&
        groupedMessages.length > 0 &&
        groupedMessages.map((group, index) => (
          <SingleMessage key={index} group={group} />
        ))
      )}
      {isFetchingPreviousPage && (
        <Spinner
          size="default"
          text="loading"
          className="flex justify-center items-center p-4"
        />
      )}
    </div>
  );
};

export default MessagesLayout;
