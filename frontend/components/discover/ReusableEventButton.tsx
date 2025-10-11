"use client";
import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  handleFriendAddition,
  state,
} from "./utils";
import { useSession } from "../store/slices/AuthReducer";
import { users, usersDiscoverd } from "@/types";
import { Mutations } from "@/actions/mutations";
import { DashboardHook } from "../context/Dashboardprovider";

interface ReusableButtonProps {
  state: state;
  friendId: string;
  className?: string;
  children?: React.ReactNode;
  setUpdatedFriend?: (value: React.SetStateAction<usersDiscoverd>) => void;
  setUpdatedUsers?: React.Dispatch<React.SetStateAction<users | undefined>>;
}
const ReusableEventButton = ({
  state,
  friendId,
  className,
  children,
  setUpdatedFriend,
  setUpdatedUsers,
}: ReusableButtonProps) => {
  const { session } = useSession();
  const { api } = DashboardHook();
  const friendEvents = Mutations.useSendFriendRequest(api);

  const addRemoveFriendHandler = async () => {
    await friendEvents.mutateAsync({ id: session._id, friendId });
  };
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
          state,
          id: session._id,
          addRemoveFriendHandler,
          setUpdatedFriend,
          setUpdatedUsers,
        })
      }
    >
      {children}
    </Button>
  );
};

export default ReusableEventButton;
