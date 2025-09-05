"use client";
import { useSession } from "next-auth/react";
import React from "react";
import DiscoverQuery from "./DiscoverQuery";

const DiscoverLayout = () => {
  const { data: session } = useSession();
  return (
    <DiscoverQuery />
  );
};

export default DiscoverLayout;
