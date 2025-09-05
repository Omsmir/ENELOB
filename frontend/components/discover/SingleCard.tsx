"use client";
import Image from "next/image";
import React, { Fragment } from "react";
import { Button } from "../ui/button";
import { UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { User, usersDiscoverd, users } from "@/types";
import { Queries } from "@/actions/queries";
import { useSession } from "next-auth/react";
import { Mutations } from "@/actions/mutations";
import { DashboardHook } from "../context/Dashboardprovider";

interface SingleCardProps {
  user: usersDiscoverd;
  setUpdatedUsers: React.Dispatch<React.SetStateAction<users | undefined>>;
}
const SingleCard = ({ user, setUpdatedUsers }: SingleCardProps) => {
  const { data: session } = useSession();
  const { api } = DashboardHook();

  const addFriend = Mutations.useSendFriendRequest(api);

  const payload = {
    id: session?.user.id,
    accessToken: session?.user.accessToken,
    refreshToken: session?.user.refreshToken,
  };

  const handleFriendAddition = async ({
    friendId,
    state,
  }: {
    friendId: string;
    state: "add" | "remove";
  }) => {
    await addFriend.mutateAsync({ ...payload, friendId });

    switch (state) {
      case "add":
        return setUpdatedUsers((prev) =>
          prev?.map((user) =>
            user.user._id === friendId
              ? { ...user, sendRequestId: session?.user.id }
              : user
          )
        );
      case "remove":
        return setUpdatedUsers((prev) =>
          prev?.map((user) =>
            user.user._id === friendId ? { ...user, sendRequestId: null } : user
          )
        );
    }
  };

  return (
    <div className="flex flex-col justify-between col-span-12 sm:col-span-6 xl:col-span-4 bg-slate-50 dark:bg-[var(--sidebar-accent)] rounded-md shadow-md overflow-hidden space-y-4">
      <div className="flex overflow-hidden w-full min-h-[225px] max-h-[225px] group cursor-pointer rounded-b-md">
        <Image
          width={1000}
          height={1000}
          alt="logo"
          src={user.user.profileImg?.url || "/assets/images/1.avif"}
          className="object-center object-cover w-full h-full group-hover:scale-[1.05] group-hover:opacity-90 transition-transform"
        />
      </div>
      <div className="flex flex-col justify-start items-start p-4">
        <h1 className="text-xl font-medium capitalize">
          {user.user.full_name}
        </h1>
        <p className="text-slate-500 capitalize ">frontend - developer</p>
      </div>

      <div className="flex p-4">
        {user.userId === session?.user.id ? (
          <div className="flex flex-col w-full ">
            <p className="text-slate-500 dark:text-slate-50 text-sm capitalize mb-2">
              you're friends
            </p>
            <Button
              className="bg-indigo-600 w-full cursor-pointer"
              type="button"
            >
              Message
            </Button>
          </div>
        ) : (
          <Fragment>
            {session?.user.id === user.sendRequestId ? (
              <Button
                className="bg-red-500 transition-colors hover:bg-red-700 w-1/4 cursor-pointer"
                type="button"
                onClick={() =>
                  handleFriendAddition({
                    friendId: user.user._id,
                    state: "remove",
                  })
                }
              >
                <UserDeleteOutlined />
              </Button>
            ) : (
              <Button
                className="w-1/4 cursor-pointer"
                type="button"
                onClick={() =>
                  handleFriendAddition({
                    friendId: user.user._id,
                    state: "add",
                  })
                }
              >
                <UserAddOutlined />
              </Button>
            )}
            <Button
              className="bg-indigo-600 w-3/4 ml-1 cursor-pointer"
              type="button"
              disabled
            >
              Message
            </Button>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default SingleCard;
