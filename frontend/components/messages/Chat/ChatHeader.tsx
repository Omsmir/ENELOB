import BadgeAvatar from "@/components/Avatar";
import { DashboardHook } from "@/components/context/Dashboardprovider";
import { RootState } from "@/components/store/store";
import { format } from "date-fns";
import React from "react";
import { useSelector } from "react-redux";

const ChatHeader = () => {
  const { friend, isActive } = DashboardHook();

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
  return (
    <div className="flex border-b h-[110px] overflow-hidden m-0">
      <BadgeAvatar
        profileImg={friend.profileImg?.url}
        displayName={friend.full_name}
        className="!size-16"
        active={isActive(friend._id)}
        titleClassName="!text-sm"
      >
        <LastSeenComponent />
      </BadgeAvatar>
    </div>
  );
};

export default ChatHeader;
