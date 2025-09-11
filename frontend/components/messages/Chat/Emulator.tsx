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

const Emulator = () => {
  const { api, contextHolder, isLoading, friend} = DashboardHook();

  const {  session } = useSession();

  const sendMessage = Mutations.useUpdateConversation(api);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof messageSchema>) => {
    try {
      if (!friend) return null;
      sendMessage.mutate(
        {
          id: session._id,
          recipientId: friend._id ?? "",
          content: values.content,
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

  return (
    <Form {...form}>
      {contextHolder}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-center items-center  max-h-[70px] "
      >
        <div className="flex justify-between items-center w-full rounded-lg bg-white dark:bg-slate-900 p-2">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="content"
            error={form.formState.errors.content}
            disabled={friend?._id === undefined}
            placeholder="type a message"
            className="p-4 dark:bg-slate-900 dark:text-slate-50"
          />
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
