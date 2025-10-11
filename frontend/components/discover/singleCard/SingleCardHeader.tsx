"use client"
import { usersDiscoverd } from "@/types";
import { differenceInCalendarYears } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface SingleCardHeaderProps {
  payload: usersDiscoverd;
}

const SingleCardHeader = ({ payload }: SingleCardHeaderProps) => {
  const { user } = payload;

  return (
    <div className="flex flex-col w-full">
      <Link
        href={`/dashboard/discover/${user._id}`}
        className="flex overflow-hidden w-full min-h-[225px] max-h-[225px] group cursor-pointer rounded-b-md"
      >
        <Image
          width={1000}
          height={1000}
          alt="logo"
          src={user.profileImg?.url || "/assets/images/1.avif"}
          className="object-center object-cover w-full h-full group-hover:scale-[1.05] group-hover:opacity-90 transition-transform"
        />
      </Link>
      <div className="flex flex-col justify-start items-start p-4">
        <h1 className="text-xl font-medium capitalize">{user.full_name}</h1>
        <p className="text-slate-500 capitalize ">{user.gender}</p>
      </div>
    </div>
  );
};

export default SingleCardHeader;
