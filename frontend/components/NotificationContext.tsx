"use client";
import React, { Fragment } from "react";
import { DashboardHook } from "./context/Dashboardprovider";

const NotificationContext = ({ children }: { children: React.ReactNode }) => {
  const { contextHolder } = DashboardHook();

  return (
    <Fragment>
      {contextHolder}
      {children}
    </Fragment>
  );
};

export default NotificationContext;
