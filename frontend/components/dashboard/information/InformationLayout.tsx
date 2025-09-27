"use client";
import React from "react";
import ReusebleForm from "./ReusebleForm";
import AccountInfo from "./AccountInfo";
import { MainLayoutHook } from "@/components/context/LayoutContext";
import { Queries } from "@/actions/queries";
import { useSession } from "@/components/store/slices/AuthReducer";
import { User } from "@/types";

const InformationLayout = () => {
  const { form, editState, setEditState } = MainLayoutHook();

  const { session } = useSession();

  const { data, isFetching } = Queries.useGetUser({ id: session._id });

  return (
    <ReusebleForm editState={editState} setEditState={setEditState}>
      <AccountInfo
        form={form}
        isFetching={isFetching}
        user={data?.user as User}
      />
    </ReusebleForm>
  );
};

export default InformationLayout;
