"use client";

import React from "react";
import { ConstructedLayoutProps } from "@/types";

const ConstructedLayout = ({ children }: ConstructedLayoutProps) => {
  return (
    <div className="flex min-h-screen py-16 px-4 sm:px-12 space-y-8 my-10 ">
      <div className="grid grid-cols-1 lg:grid-cols-2  w-full">{children}</div>
    </div>
  );
};

export default ConstructedLayout;
