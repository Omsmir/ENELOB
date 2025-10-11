"use client";
import { DashboardHook } from "@/components/context/Dashboardprovider";
import { useSession } from "@/components/store/slices/AuthReducer";
import { Message } from "@/types";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store/store";
import MessageWrapper from "./MessageWrapper";

export type group = {
  userId: string;
  sentAt: Date;
  messages: Message[];
};

 interface SingleMessageLayoutProps {
  group: group;
}

const SingleMessageLayout = ({ group }: SingleMessageLayoutProps) => {
  const { userId, messages, sentAt } = group;
  const { session } = useSession();
  const { friend } = DashboardHook();
  const conversationId = useSelector(
    (state: RootState) => state.users.conversationId
  );

  if (userId === session._id) {
    return (
      <MessageWrapper
        userId={userId}
        messages={messages}
        profileImgUrl={session.profileImg}
        full_name="You"
        sentAt={sentAt}
        className="flex-row-reverse"
      />
    );
  } else if (userId === conversationId) {
    return (
      <MessageWrapper
        userId={userId}
        messages={messages}
        profileImgUrl={friend?.profileImg?.url}
        full_name={`${friend?.full_name}`}
        sentAt={sentAt}
      />
    );
  }
};

export default SingleMessageLayout;
