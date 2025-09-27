"use client";
import Image from "next/image";
import React, { Fragment } from "react";
import { Button } from "../ui/button";
import { UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { User, usersDiscoverd, users } from "@/types";
import { Mutations } from "@/actions/mutations";
import { DashboardHook } from "../context/Dashboardprovider";
import { useSession } from "../store/slices/AuthReducer";
import { useDispatch } from "react-redux";
import { updateConversationId } from "../store/slices/usersReducer";
import { useRouter } from "next/navigation";
import CustomTooltip from "../CustomTooltip";
import Link from "next/link";
import Events from "./friend/Events";

interface SingleCardProps {
  payload: usersDiscoverd;
  setUpdatedUsers: React.Dispatch<React.SetStateAction<users | undefined>>;
}
const SingleCard = ({ payload, setUpdatedUsers }: SingleCardProps) => {
  const { session } = useSession();
  const { api, setFriend } = DashboardHook();
  const dispatch = useDispatch();
  const router = useRouter();

  const addFriend = Mutations.useSendFriendRequest(api);

  const sendMessage = (recipient: User) => {
    setFriend(recipient);
    dispatch(updateConversationId(recipient._id));
    router.push("/dashboard/messages");
  };

  const handleFriendAddition = async ({
    friendId,
    state,
  }: {
    friendId: string;
    state: "add" | "remove";
  }) => {
    await addFriend.mutateAsync({ id: session._id, friendId });

    switch (state) {
      case "add":
        return setUpdatedUsers((prev) =>
          prev?.map((user) =>
            user.user._id === friendId
              ? { ...user, sendRequestId: session._id }
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
      <Link
        href={`/dashboard/discover/${payload.user._id}`}
        className="flex overflow-hidden w-full min-h-[225px] max-h-[225px] group cursor-pointer rounded-b-md"
      >
        <Image
          width={1000}
          height={1000}
          alt="logo"
          src={payload.user.profileImg?.url || "/assets/images/1.avif"}
          className="object-center object-cover w-full h-full group-hover:scale-[1.05] group-hover:opacity-90 transition-transform"
        />
      </Link>
      <div className="flex flex-col justify-start items-start p-4">
        <h1 className="text-xl font-medium capitalize">
          {payload.user.full_name}
        </h1>
        <p className="text-slate-500 capitalize ">frontend - developer</p>
      </div>

       <div className="flex p-4">
        {payload.userId === session._id ? (
          <div className="flex flex-col w-full ">
            <p className="text-slate-500 dark:text-slate-50 text-sm capitalize mb-2">
              you're friends
            </p>
            <Button
              className="bg-indigo-600 w-full cursor-pointer"
              type="button"
              onClick={() => sendMessage(payload.user)}
            >
              Message
            </Button>
          </div>
        ) : (
          <Fragment>
            {session._id === payload.sendRequestId ? (
              <Button
                className="bg-red-500 transition-colors hover:bg-red-700 w-1/4 cursor-pointer"
                type="button"
                onClick={() =>
                  handleFriendAddition({
                    friendId: payload.user._id,
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
                    friendId: payload.user._id,
                    state: "add",
                  })
                }
              >
                <UserAddOutlined />
              </Button>
            )}

            <CustomTooltip
              title="you can only message your friends"
              position="bottom"
            >
              <Button
                className="bg-indigo-600 w-3/4 ml-1 opacity-55 cursor-no-drop"
                type="button"
              >
                Message
              </Button>
            </CustomTooltip>
          </Fragment>
        )}
      </div> 
    </div>
  );
};

export default SingleCard;
