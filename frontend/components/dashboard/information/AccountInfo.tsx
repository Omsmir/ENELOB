"use client";
import { format } from "date-fns";
import React from "react";
import SingleInformationRow from "@/components/SingleInformationRow";
import CustomSkeleton, { SkeletonType } from "@/components/CustomSkeleton";
import { EditFilled } from "@ant-design/icons";
import FieldEnumeration from "@/components/FieldEnumeration";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { AccountSchema } from "@/lib/vaildation";
import { User } from "@/types";
import { MainLayoutHook } from "@/components/context/LayoutContext";
import { genders } from "@/lib/constants";

interface AccountInfoProps {
  user: User | undefined;
  isFetching: boolean;
  form: UseFormReturn<z.infer<typeof AccountSchema>>;
}

const AccountInfo = ({ user, isFetching, form }: AccountInfoProps) => {
  const { editState } = MainLayoutHook();

  const userData: {
    value?: string;
    title: string;
    editable?: boolean;
    array?: string[];
  }[] = [
    {
      value: user?.full_name,
      title: "Account Name",
      editable: true,
    },
    {
      value: `#${user?._id.slice(0, 11).toUpperCase()}`,
      title: "Account Number",
    },
    {
      value: user?.createdAt && format(user.createdAt as Date, "PPpp"),
      title: "Date Created",
    },
    {
      value: user?.updatedAt && format(user.updatedAt as Date, "PPpp"),
      title: "Last Modified",
    },
    {
      value:user?.email,
      title:"email"
    },
    {
      value: user?.gender || "not assigned",
      title: "gender",
      editable:true,
      array:genders
    },{
      title:"verification",
      value:user?.verified ? "verified" : "not verified"
    }
  ];
  return userData.map((element) => {
    if (element.editable) {
      return (
        <SingleInformationRow
          innerText={element.title}
          key={element.title}
          className={`text-sm md:col-span-4 lg:col-span-3 mt-8`}
          editableIcon={<EditFilled className="text-[12px] text-blue-800" />}
        >
          {editState ? (
            <FieldEnumeration
              form={form}
              name={element.title}
              placeHolder={element.value as string}
              Array={element.array}
            />
          ) : (
            <CustomSkeleton
              SkeletonType={SkeletonType.HEAD}
              innerText={element.value}
              loading={isFetching}
              classname="min-w-32 text-sm"
            />
          )}
        </SingleInformationRow>
      );
    }
    return (
      <SingleInformationRow
        innerText={element.title}
        key={element.title}
        className={`text-sm md:col-span-4 lg:col-span-3 mt-8`}
      >
        <CustomSkeleton
          SkeletonType={SkeletonType.HEAD}
          innerText={element.value}
          loading={isFetching}
          classname="min-w-32 text-sm"
        />
      </SingleInformationRow>
    );
  });
};

export default AccountInfo;
