import Image from "next/image";
import React from "react";
import { MotionComponent, Motions } from "../relatedComponents/Motion";
import { multipleQueriesIResponse, User } from "@/types";
import { DashboardHook } from "../context/Dashboardprovider";
import { useQueryClient } from "@tanstack/react-query";
import { playSound } from "@/lib/utils";
import { Mutations } from "@/actions/mutations";
import { format } from "date-fns";
import BadgeAvatar from "../Avatar";

interface SingleChatProps {
  friend: User;
}

const SingleChat = ({ friend }: SingleChatProps) => {
  const { setFriend, api, isActive } = DashboardHook();
  const queryClient = useQueryClient();
  const checkActiveSession = Mutations.useCheckSession(api);

  const handleChatOpen = async (recipientId: string) => {
    setFriend(friend);
    queryClient.removeQueries({ queryKey: [`conversation-${recipientId}`] });
    await checkActiveSession.mutateAsync({ friendId: friend._id });
  };

  const ActiveToggleComponent = () => {
    return (
      <div className="flex">
        <p className="text-sm text-slate-500">last message</p>
      </div>
    );
  };
  return (
    <MotionComponent form={Motions.LEFT}>
      <div
        className="flex justify-between items-center p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        onClick={() => handleChatOpen(friend._id)}
      >
        <BadgeAvatar
          displayName={friend.full_name}
          profileImg={friend.profileImg?.url}
          className="!size-24"
          active={isActive(friend._id)}
          titleClassName=""
          children={<ActiveToggleComponent />}
        />

        <div className="flex flex-col items-start justify-center p-4">
          <h1 className="font-medium lowercase text-slate-400 text-sm">
            {isActive(friend._id)
              ? "online"
              : format(new Date(friend.lastSeenAt), "Pp")}
          </h1>
        </div>
      </div>
    </MotionComponent>
  );
};

export default SingleChat;
