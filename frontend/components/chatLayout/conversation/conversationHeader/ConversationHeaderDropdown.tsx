"use client";
import { Mutations } from "@/actions/mutations";
import { DashboardHook } from "@/components/context/Dashboardprovider";
import Dropdown, { item } from "@/components/Dropdown";
import { useSession } from "@/components/store/slices/AuthReducer";
import { updateConversationId } from "@/components/store/slices/usersReducer";
import ReuseableEventButton from "@/components/togglers/ReuseableEventButton";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";

interface ConversationHeaderDropdownProps {
  friendId: string;
}

const fire_description = {
  title: "Do you want to delete the conversation?",
  confirmed: "deleted",
  denied: "No Changes",
  confirmTitle: "delete",
};

const ConversationHeaderDropdown = ({
  friendId,
}: ConversationHeaderDropdownProps) => {
  const { api, setFriend } = DashboardHook();
  const { session } = useSession();
  const router = useRouter();
  const deleteConversation = Mutations.useDeleteConversation(api);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const clickHandler = async () => {
    await deleteConversation.mutateAsync({
      id: session._id,
      recipientId: friendId,
    });

    queryClient.invalidateQueries({ queryKey: [`conversation-${friendId}`] });

    setFriend(undefined);

    dispatch(updateConversationId(""));
  };

  const items: item<any>[] = [
    {
      innerText: "View Profile",
      onclick: () => router.push(`discover/${friendId}`),
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
  return <Dropdown items={items} className="p-4" />;
};

export default ConversationHeaderDropdown;
