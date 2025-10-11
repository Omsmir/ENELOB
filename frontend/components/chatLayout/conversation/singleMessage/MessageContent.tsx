import { useSession } from "@/components/store/slices/AuthReducer";
import { DoneAll } from "@mui/icons-material";
import React from "react";

interface MessageContentProps {
  content: string;
  seen?: boolean;
  userId: string;
}

const MessageContent = ({
  content,
  seen,
  userId,
}: MessageContentProps) => {
  const { session } = useSession();
  return (
    <div className="relative flex w-full bg-white dark:bg-slate-800 p-4 rounded-md shadow-sm my-2 max-w-xs md:max-w-md lg:max-w-md  break-words whitespace-pre-wrap ">
      <p>{content}</p>
      {userId === session._id && (
        <span className="absolute right-0 bottom-0 mr-2 mb-1">
          <DoneAll
            className={`${
              seen === true ? "text-green-700" : "text-slate-500"
            } !text-[16px]`}
          />
        </span>
      )}
    </div>
  );
};

export default MessageContent;
