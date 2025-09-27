"use client";
import React, { useState } from "react";
import CustomSkeleton, { SkeletonType } from "@/components/CustomSkeleton";
import { useSession } from "@/components/store/slices/AuthReducer";

import { usersDiscoverd } from "@/types";
import Events from "./Events";

const Profile = ({ friend }: { friend: usersDiscoverd }) => {
  const [loading, setLoading] = useState(true);
  const [updatedFriend, setUpdatedFriend] = useState<usersDiscoverd>(friend);

  return (
    <div className="flex flex-col w-full relative mb-10">
      <div className="flex w-full overflow-hidden">
        <CustomSkeleton
          setLoading={setLoading}
          loading={loading}
          src={friend.user.coverImg?.url || "/assets/images/placeholder.jpg"}
          width={1200}
          height={1200}
          classname="w-full"
          SkeletonType={SkeletonType.COVER}
        />
      </div>
      <div className="absolute flex  justify-center items-center  mt-4 space-y-4 z-10 left-8 top-52 ">
        <div className="flex justify-center items-center w-[125px] h-[125px] rounded-full overflow-hidden mr-2 bg-[var(--sidebar)]">
          <CustomSkeleton
            loading={loading}
            SkeletonType={SkeletonType.AVATAR}
            classname="rounded-full overflow-hidden size-28 "
            setLoading={setLoading}
            shape="circle"
            size={125}
            width={125}
            height={125}
            src={friend.user.profileImg?.url || "/assets/images/dr-cruz.png"}
          />
        </div>
        <div className="flex flex-col  items-start">
          <h1 className="font-medium capitalize text-slate-50">
            {friend.user.full_name}
          </h1>
          <p className="text-sm text-slate-500">{friend.user.gender}</p>
        </div>
      </div>

      <Events
        updatedFriend={updatedFriend}
        setUpdatedFriend={setUpdatedFriend}
      />
    </div>
  );
};

export default Profile;
