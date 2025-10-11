"use client";
import { useSession } from "@/components/store/slices/AuthReducer";
import { users, usersDiscoverd } from "@/types";
import { UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import React from "react";
import ReusableEventButton from "./ReusableEventButton";
import {
  DashboardHook,
  ResponsiveMedia,
} from "@/components/context/Dashboardprovider";

interface SingleCardAddRemoveProps {
  className?: string;
  payload: usersDiscoverd;
  setUpdatedFriend?: (value: React.SetStateAction<usersDiscoverd>) => void;
  setUpdatedUsers?: React.Dispatch<React.SetStateAction<users | undefined>>;
  add_button_classname: string;
  remove_button_classname: string;
  accept_button_classname: string;
  full_friend_state: boolean;
  children:React.ReactNode
}

const SingleCardAddRemove = ({
  payload,
  className,
  setUpdatedFriend,
  setUpdatedUsers,
  accept_button_classname,
  remove_button_classname,
  add_button_classname,
  full_friend_state,
  children
}: SingleCardAddRemoveProps) => {
  const { user, sendRequestId, friendRequest } = payload;
  const { session } = useSession();
  const { UseMediaQuery } = DashboardHook();

  const isMobile = UseMediaQuery({ MEDIA_TYPE: ResponsiveMedia.IS_MOBILE });

  return (
    <div className={className}>
      {session._id === sendRequestId ? (
        <ReusableEventButton
          friendId={user._id}
          className={remove_button_classname}
          state="remove"
          setUpdatedFriend={setUpdatedFriend}
          setUpdatedUsers={setUpdatedUsers}
        >
          {full_friend_state && isMobile && "remove request"}{" "}
          <UserDeleteOutlined />
        </ReusableEventButton>
      ) : session._id === friendRequest ? (
        <ReusableEventButton
          state="accept"
          friendId={user._id}
          setUpdatedFriend={setUpdatedFriend}
          setUpdatedUsers={setUpdatedUsers}
          className={accept_button_classname}
        >
          {full_friend_state ? "confirm request" : "accept"}
         
        </ReusableEventButton>
      ) : (
        <ReusableEventButton
          state="add"
          className={add_button_classname}
          friendId={user._id}
          setUpdatedFriend={setUpdatedFriend}
          setUpdatedUsers={setUpdatedUsers}
        >
          {full_friend_state && isMobile && "Add Friend"}
          <UserAddOutlined />
        </ReusableEventButton>
      )}
      {children}
    </div>
  );
};

export default SingleCardAddRemove;
