import { format } from "date-fns";
import React from "react";

interface MessageEncasuplateProps {
  displayName: string;
  sentAt: Date;
  children: React.ReactNode;
}

const MessageEncasuplate = ({
  displayName,
  sentAt,
  children,
}: MessageEncasuplateProps) => {
  return (
    <div className="flex flex-col justify-start items-start px-4">
      <div className="flex justify-between items-center !min-w-[200px] w-full">
        <h1 className="font-medium capitalize ">{displayName}</h1>
        <p className="text-sm text-slate-400 uppercase">
          {format(sentAt, "p")}
        </p>
      </div>
      {children}
    </div>
  );
};

export default MessageEncasuplate;
