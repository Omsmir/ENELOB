"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/CustomFormField";
import { FormFieldType } from "@/components/CustomFormField";
import { useState } from "react";
import { User, KeyRound, EyeOff, Eye } from "lucide-react";
import SubmitButton from "./togglers/SubmitButton";
import { userSchema } from "@/lib/vaildation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardHook } from "./context/Dashboardprovider";
import { Mutations } from "@/actions/mutations";

const LoginForm = () => {
  const [state, setState] = useState<boolean>(false);
  const { api, contextHolder, isLoading } = DashboardHook();
  const LoginIn = Mutations.useLogin(api, true);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    const email = values.email;
    const password = values.password;

    try {
      await LoginIn.mutateAsync(
        { email, password },
        {
          onSuccess: async () => {
            router.push("/dashboard");
          },
        }
      );
    } catch (error: any) {
      console.log(error.message);
    }
  };
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      {contextHolder}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 my-auto px-4 sm:p-0 sm:mx-4"
      >
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-slate-50 bg-amber-800 uppercase text-6xl font-bold rounded-sm p-1">
            {" "}
            ENELOB
          </h1>
          <div className="my-4">
            <h1 className="text-2xl font-bold sm:text-4xl text-center">
              Welcome To Enelob Chats
            </h1>
          </div>
        </div>
        <CustomFormField
          control={form.control}
          Lucide={<User className="dark:text-dark-600" />}
          placeholder="enter your email"
          label="email address"
          fieldType={FormFieldType.INPUT}
          name="email"
          error={form.formState.errors.email}
          state
        />

        <div className="flex flex-col">
          <CustomFormField
            control={form.control}
            Lucide={<KeyRound className="dark:text-dark-600" />}
            placeholder="enter password"
            label="password"
            fieldType={FormFieldType.PASSWORD}
            type={state ? "text" : "password"}
            error={form.formState.errors.password}
            name="password"
          >
            {state ? (
              <Eye
                onClick={() => setState(false)}
                size="20px"
                cursor="pointer"
              />
            ) : (
              <EyeOff
                onClick={() => setState(true)}
                size="20px"
                cursor="pointer"
              />
            )}
          </CustomFormField>
        </div>
        <SubmitButton
          isLoading={isLoading}
          className="bg-amber-600 w-full text-slate-50 cursor-pointer"
          innerText="signing in"
        >
          Sign in
        </SubmitButton>

        <div className="flex justify-between">
          <p className="text-sm text-slate-500">doesn't have account?</p>
          <Link href={"/register"}>
            <p className="text-sky-700 text-sm hover:underline">create one</p>
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
