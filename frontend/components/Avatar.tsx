"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

interface AvatarProps {
  className?: string;
  profileImg?: string;
  displayName: string;
  children?: React.ReactNode;
  active?: boolean;
  titleClassName?:string
}

const BadgeAvatar = ({
  className,
  profileImg,
  displayName,
  children,
  active,
  titleClassName
}: AvatarProps) => {
  return (
    <div className={`flex items-center cursor-pointer p-2 min-w-[160px] `}>
      {active && active === true ? (
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          className="mr-1"
        >
          <Avatar
            alt="profile"
            className={`${className}`}
            src={profileImg || "/assets/images/dr-cruz.png"}
          />
        </StyledBadge>
      ) : (
        <div className="flex mr-1">
          <Avatar
            alt="profile"
            className={`${className}`}
            src={profileImg || "/assets/images/dr-cruz.png"}
          />
        </div>
      )}
      <div className="flex flex-col">
        <h1 className={`font-medium  capitalize ${titleClassName}`}>
          {displayName || "omar fouad"}
        </h1>
        {children ? (
          children
        ) : (
          <p className="text-[10px] text-slate-500 capitalize">User</p>
        )}
      </div>
    </div>
  );
};

export default BadgeAvatar;
