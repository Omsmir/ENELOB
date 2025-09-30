"use client";
import React from "react";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import SubmitButton from "@/components/togglers/SubmitButton";
import { AccountSchema } from "@/lib/vaildation";
import { DashboardHook } from "@/components/context/Dashboardprovider";
import { Button } from "@/components/ui/button";
import { MainLayoutHook } from "@/components/context/LayoutContext";
import { Mutations } from "@/actions/mutations";
import { useSession } from "@/components/store/slices/AuthReducer";

interface ReusebleFormDataProps {
  children: React.ReactNode;
  className?: string;
  editState: boolean;
  setEditState: React.Dispatch<React.SetStateAction<boolean>>;
}
const ReusebleForm = ({
  children,
  className,
  editState,
  setEditState,
}: ReusebleFormDataProps) => {
  const { isLoading, form } = MainLayoutHook();
  const { api } = DashboardHook();
  const { session } = useSession();
  const handleEdit = () => {
    setEditState(false);
  };

  const updateUser = Mutations.useChangeUserInfo(api);
  const updateSession = Mutations.useReissueAccessToken(api)
  const onSubmit = (values: z.infer<typeof AccountSchema>) => {
    const data = {
      id: session._id,
      full_name: values.full_name === session.full_name ? undefined : values.full_name,
      gender: values.gender,
    };

    try {
      updateUser.mutate(data, {
        onSuccess: async () => {
          setEditState(false)
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await updateSession.mutateAsync({id:session._id})
        },
      });
    } catch (error: any) {
      console.log(`error from Account profile: ${error.message}`);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col p-8 pb-10 pt-0 w-full grid-cols-12 h-full"
      >
        <div className="grid grid-cols-12 gap-4">{children}</div>
        {editState && (
          <div className="flex justify-end items-center w-full ">
            <Button
              className="bg-slate-100 text-black hover:bg-slate-200 max-h-[25px] mx-2 cursor-pointer"
              onClick={handleEdit}
            >
              cancel
            </Button>
            <SubmitButton
              className="bg-slate-800 text-slate-50 max-h-[25px] cursor-pointer"
              isLoading={isLoading}
              innerText=" " // importtant
            >
              change
            </SubmitButton>
          </div>
        )}
      </form>
    </Form>
  );
};

export default ReusebleForm;
