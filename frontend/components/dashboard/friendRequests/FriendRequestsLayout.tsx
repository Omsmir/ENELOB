"use client";
import React, { useEffect, useState } from "react";
import SingleFriendRequest from "./SingleFriendRequest";
import { useSession } from "next-auth/react";
import { Queries } from "@/actions/queries";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { multipleQueriesI, multipleQueriesIResponse } from "@/types";

const FriendRequestsLayout = () => {
  const { data: session } = useSession();
  const {
    data,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
    error,
    isError,
    fetchNextPage,
  } = Queries.useMultipleQueries({
    id: session?.user.id,
    query: "friendRequests",
    limit: 1,
  });

  const [updatedUsers,setUpdatedUsers] = useState<multipleQueriesIResponse[] | undefined>(data?.pages)


  useEffect(() => {
    setUpdatedUsers(data?.pages)
  },[isFetching,isFetchingNextPage])

  const handleNextPage = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };
  
  return (
    <div className="flex flex-col px-4 w-full max-h-[350px] overflow-y-scroll ">
      {isFetching && !isFetchingNextPage? (
        <Spinner className="flex " size="default" />
      ) : isError ? (
        <div className="flex justify-center items-center p-4">
          <h1 className="font-medium capitalize">{error.message}</h1>
        </div>
      ) : (
        updatedUsers && 
        updatedUsers.map((request, _) =>
          request.users.map((user, index) => (
            <SingleFriendRequest key={index} user={user} setUpdatedUsers={setUpdatedUsers} />
          ))
        )
      )}
      {isFetchingNextPage && <Spinner className="flex justify-center items-center" size="default" />}
      {data && (
        <div className="flex w-full my-2">
          <Button
            className=" cursor-pointer w-full capitalize"
            onClick={handleNextPage}
            disabled={!hasNextPage || isFetching || isFetchingNextPage}
          >
            more
          </Button>
        </div>
      )}
    </div>
  );
};

export default FriendRequestsLayout;
