"use client";
import { Mutations } from "@/actions/mutations";
import {
  DashboardHook,
  ResponsiveMedia,
} from "@/components/context/Dashboardprovider";
import CustomTooltip from "@/components/CustomTooltip";
import { useSession } from "@/components/store/slices/AuthReducer";
import { updateConversationId } from "@/components/store/slices/usersReducer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User, usersDiscoverd } from "@/types";
import { UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";

interface EventsProps {
  updatedFriend: usersDiscoverd;
  setUpdatedFriend: React.Dispatch<React.SetStateAction<usersDiscoverd>>;
}

interface ReusableButtonProps {
  event: "add" | "remove" | "accept";
  friendId: string;
  className?: string;
  children?: React.ReactNode;
  handleFriendAddition: ({
    friendId,
    state,
  }: {
    friendId: string;
    state: "add" | "remove" | "accept";
  }) => Promise<void>;
}

const ReusableButton = ({
  event,
  friendId,
  className,
  children,
  handleFriendAddition,
}: ReusableButtonProps) => {
  return (
    <Button
      className={cn(
        "cursor-pointer capitalize flex-1 w-[120px] md:w-full max-w-[200px]",
        className
      )}
      type="button"
      onClick={() =>
        handleFriendAddition({
          friendId,
          state: event,
        })
      }
    >
      {children}
    </Button>
  );
};

const Events = ({ updatedFriend, setUpdatedFriend }: EventsProps) => {
  const { api, setFriend, UseMediaQuery } = DashboardHook();
  const { session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();
  const isMobile = UseMediaQuery({ MEDIA_TYPE: ResponsiveMedia.IS_MOBILE });
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
    state: "add" | "remove" | "accept";
  }) => {
    await addFriend.mutateAsync({ id: session._id, friendId });
    switch (state) {
      case "add":
        setUpdatedFriend((user) =>
          user.user._id === friendId
            ? { ...user, sendRequestId: session._id }
            : user
        );
        break;
      case "remove":
        setUpdatedFriend((user) =>
          user.user._id === friendId
            ? { ...user, sendRequestId: null, userId: null }
            : user
        );
        break;

      case "accept":
        setUpdatedFriend((user) =>
          user.user._id === friendId
            ? { ...user, friendRequest: null, userId: session._id }
            : user
        );
        break;
    }
  };

  return (
    <div className="grid grid-cols-12 p-4 mt-8 md:mt-4">
      <div className="col-span-2 md:col-span-6"></div>
      <div className="flex flex-col w-full col-span-10 md:col-span-6">
        {updatedFriend.userId === session._id ? (
          <div className="flex flex-col justify-end">
            <p className="text-slate-500 dark:text-slate-50 text-sm capitalize mb-2 w-full text-end">
              you're friends
            </p>
            <div className="flex justify-end">
              <ReusableButton
                friendId={updatedFriend.user._id}
                className=" bg-red-500 transition-colors hover:bg-red-700 dark:text-slate-50"
                event="remove"
                handleFriendAddition={handleFriendAddition}
              >
                {isMobile && "remove friend"} <UserDeleteOutlined />
              </ReusableButton>
              <Button
                className="w-[220px] bg-indigo-600 cursor-pointer ms-1"
                type="button"
                onClick={() => sendMessage(updatedFriend.user)}
              >
                Message
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end">
            {session._id === updatedFriend.sendRequestId ? (
              <ReusableButton
                friendId={updatedFriend.user._id}
                className=" bg-red-500 transition-colors hover:bg-red-700 dark:text-slate-50"
                event="remove"
                handleFriendAddition={handleFriendAddition}
              >
                {isMobile && "remove request"} <UserDeleteOutlined />
              </ReusableButton>
            ) : session._id === updatedFriend.friendRequest ? (
              <ReusableButton
                event="accept"
                friendId={updatedFriend.user._id}
                handleFriendAddition={handleFriendAddition}
              >
                confirm request
              </ReusableButton>
            ) : (
              <ReusableButton
                event="add"
                className=""
                friendId={updatedFriend.user._id}
                handleFriendAddition={handleFriendAddition}
              >
                {isMobile && "Add Friend"}
                <UserAddOutlined />
              </ReusableButton>
            )}

            <CustomTooltip
              title="you can only message your friends"
              position="bottom"
            >
              <Button
                className="bg-indigo-600 flex-1 opacity-55 cursor-no-drop ml-1 max-w-[220px] dark:text-slate-50"
                type="button"
              >
                Message
              </Button>
            </CustomTooltip>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
