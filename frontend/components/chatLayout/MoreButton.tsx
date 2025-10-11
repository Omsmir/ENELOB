"use client";
import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface MoreButtonProps {
  className?: string;
  hasPreviousOrNextPage?: boolean;
  isFetching: boolean;
  isFetchingNextOrPerviousPage: boolean;
  handleNextOrPerviousPage?: () => void;
  title?: string;
}

const MoreButton = ({
  className,
  hasPreviousOrNextPage,
  isFetching,
  isFetchingNextOrPerviousPage,
  handleNextOrPerviousPage,
  title,
}: MoreButtonProps) => {
  return (
    <div className="flex justify-center items-end w-full my-2">
      <Button
        className={cn(
          "bg-[var(--sidebar-accent)] dark:bg-black text-slate-50 cursor-pointer w-1/4 capitalize ",
          className
        )}
        onClick={handleNextOrPerviousPage}
        disabled={
          !hasPreviousOrNextPage || isFetching || isFetchingNextOrPerviousPage
        }
      >
        {title || "more chats"}
      </Button>
    </div>
  );
};

export default MoreButton;
