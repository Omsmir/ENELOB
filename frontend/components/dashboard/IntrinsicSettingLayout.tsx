"use client";
import { cn } from "@/lib/utils";
import { Divider } from "antd";
import React from "react";
import Dropdown from "./Dropdown";

interface IntrinsicSettingLayoutProps {
  children: React.ReactNode;
  title: string;
  classname?: string;
  showMenu?: boolean;
  editState?: boolean;
  setEditState?: React.Dispatch<React.SetStateAction<boolean>>;
}

const IntrinsicSettingLayout = ({
  children,
  title,
  classname,
  showMenu,
  editState,
  setEditState,
}: IntrinsicSettingLayoutProps) => {
  return (
    <div
      className={cn(
        "flex flex-col justify-start items-start col-span-12 bg-[var(--sidebar)] overflow-hidden rounded-md shadow-md shadow-slate-300 dark:shadow-slate-800 min-h-[400px] ",
        classname
      )}
    >
        <div className="flex flex-col w-full mb-4 max-h-[120px]">
          <div className="flex justify-between items-center p-6 w-full max-h-[75px]">
          <h1 className="text-lg font-semibold capitalize">{title}</h1>
          {showMenu && (
            <Dropdown
              innerText="edit"
              onclick={setEditState}
              disabled={editState}
            />
          )}
        </div>
        <Divider className=" dark:bg-slate-500 m-0 w-full" />
        </div>

      {children}
    </div>
  );
};

export default IntrinsicSettingLayout;
