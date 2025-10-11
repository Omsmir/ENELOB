"use client";
import BadgeAvatar from "@/components/Avatar";
import { DashboardHook } from "@/components/context/Dashboardprovider";
import React from "react";
import ConversationHeaderDropdown from "./ConversationHeaderDropdown";

interface ConversationHeaderContentProps {
  classname?: string;
  children?: React.ReactNode;
  dropdownState: boolean;
  profileImg?: string;
  full_name: string;
  id: string;
  active?: boolean;
}

const ConversationHeaderContent = ({
  classname,
  children,
  dropdownState,
  profileImg,
  full_name,
  id,
  active,
}: ConversationHeaderContentProps) => {
  const { isActive } = DashboardHook();
  return (
    <div className={`${classname}`}>
      <BadgeAvatar
        profileImg={profileImg}
        displayName={full_name}
        className="!size-16"
        active={active || isActive(id)}
        titleClassName="!text-sm"
      >
        {children}
      </BadgeAvatar>
      {dropdownState && <ConversationHeaderDropdown friendId={id} />}
    </div>
  );
};

export default ConversationHeaderContent;
