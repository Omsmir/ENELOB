"use client";
import React from "react";
import IntrinsicSettingLayout from "./IntrinsicSettingLayout";
import ProfilePicture from "./ProfilePicture";
import { MotionComponent, Motions } from "../relatedComponents/Motion";
import FriendRequestsLayout from "./friendRequests/FriendRequestsLayout";

const SettingLayout = () => {
  return (
    <MotionComponent form={Motions.FADEIN}>
    <div className="grid grid-cols-12 w-full pt-0 px-4 pb-6">
      <IntrinsicSettingLayout title="Profile and account" classname="mb-8 ">
        <ProfilePicture />
      </IntrinsicSettingLayout>

      <IntrinsicSettingLayout title="friend requests" classname="col-span-12 lg:col-span-6 xl:col-span-4 mb-8 ">
        <FriendRequestsLayout />
      </IntrinsicSettingLayout>
    </div>

    </MotionComponent>
  );
};

export default SettingLayout;
