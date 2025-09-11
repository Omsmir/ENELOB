"use client";
import React from "react";
import IntrinsicSettingLayout from "./IntrinsicSettingLayout";
import ProfilePicture from "./ProfilePicture";
import { MotionComponent, Motions } from "../relatedComponents/Motion";
import FriendRequestsLayout from "./friendRequests/FriendRequestsLayout";
import InformationLayout from "./information/InformationLayout";
import { MainLayoutHook } from "../context/LayoutContext";

const SettingLayout = () => {
  const { setEditState, editState } = MainLayoutHook();
  return (
    <MotionComponent form={Motions.FADEIN}>
      <div className="grid grid-cols-12 w-full pt-0 px-4 pb-6">
        <IntrinsicSettingLayout title="Profile and account" classname="mb-8 ">
          <ProfilePicture />
        </IntrinsicSettingLayout>

        <IntrinsicSettingLayout
          title="friend requests"
          classname="col-span-12 xl:col-span-4 mb-8 xl:mr-2 xl:mb-0"
        >
          <FriendRequestsLayout />
        </IntrinsicSettingLayout>
        <IntrinsicSettingLayout
          title="account information"
          classname="col-span-12 xl:col-span-8  bg-[var(--sidebar)] rounded-md shadow-md shadow-slate-300 dark:shadow-slate-800 "
          showMenu
          setEditState={setEditState}
          editState={editState}
        >
          <InformationLayout />
        </IntrinsicSettingLayout>
      </div>
    </MotionComponent>
  );
};

export default SettingLayout;
