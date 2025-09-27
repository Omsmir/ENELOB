"use client";
import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";

interface CustomTooltipProps {
  title: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  children?: React.ReactNode;
}
const CustomTooltip = ({
  title,
  position,
  className,
  children,
}: CustomTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children ? children : <Button variant="outline">Hover</Button>}
      </TooltipTrigger>
      <TooltipContent className={`${className}`} side={position ?? "top"}>
        <p>{title}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default CustomTooltip;
