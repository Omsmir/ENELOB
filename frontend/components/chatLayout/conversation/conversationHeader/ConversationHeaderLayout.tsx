import { DashboardHook } from "@/components/context/Dashboardprovider";
import React from "react";
import ConversationHeaderContent from "./ConversationHeaderContent";
import ConversationLastSeen from "./ConversationLastSeen";

const ConversationHeaderLayout = () => {
  const { friend } = DashboardHook();


  if (!friend) {
    return (
      <ConversationHeaderContent
        id=""
        profileImg=""
        full_name="example user"
        dropdownState={false}
        active
        classname="flex border-b h-[110px] overflow-hidden m-0"
      />
    );
  }

  return (
    <ConversationHeaderContent
      id={friend._id}
      profileImg={friend.profileImg?.url}
      full_name={friend.full_name}
      dropdownState
      classname="flex justify-between items-center border-b h-[110px] overflow-hidden m-0"
    >
      <ConversationLastSeen id={friend._id} lastSeenAt={friend.lastSeenAt} />
    </ConversationHeaderContent>
  );
};

export default ConversationHeaderLayout;
