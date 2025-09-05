"use client";

import Zod from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField from "./CustomFormField";
import { FormFieldType } from "./CustomFormField";
import { useState } from "react";
import { User, KeyRound, EyeOff, Eye } from "lucide-react";
import SubmitButton from "./togglers/SubmitButton";
import { RegisterSchema } from "@/lib/vaildation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardHook } from "./context/Dashboardprovider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mutations } from "@/actions/mutations";
import { genders } from "@/lib/constants";
import { SelectItem } from "./ui/select";

const RegisterForm = () => {
  const [state, setState] = useState<boolean>(false);
  const { api, contextHolder, isLoading } = DashboardHook();
  const router = useRouter();

  const register = Mutations.UseRegister(api);
  const onSubmit = async (values: Zod.infer<typeof RegisterSchema>) => {

    const data = {
      email: values.email,
      password: values.password,
      passwordConfirm: values.passwordConfirm,
      full_name: values.full_name,
      gender:values.gender,
      birthDate:values.birthDate
    };

   
    try {
      console.log(data)
      await register.mutateAsync(data);
    } catch (error: any) {
      console.log(error.message);
    }
  };
  const form = useForm<Zod.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  return (
    <Form {...form}>
      {contextHolder}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-12"
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
          placeholder="username"
          label="Username"
          fieldType={FormFieldType.INPUT}
          name="full_name"
          error={form.formState.errors.full_name}
          state
        />
        <CustomFormField
          control={form.control}
          Lucide={<User className="dark:text-dark-600" />}
          placeholder="enter your email"
          label="Email address"
          fieldType={FormFieldType.INPUT}
          name="email"
          error={form.formState.errors.email}
          state
        />

        <CustomFormField
          control={form.control}
          Lucide={<KeyRound className="dark:text-dark-600" />}
          placeholder="enter password"
          label="Password"
          fieldType={FormFieldType.PASSWORD}
          type={state ? "text" : "password"}
          error={form.formState.errors.password}
          children={
            <>
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
            </>
          }
          name="password"
        />

        <CustomFormField
          control={form.control}
          Lucide={<KeyRound className="dark:text-dark-600" />}
          placeholder="confirm password"
          label="Confirm password"
          fieldType={FormFieldType.PASSWORD}
          type={state ? "text" : "password"}
          error={form.formState.errors.passwordConfirm}
          children={
            <>
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
            </>
          }
          name="passwordConfirm"
        />
        <div className="flex items-start">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            label="Gender"
            name="gender"
            placeholder="select a gender"
            className="max-h-[250px]"
          >
            {genders.map((value, index) => (
              <SelectItem
                key={index}
                value={value}
                className="cursor-pointer transition-colors hover:bg-slate-200 "
              >
                <div className="flex justify-center items-center">
                  <p className="text-md text-black mx-2">{value}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.DATE}
            label="Birthday"
            name="birthDate"
            className="ml-1"
          />
        </div>

        <SubmitButton
          isLoading={isLoading}
          className="bg-amber-600 w-full text-slate-50 cursor-pointer"
        >
          Register
        </SubmitButton>
        <div className="flex justify-between">
          <p className="text-sm text-slate-500">have account?</p>
          <Link href={"/"}>
            <p className="text-sky-700 text-sm hover:underline">
              return to login
            </p>
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
