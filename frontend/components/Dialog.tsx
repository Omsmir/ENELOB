"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
interface ReusableDialogProps {
  children: React.ReactNode;
  triggerButton?: React.ReactElement;
}

const ReusableDialog = ({ children, triggerButton }: ReusableDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger>{triggerButton ? triggerButton : "open"}</DialogTrigger>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default ReusableDialog;
