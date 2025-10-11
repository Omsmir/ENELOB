import React from "react";
import { MotionComponent, Motions } from "../../relatedComponents/Motion";
import { User } from "@/types";
import { DashboardHook } from "../../context/Dashboardprovider";
import { useQueryClient } from "@tanstack/react-query";
import { Mutations } from "@/actions/mutations";
import BadgeAvatar from "../../Avatar";
import { useSession } from "../../store/slices/AuthReducer";
import { useDispatch } from "react-redux";
import { updateConversationId } from "../../store/slices/usersReducer";
import { Badge } from "antd";
import { switchOnActiveTimes } from "@/lib/utils";

interface SingleChatProps {
  friend: User;
}

const SingleChat = ({ friend }: SingleChatProps) => {
  const { setFriend, api, isActive } = DashboardHook();
  const dispatch = useDispatch();
  const { session } = useSession();
  const queryClient = useQueryClient();
  const checkActiveSession = Mutations.useCheckSession(api);
  const markAsSeen = Mutations.useMarkAsSeen(api);

  const handleChatOpen = async () => {
    setFriend(friend);
    dispatch(updateConversationId(friend._id));
    queryClient.removeQueries({ queryKey: [`conversation-${friend._id}`] });
    await checkActiveSession.mutateAsync({ friendId: friend._id });
    await markAsSeen.mutateAsync({ id: session._id, recipientId: friend._id });
  };

  const ActiveToggleComponent = () => {
    return (
      <div className="flex">
        <p className="text-sm text-slate-500">last seen</p>
      </div>
    );
  };

  return (
    <MotionComponent form={Motions.LEFT}>
      <div
        className="flex justify-between items-center p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer "
        onClick={handleChatOpen}
      >
        <BadgeAvatar
          displayName={friend.full_name}
          profileImg={friend.profileImg?.url}
          className="!size-24"
          active={isActive(friend._id)}
          titleClassName=""
        >
          <ActiveToggleComponent />
        </BadgeAvatar>

        <div className="flex flex-col items-end justify-center p-2">
          <div className="mb-1">
            <Badge count={1} />
          </div>
          <h1 className="font-medium lowercase text-slate-400 text-sm">
            {isActive(friend._id)
              ? "online"
              : switchOnActiveTimes(friend.lastSeenAt)}
          </h1>
        </div>
      </div>
    </MotionComponent>
  );
};

export default SingleChat;
