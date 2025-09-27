"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/CustomFormField";
import { FormFieldType } from "@/components/CustomFormField";
import SubmitButton from "../../togglers/SubmitButton";
import { messageSchema } from "@/lib/vaildation";
import { DashboardHook } from "../../context/Dashboardprovider";
import { Mutations } from "@/actions/mutations";
import { useSession } from "@/components/store/slices/AuthReducer";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store/store";
import { TagFaces } from "@mui/icons-material";
import EmojiPicker from "emoji-picker-react";
import ReusableDialog from "@/components/Dialog";

const Emulator = () => {
  const { api, contextHolder, isLoading, friend } = DashboardHook();
  const [emojiMenuState, setEmojiMenuState] = useState(false);

  const { session } = useSession();

  const sendMessage = Mutations.useUpdateConversation(api);
  const conversationId = useSelector(
    (state: RootState) => state.users.conversationId
  );

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof messageSchema>) => {
    const formData = new FormData();

    const data = {
      content: values.content,
    };

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        formData.append(key, value);
      }
    });
    try {
      if (!friend) return null;
      sendMessage.mutate(
        {
          id: session._id,
          recipientId: friend._id ?? "",
          data: formData,
        },
        {
          onSuccess: () => {
            form.reset();
          },
        }
      );
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleSubmitValue = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  const handleEmojiMenu = () => {
    setEmojiMenuState(!emojiMenuState);
  };

  useEffect(() => {
    form.clearErrors("content");
  }, [conversationId]);
  return (
    <Form {...form}>
      {contextHolder}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-center items-center  max-h-[70px] "
      >
        <div className="flex justify-between items-center w-full rounded-lg bg-white dark:bg-slate-900 p-2">
          <div className="flex items-center relative w-full">
            {form.formState.errors.content && (
              <p className="absolute bg-slate-50 left-0 -top-8 text-red-800 text-sm p-2 rounded-md">
                {form.formState.errors.content.message}
              </p>
            )}

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="content"
              error={form.formState.errors.content}
              disabled={friend?._id === undefined}
              placeholder="type a message"
              className="p-4 dark:bg-slate-900 dark:text-slate-50"
              onKeyDown={handleSubmitValue}
            >
             
            </CustomFormField>
          </div>
          <SubmitButton
            disabled={friend?._id === undefined}
            disabledText="select a chat"
            isLoading={isLoading}
            className="bg-slate-900 text-slate-50 cursor-pointer max-w-[120px] dark:hover:bg-slate-800"
          >
            send message
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
};

export default Emulator;
