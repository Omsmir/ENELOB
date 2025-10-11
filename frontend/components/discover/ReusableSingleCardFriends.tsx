"use client";
import { useSession } from "@/components/store/slices/AuthReducer";
import { Button } from "@/components/ui/button";
import React from "react";
import ReusableEventButton from "./ReusableEventButton";
import { UserDeleteOutlined } from "@ant-design/icons";
import { users, usersDiscoverd } from "@/types";
import {
  DashboardHook,
  ResponsiveMedia,
} from "@/components/context/Dashboardprovider";
import { useDispatch } from "react-redux";
import { updateConversationId } from "@/components/store/slices/usersReducer";
import { useRouter } from "next/navigation";

interface ReusableSingleCardFriendsProps {
  payload: usersDiscoverd;
  className?: string;
  message_button_classname?: string;
  setUpdatedFriend?: (value: React.SetStateAction<usersDiscoverd>) => void;
  setUpdatedUsers?: React.Dispatch<React.SetStateAction<users | undefined>>;
  full_friend_state: boolean;
}

const ReusableSingleCardFriends = ({
  payload,
  className,
  setUpdatedFriend,
  setUpdatedUsers,
  full_friend_state,
  message_button_classname,
}: ReusableSingleCardFriendsProps) => {
  const { user, userId } = payload;
  const { session } = useSession();
  const { UseMediaQuery } = DashboardHook();
  const router = useRouter();

  const isMobile = UseMediaQuery({ MEDIA_TYPE: ResponsiveMedia.IS_MOBILE });

  const { setFriend } = DashboardHook();
  const dispatch = useDispatch();

  const sendMessage = () => {
    setFriend(user);
    dispatch(updateConversationId(user._id));
    router.push("/dashboard/messages");
  };

  return (
    session._id === userId && (
      <div className={`flex flex-col ${className}`}>
        <p
          className={`text-slate-500 dark:text-slate-50 text-sm capitalize mb-2 ${
            full_friend_state && "text-end"
          }`}
        >
          you're friends
        </p>

        <div className="flex justify-end">
          {full_friend_state && (
            <ReusableEventButton
              friendId={user._id}
              className="bg-red-500 transition-colors hover:bg-red-700 dark:text-slate-50"
              state="remove"
              setUpdatedFriend={setUpdatedFriend}
              setUpdatedUsers={setUpdatedUsers}
            >
              {isMobile && "remove friend"} <UserDeleteOutlined />
            </ReusableEventButton>
          )}

          <Button
            className={message_button_classname}
            type="button"
            onClick={sendMessage}
          >
            Message
          </Button>
        </div>
      </div>
    )
  );
};

export default ReusableSingleCardFriends;
