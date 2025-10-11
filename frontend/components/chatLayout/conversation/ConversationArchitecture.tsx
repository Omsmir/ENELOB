"use client";
import React, { useEffect, useRef, useState } from "react";
import { ConversationUpatingResponseI } from "@/types";
import { Queries } from "@/actions/queries";
import { DashboardHook } from "@/components/context/Dashboardprovider";
import { groupMessages, socketEventTypes, SocketListener } from "@/lib/utils";
import { useSession } from "@/components/store/slices/AuthReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/components/store/store";
import { Mutations } from "@/actions/mutations";
import { updateConversationId } from "@/components/store/slices/usersReducer";
import ConversationReusableLayout from "../ConversationReusableLayout";

const ConversationArchitecture = () => {
  const { socket, friend, api, setFriend } = DashboardHook();
  const markAsSeen = Mutations.useMarkAsSeen(api);
  const [scrollBottomState, setScrollBottomState] = useState(false);
  const [messages, setMessages] = useState<
    ConversationUpatingResponseI[] | undefined
  >(undefined);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { session } = useSession();
  const dispatch = useDispatch();
  const conversationId = useSelector(
    (state: RootState) => state.users.conversationId
  );

  const scrollBottom = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = 0;
  };
  const handleMessageSeen = (recipientId: string) => {
    markAsSeen.mutate({ id: session._id, recipientId });
  };

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

  useEffect(() => {
    if (Array.isArray(data?.pages) && data.pages.length > 0) {
      setMessages(data?.pages);
    }
  }, [isFetching, isFetchingPreviousPage, data?.pages]);

  useEffect(() => {
    if (!socket) return;

    if (!scrollRef.current) return;

    SocketListener({
      socket,
      eventValue: socketEventTypes.RECEIVE_NEW_MESSAGE,
      setMessages,
      userId: session._id,
      container: scrollRef,
      conversationId,
      setUser: handleMessageSeen,
    });

    SocketListener({
      socket,
      eventValue: socketEventTypes.MARK_AS_SEEN,
      setMessages,
    });

    scrollRef.current.scrollTop = 0;

    return () => {
      socket.off("receivePrivateMessage");
      socket.off("markAsSeen");
      setScrollBottomState(false);
    };
  }, [socket, session._id, conversationId]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollValue = container.scrollTop;
      const height = container.scrollHeight;

      setScrollBottomState(true);
      if (
        scrollValue + height <= 770 &&
        hasPreviousPage &&
        !isFetchingPreviousPage
      ) {
        fetchPreviousPage();
      }
      if (scrollValue === 0) {
        setScrollBottomState(false);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [
    hasPreviousPage,
    isFetchingPreviousPage,
    fetchPreviousPage,
    scrollRef.current?.scrollTop,
  ]);

  useEffect(() => {
    return () => {
      dispatch(updateConversationId(""));
      setFriend(undefined);
    };
  }, [setFriend,dispatch]);

  const allMessages = messages?.flatMap((page) => page.messages) ?? [];

  const groupedMessages = groupMessages(allMessages);

  return (
    <div
      ref={scrollRef}
      className="flex flex-col-reverse relative h-[700px] overflow-y-scroll bg-slate-100 dark:bg-[var(--sidebar-accent)] w-full mb-1 "
    >
      <ConversationReusableLayout
        pages={groupedMessages}
        isFetching={isFetching}
        isFetchingNextOrPreviousPage={isFetchingPreviousPage}
        isError={isError}
        error={error}
        eventHandler={scrollBottom}
        scrollBottomState={scrollBottomState}
        spinnerClassname="flex justify-center items-center p-4"
      />
    </div>
  );
};

export default ConversationArchitecture;
