"use client";
import { Mutations } from "@/actions/mutations";
import { DashboardHook } from "@/components/context/Dashboardprovider";
import { useSession } from "@/components/store/slices/AuthReducer";
import { Button } from "@/components/ui/button";
import { multipleQueriesIResponse, User } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface SingleFriendRequestProps {
  setUpdatedUsers: React.Dispatch<
    React.SetStateAction<multipleQueriesIResponse[] | undefined>
  >;
  user: User;
}

const SingleFriendRequest = ({
  user,
  setUpdatedUsers,
}: SingleFriendRequestProps) => {
  const { session } = useSession();
  const { api } = DashboardHook();
  const [message, setMessage] = useState<string | null>("");
  const handleFriendRequestMutation = Mutations.useHandleFriendRequest(api);

  const handleFriendRequest = async ({
    friendId,
    acception = undefined,
  }: {
    friendId: string;
    acception?: "accept" | undefined;
  }) => {
    setUpdatedUsers((prev) =>
      prev?.map((item) => ({
        ...item,
        users: item.users.map((us) =>
          us._id === friendId
            ? {
                ...us,
                sendRequests: [
                  ...us.sendRequests.filter(
                    (request) => request !== session._id
                  ),
                ],
              }
            : us
        ),
      }))
    );

    await handleFriendRequestMutation.mutateAsync(
      {
        id: session._id,
        friendId,
        acception,
      },
      {
        onSuccess: (response) => {
          setMessage(response.message);
        },
      }
    );
  };
  return (
    <Link
      href={`dashboard/discover/${user._id}`}
      className="flex justify-between bg-gray-200 dark:bg-[var(--sidebar-accent)] rounded-md shadow-md my-2 p-4 cursor-pointer transition-all hover:scale-[1.006] hover:bg-gray-300"
    >
      <div className="flex justify-start items-center">
        <div className="size-16 overflow-hidden rounded-full group">
          <Image
            src={user.profileImg?.url || "/assets/images/dr-green.png"}
            width={1000}
            height={1000}
            alt="logo"
            className="w-full h-full object-center object-cover group-hover:scale-[1.07] transition-transform"
          />
        </div>
        <div className="flex flex-col justify-start items-start ms-2">
          <h1 className="font-medium capitalize">{user.full_name}</h1>
          <p className="text-sm text-slate-500">wants to be your friend</p>
        </div>
      </div>
      {user.sendRequests.filter((request) => request === session._id).length >
      0 ? (
        user.sendRequests
          .filter((request) => request === session._id)
          .map((_, index) => (
            <div
              key={index}
              className="flex flex-col justify-end items-end space-y-2"
            >
              <Button
                onClick={() =>
                  handleFriendRequest({
                    friendId: user._id,
                    acception: "accept",
                  })
                }
                className="bg-[var(--sidebar-accent)] dark:bg-indigo-950 hover:bg-indigo-700 dark:text-slate-50 cursor-pointer transition-colors capitalize min-w-[100px]"
              >
                accept
              </Button>
              <Button
                onClick={() => handleFriendRequest({ friendId: user._id })}
                className="bg-red-700 hover:bg-red-800 cursor-pointer  dark:text-slate-50 transition-colors capitalize min-w-[100px]"
              >
                decline
              </Button>
            </div>
          ))
      ) : (
        <div className="flex justify-center items-center">
          <p className="text-slate-500 text-sm capitalize">{message}</p>
        </div>
      )}
    </Link>
  );
};

export default SingleFriendRequest;
