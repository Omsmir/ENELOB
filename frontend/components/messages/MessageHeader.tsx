import React from "react";

const MessageHeader = () => {
  return (
    <div className="flex p-4 border-b-[1px] m-0 h-[110px] max-h-[110px]">
      <h1 className="capitalize text-[var(--sidebar-accent)]  dark:text-slate-50 text-4xl font-bold p-4 ">
        Messages
      </h1>
    </div>
  );
};

export default MessageHeader;
