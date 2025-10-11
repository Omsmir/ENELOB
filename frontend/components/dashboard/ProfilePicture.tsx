"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import SubmitButton from "@/components/togglers/SubmitButton";
import { changePicturesSchema } from "@/lib/vaildation";
import { DashboardHook } from "@/components/context/Dashboardprovider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import CustomFileUploader, { FileUploaderType } from "../CustomFileUploader";
import CustomSkeleton, { SkeletonType } from "../CustomSkeleton";
import { Mutations } from "@/actions/mutations";
import { useSession } from "../store/slices/AuthReducer";
import { MainLayoutHook } from "../context/LayoutContext";

const ProfilePicture = () => {
  const { api, isLoading } = DashboardHook();
  const { previewCover, fileLength, setPreviewCover, setFilesLength } =
    MainLayoutHook();
  const [loading, setLoading] = useState(true);
  const [buttonState, setButtonState] = useState(true);
  const { session } = useSession();

  const changePicture = Mutations.useUpdateProfilePicture(api);

  const form = useForm<z.infer<typeof changePicturesSchema>>({
    resolver: zodResolver(changePicturesSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: z.infer<typeof changePicturesSchema>) => {
    const formData = new FormData();

    const profileImg = {
      profileImg: values.profileImg?.[0] ?? undefined,
      coverImg: values.coverImg?.[0] ?? undefined,
    };

    Object.entries(profileImg).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as any);
      }
    });
    try {
      changePicture.mutate(
        { id: session._id, profileImg: formData },
        {
          onSuccess: async () => {
            setFilesLength(0);
            setTimeout(() => {
              form.reset();
              setPreviewCover(undefined);
            }, 1000);
          },
        }
      );
    } catch (error: any) {
      console.log(`error from Account profile: ${error.message}`);
    }
  };


  useEffect(() => {
    if (fileLength >= 1) {
      setButtonState(false);
    } else {
      setButtonState(true);
    }
  }, [fileLength]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col  pb-10 pt-0 w-full space-y-4"
      >
        <div className="flex relative mb-10">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SKELETON}
            name="coverImg"
            renderSkeleton={(field) => (
              <FormControl>
                <CustomFileUploader
                  files={field.value}
                  onChange={field.onChange}
                  type={FileUploaderType.PICTURE}
                  fieldUploadType={FileUploaderType.COVER}
                />
              </FormControl>
            )}
          />
          <div className="flex w-full overflow-hidden">
            <CustomSkeleton
              setLoading={setLoading}
              loading={loading}
              src={
                previewCover ||
                session.coverImg ||
                "/assets/images/placeholder.jpg"
              }
              width={1200}
              height={1200}
              classname="w-full"
              SkeletonType={SkeletonType.COVER}
            />
          </div>
          <div className="absolute flex  justify-start  mt-4 space-y-4 z-10 left-8 top-50 ">
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
                src={session.profileImg || "/assets/images/dr-cruz.png"}
              />
            </div>

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SKELETON}
              name="profileImg"
              errorState
              renderSkeleton={(field) => (
                <FormControl>
                  <CustomFileUploader
                    files={field.value}
                    onChange={field.onChange}
                    type={FileUploaderType.PICTURE}
                    fieldUploadType={FileUploaderType.PICTURE}
                    buttonTitle="change"
                    classname="!mt-0 absolute left-0 top-0 group"
                    buttonClassName="hidden group-hover:block group-hover:text-slate-50 transition-all"
                  />
                </FormControl>
              )}
            />
          </div>
        </div>
        <div className=" flex w-full justify-center items-center">
          <h1 className="text-sm text-red-700 lowercase">
            {form.formState.errors.coverImg?.message}
          </h1>
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center w-full px-2 md:px-4 xl:px-8">
          <div className="flex flex-col mt-2 space-y-1 sm:mt-0">
            <p className="text-xs text-slate-500">
              The image should be less than 2MB in size and in JPEG or PNG
              format.
            </p>
            <p className="text-xs text-slate-500">
              <span className="text-red-500">Note:</span> profile picture can be
              changed only once in 3 days.
            </p>
          </div>
          <SubmitButton
            className="bg-slate-800 text-slate-50 max-h-[25px] w-full sm:w-[160px] cursor-pointer"
            isLoading={isLoading}
            disabled={buttonState || isLoading}
            disabledText="change"
            innerText=" " // important
          >
            change
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
};

export default ProfilePicture;
