import { Mutations } from "@/actions/mutations";
import BadgeAvatar from "@/components/Avatar";
import { DashboardHook } from "@/components/context/Dashboardprovider";
import Dropdown from "@/components/Dropdown";
import { useSession } from "@/components/store/slices/AuthReducer";
import { updateConversationId } from "@/components/store/slices/usersReducer";
import ReuseableEventButton from "@/components/togglers/ReuseableEventButton";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";

const ChatHeader = () => {
  const { friend, isActive, api, setFriend } = DashboardHook();
  const router = useRouter();
  const { session } = useSession();
  const deleteConversation = Mutations.useDeleteConversation(api);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  if (!friend) {
    return (
      <div className="flex border-b h-[110px] overflow-hidden m-0">
        <BadgeAvatar
          displayName="example user"
          className="!size-16"
          active
          titleClassName="!text-sm"
        />
      </div>
    );
  }

  const clickHandler = async () => {
    await deleteConversation.mutateAsync({
      id: session._id,
      recipientId: friend?._id,
    });

    queryClient.invalidateQueries({ queryKey: [`conversation-${friend._id}`] });

    setFriend(undefined);

    dispatch(updateConversationId(""));
  };

  const fire_description = {
    title: "Do you want to delete the conversation?",
    confirmed: "deleted",
    denied: "No Changes",
    confirmTitle: "delete",
  };

  const LastSeenComponent = () => {
    if (isActive(friend._id)) {
      return (
        <div className="flex">
          <p className="text-xs lowercase text-slate-500">online</p>
        </div>
      );
    } else {
      return (
        <div className="flex">
          <p className="text-xs lowercase text-slate-500">
            last seen at {format(friend.lastSeenAt, "Ppp")}
          </p>
        </div>
      );
    }
  };

  const items = [
    {
      innerText: "View Profile",
      onclick: () => router.push(`discover/${friend._id}`),
      disabled: false,
    },
    {
      children: (
        <ReuseableEventButton
          fire_description={fire_description}
          clickHandler={clickHandler}
          title="delete conversation"
          className="bg-transparent shadow-none p-0 hover:bg-transparent text-red-700 cursor-pointer"
        />
      ),
      disabled: false,
      className: "!text-red-700 ",
    },
    {
      innerText: "block",
      onclick: () => console.log("delete conversation"),
      disabled: false,
      className: "!text-red-700 font-medium",
    },
  ];
  return (
    <div className="flex justify-between items-center border-b h-[110px] overflow-hidden m-0">
      <BadgeAvatar
        profileImg={friend.profileImg?.url}
        displayName={friend.full_name}
        className="!size-16"
        active={isActive(friend._id)}
        titleClassName="!text-sm"
      >
        <LastSeenComponent />
      </BadgeAvatar>
      <Dropdown items={items} className="p-4" />
    </div>
  );
};

export default ChatHeader;
