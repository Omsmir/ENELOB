"use client";
import React from "react";
import { usersDiscoverd, users } from "@/types";

import SingleCardHeader from "./SingleCardHeader";
import ReusableSingleCardControllersWrapper from "../ReusableSingleCardControllersWrapper";

interface SingleCardLayoutProps {
  payload: usersDiscoverd;
  setUpdatedUsers: React.Dispatch<React.SetStateAction<users | undefined>>;
}
const SingleCardLayout = ({
  payload,
  setUpdatedUsers,
}: SingleCardLayoutProps) => {
  return (
    <div className="flex flex-col justify-between col-span-12 sm:col-span-6 xl:col-span-4 bg-slate-50 dark:bg-[var(--sidebar-accent)] rounded-md shadow-md overflow-hidden space-y-4">
      <SingleCardHeader payload={payload} />
      <ReusableSingleCardControllersWrapper
        payload={payload}
        setUpdatedUsers={setUpdatedUsers}
        className="p-4"
        message_button_classname="bg-indigo-600 w-full cursor-pointer"
        disabled_message_button_classname="bg-indigo-600 w-3/4 ml-1 opacity-55 cursor-no-drop"
        remove_button_classname="w-full bg-red-500 transition-colors hover:bg-red-700 cursor-pointer"
        reusable_add_remove_card_classname="flex flex-1"
        reusable_single_friend_classname="w-full"
        add_button_classname="w-full  cursor-pointer"
        accept_button_classname="bg-green-700"
        full_friend_state={false}
      />
    </div>
  );
};

export default SingleCardLayout;
