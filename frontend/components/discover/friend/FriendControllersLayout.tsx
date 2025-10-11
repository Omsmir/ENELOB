"use client";

import { usersDiscoverd } from "@/types";

import React from "react";

import ReusableSingleCardControllersWrapper from "../ReusableSingleCardControllersWrapper";

interface FriendControllersLayoutProps {
  updatedFriend: usersDiscoverd;
  setUpdatedFriend: React.Dispatch<React.SetStateAction<usersDiscoverd>>;
}

const FriendControllersLayout = ({ updatedFriend, setUpdatedFriend }: FriendControllersLayoutProps) => {
  return (
    <div className="grid grid-cols-12 p-4 mt-8 md:mt-4">
      <div className="col-span-2 md:col-span-6"></div>
      <div className="flex flex-col w-full col-span-10 md:col-span-6">
        <ReusableSingleCardControllersWrapper
          payload={updatedFriend}
          setUpdatedFriend={setUpdatedFriend}
          className="justify-end"
          message_button_classname="w-[220px] bg-indigo-600 cursor-pointer ms-1"
          disabled_message_button_classname="bg-indigo-600 flex-1 opacity-55 cursor-no-drop ml-1 max-w-[220px] dark:text-slate-50"
          remove_button_classname=" bg-red-500 transition-colors hover:bg-red-700 dark:text-slate-50"
          reusable_add_remove_card_classname="flex flex-1 justify-end"
          reusable_single_friend_classname="w-full"
          add_button_classname=""
          accept_button_classname="bg-green-700"
          full_friend_state
        />
      </div>
    </div>
  );
};

export default FriendControllersLayout;
