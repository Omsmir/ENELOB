"use client";
import React, { useEffect, useState } from "react";
import Chat from "./Chat/Chat";
import { MotionComponent, Motions } from "../relatedComponents/Motion";
import MessageHeader from "./MessageHeader";
import Spinner from "../Spinner";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { Queries } from "@/actions/queries";
import { multipleQueriesIResponse } from "@/types";
import SingleChat from "./SingleChat";

const ChatLayout = () => {
  const { data: session } = useSession();
  const {
    data,
    isFetching,
    isFetchingNextPage,
    error,
    isError,
    hasNextPage,
    fetchNextPage,
  } = Queries.useMultipleQueries({
    id: session?.user.id,
    query: "friends",
    limit: 5,
  });

  const [updatedFriends, setUpdatedFriends] = useState<
    multipleQueriesIResponse[] | undefined
  >(data?.pages);

  useEffect(() => {
    setUpdatedFriends(data?.pages);
  }, [isFetching, isFetchingNextPage]);

  const handleNextPage = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="grid grid-cols-12 justify-start h-screen w-full overflow-hidden">
      <div className="md:flex flex-col col-span-6 space-y-4 border-r-[1px] hidden">
        <MessageHeader />
        {isFetching && !isFetchingNextPage ? (
          <Spinner size="default" className="flex" />
        ) : isError ? (
          <div className="flex justify-center items-center p-4">
            <p className="font-medium capitalize">{error.message}</p>
          </div>
        ) : (
          updatedFriends &&
          updatedFriends.length > 0 &&
          updatedFriends.map((page) =>
            page.users.map((friend, index) => (
              <SingleChat
                friend={friend}
                key={index}
              />
            ))
          )
        )}
        {isFetchingNextPage && (
          <Spinner className="flex justify-center items-start" size="default" />
        )}
        {data && (
          <div className="flex justify-center items-end w-full my-2">
            <Button
              className="bg-[var(--sidebar-accent)] dark:bg-black text-slate-50 cursor-pointer w-1/4 capitalize "
              onClick={handleNextPage}
              disabled={!hasNextPage || isFetching || isFetchingNextPage}
            >
              more chats
            </Button>
          </div>
        )}
      </div>

      <MotionComponent
        form={Motions.RIGHT}
        className="col-span-12 md:col-span-6"
      >
        <Chat />
      </MotionComponent>
    </div>
  );
};

export default ChatLayout;
