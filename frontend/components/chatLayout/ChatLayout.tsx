"use client";
import React, { useEffect, useState } from "react";
import ConversationMainLayout from "./conversation/ConversationMainLayout";
import { MotionComponent, Motions } from "../relatedComponents/Motion";
import { Queries } from "@/actions/queries";
import { multipleQueriesIResponse } from "@/types";
import { useSession } from "../store/slices/AuthReducer";
import ChatHeader from "./Chats/MessageHeader";
import ConversationReusableLayout from "./ConversationReusableLayout";

const ChatLayout = () => {
  const { session } = useSession();
  const [updatedFriends, setUpdatedFriends] = useState<
    multipleQueriesIResponse[] | undefined
  >();

  const {
    data,
    isFetching,
    isFetchingNextPage,
    error,
    isError,
    hasNextPage,
    fetchNextPage,
  } = Queries.useMultipleQueries({
    id: session._id,
    query: "friends",
    limit: 5,
  });

  useEffect(() => {
    setUpdatedFriends(data?.pages);
  }, [isFetching, isFetchingNextPage, data?.pages]);

  const handleNextPage = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="grid grid-cols-12 justify-start h-screen w-full overflow-hidden">
      <div className="md:flex flex-col col-span-6 space-y-4 border-r-[1px] hidden">
        <ChatHeader />

        <ConversationReusableLayout
          friends={updatedFriends}
          isFetching={isFetching}
          isFetchingNextOrPreviousPage={isFetchingNextPage}
          error={error}
          isError={isError}
          spinnerClassname="flex justify-center items-start"
          moreButton={data !== undefined && data.pages.length > 0}
          eventHandler={handleNextPage}
          hasNextOrPerviousPage={hasNextPage}
        />
      </div>

      <MotionComponent
        form={Motions.RIGHT}
        className="col-span-12 md:col-span-6"
      >
        <ConversationMainLayout />
      </MotionComponent>
    </div>
  );
};

export default ChatLayout;
