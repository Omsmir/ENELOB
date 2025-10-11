import { DashboardHook } from "@/components/context/Dashboardprovider";
import { format } from "date-fns";
import React from "react";

interface ConversationLastSeenProps {
  id: string;
  lastSeenAt: Date;
}

const ConversationLastSeen = ({
  id,
  lastSeenAt,
}: ConversationLastSeenProps) => {
  const { isActive } = DashboardHook();
  if (isActive(id)) {
    return (
      <div className="flex">
        <p className="text-xs lowercase text-slate-500">online</p>
      </div>
    );
  } else {
    return (
      <div className="flex">
        <p className="text-xs lowercase text-slate-500">
          last seen at {format(lastSeenAt, "Ppp")}
        </p>
      </div>
    );
  }
};

export default ConversationLastSeen;
