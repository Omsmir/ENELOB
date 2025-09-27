"use client";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DropdownProps<T> {
  className?: string;
  items: {
    innerText?: string;
    disabled?: boolean;
    onclick?: (value: T) => void;
    children?: React.ReactNode;
    className?: string;
  }[];
}

const Dropdown = ({ items, className }: DropdownProps<any>) => {
  return (
    <div className={`flex ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 focus:outline-none cursor-pointer"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4 " />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-slate-100 dark:bg-[var(--sidebar-accent)] p-0 border-0"
        >
          {items.map((item, index) => (
            <DropdownMenuItem
              key={index}
              className={`cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-200 dark:hover:text-black ${item.className}`}
              disabled={item.disabled}
              onClick={item.onclick}
            >
              {item.innerText}
              {item.children}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Dropdown;
