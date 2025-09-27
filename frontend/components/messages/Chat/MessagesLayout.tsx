"use client";
import React, { useEffect, useRef, useState } from "react";
import SingleMessage from "./SingleMessage";
import { ConversationUpatingResponseI } from "@/types";
import { Queries } from "@/actions/queries";
import Spinner from "@/components/Spinner";
import { DashboardHook } from "@/components/context/Dashboardprovider";
import { groupMessages, socketEventTypes, SocketListener } from "@/lib/utils";
import { useSession } from "@/components/store/slices/AuthReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/components/store/store";
import { Mutations } from "@/actions/mutations";
import { updateConversationId } from "@/components/store/slices/usersReducer";
import { ArrowDown } from "lucide-react";

const MessagesLayout = () => {
  const { socket, friend, api, setFriend, setUnseenMessages } = DashboardHook();
  const { session } = useSession();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const markAsSeen = Mutations.useMarkAsSeen(api);
  const [scrollBottomState, setScrollBottomState] = useState(false);
  const conversationId = useSelector(
    (state: RootState) => state.users.conversationId
  );
  const scrollBottom = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = 0;
  };

  const dispatch = useDispatch();
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

  const handleMessageSeen = (recipientId: string) => {
    markAsSeen.mutate({ id: session._id, recipientId });
  };

  const [messages, setMessages] = useState<
    ConversationUpatingResponseI[] | undefined
  >(data?.pages);

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
      userId:session._id,
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

  const allMessages = messages?.flatMap((page) => page.messages) ?? [];

  // 2. Group properly
  const groupedMessages = groupMessages(allMessages);

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
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex flex-col-reverse relative h-[700px] overflow-y-scroll bg-slate-100 dark:bg-[var(--sidebar-accent)] w-full mb-1 "
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
      {scrollBottomState && (
        <span
          onClick={scrollBottom}
          className="flex justify-center items-center fixed right-10 bottom-30 bg-white size-12 rounded-full cursor-pointer transition-colors hover:bg-slate-50 "
        >
          <ArrowDown />
        </span>
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
