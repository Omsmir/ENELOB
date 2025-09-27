"use client";
import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

interface ReusableBackdropProps {
  children?: React.ReactNode;
  color?: "#fff" | "transparent";
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  button?:React.ReactNode
}

const ReusableBackdrop = ({
  children,
  color = "#fff",
  open,
  setOpen,
  button
}: ReusableBackdropProps) => {
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      {button ? button : <Button onClick={handleOpen}>Show backdrop</Button>}
      <Backdrop
        sx={(theme) => ({ color, zIndex: theme.zIndex.drawer + 1 })}
        open={open}
        onClick={handleClose}
      >
        {children ? children : <CircularProgress color="inherit" />}
      </Backdrop>
    </div>
  );
};

export default ReusableBackdrop;
