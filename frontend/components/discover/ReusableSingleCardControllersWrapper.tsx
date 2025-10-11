"use client";
import { users, usersDiscoverd } from "@/types";
import React from "react";
import ReusableSingleCardFriends from "./ReusableSingleCardFriends";
import DisabledMessageButton from "./DisabledMessageButton";
import SingleCardAddRemove from "./SingleCardAddRemove";

interface ReusableSingleCardControllersWrapperProps {
  payload: usersDiscoverd;
  className?: string;
  message_button_classname?: string;
  full_friend_state: boolean;
  setUpdatedFriend?: (value: React.SetStateAction<usersDiscoverd>) => void;
  setUpdatedUsers?: React.Dispatch<React.SetStateAction<users | undefined>>;
  disabled_message_button_classname: string;
  add_button_classname: string;
  remove_button_classname: string;
  accept_button_classname: string;
  reusable_add_remove_card_classname: string;
  reusable_single_friend_classname?: string;
}
const ReusableSingleCardControllersWrapper = ({
  payload,
  className,
  message_button_classname,
  disabled_message_button_classname,
  full_friend_state,
  setUpdatedFriend,
  setUpdatedUsers,
  accept_button_classname,
  add_button_classname,
  remove_button_classname,
  reusable_add_remove_card_classname,
  reusable_single_friend_classname,
}: ReusableSingleCardControllersWrapperProps) => {
  const { userId } = payload;
  return (
    <div className={`flex ${className}`}>
      {userId && (
        <ReusableSingleCardFriends
          className={reusable_single_friend_classname}
          setUpdatedFriend={setUpdatedFriend}
          full_friend_state={full_friend_state}
          message_button_classname={message_button_classname}
          payload={payload}
        />
      )}
      {!userId && (
        <SingleCardAddRemove
          className={reusable_add_remove_card_classname}
          payload={payload}
          setUpdatedFriend={setUpdatedFriend}
          setUpdatedUsers={setUpdatedUsers}
          accept_button_classname={accept_button_classname}
          add_button_classname={add_button_classname}
          remove_button_classname={remove_button_classname}
          full_friend_state={full_friend_state}
        >
          <DisabledMessageButton
            classname={disabled_message_button_classname}
          />
        </SingleCardAddRemove>
      )}
    </div>
  );
};

export default ReusableSingleCardControllersWrapper;
