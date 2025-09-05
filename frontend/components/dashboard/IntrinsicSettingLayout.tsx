"use client";
import { cn } from "@/lib/utils";
import { Divider } from "antd";
import React from "react";

interface IntrinsicSettingLayoutProps {
  children: React.ReactNode;
  title: string;
  classname?: string;
}

const IntrinsicSettingLayout = ({
  children,
  title,
  classname,
}: IntrinsicSettingLayoutProps) => {
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-start col-span-12 bg-[var(--sidebar)] overflow-hidden rounded-md shadow-md shadow-slate-300 dark:shadow-slate-800",
        classname
      )}
    >
      <div className="flex justify-between items-center p-4 w-full">
        <h1 className="text-lg font-semibold capitalize">{title}</h1>
      </div>
      <Divider className=" dark:bg-slate-500 m-0 w-full" />
      {children}
    </div>
  );
};

export default IntrinsicSettingLayout;
