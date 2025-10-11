"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/CustomFormField";
import { FormFieldType } from "@/components/CustomFormField";
import { useEffect, useState } from "react";
import SubmitButton from "../togglers/SubmitButton";
import { discoverSchema } from "@/lib/vaildation";
import { DashboardHook } from "../context/Dashboardprovider";
import { Input } from "../ui/input";
import { useDebounce } from "../Debounce";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import MainLayout from "./MainLayout";
import { Queries } from "@/actions/queries";
import { genders } from "@/lib/constants";
import { SelectItem } from "../ui/select";
import { useSession } from "../store/slices/AuthReducer";

const DiscoverQuery = () => {
  const [value, setValue] = useState<string>("");
  const debouncedData = useDebounce(value, 500);
  const [isActive, setIsActive] = useState<"general" | "filtered">("filtered");
  const [filiteredUserObject, setFilteredUserObject] = useState<
    { friendName: string; olderThan?: Date; gender?: string } | undefined
  >(undefined);
  const { isLoading } = DashboardHook();
  const { session } = useSession();

  const { data, isFetching, error, isError } = Queries.UseDiscoverFriends({
    id: session._id,
    ...debouncedData,
    ...filiteredUserObject,
  });

  const onSubmit = async (values: z.infer<typeof discoverSchema>) => {
    try {
      setFilteredUserObject(values);
    } catch (error: any) {
      console.log(error.message);
    }
  };
  const form = useForm<z.infer<typeof discoverSchema>>({
    resolver: zodResolver(discoverSchema),
    defaultValues: {
      friendName: "",
    },
  });

  useEffect(() => {
    return () => {
      setFilteredUserObject(undefined);
    };
  }, [isActive]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col lg:grid grid-cols-12 w-full"
      >
        <div className="flex flex-col justify-start col-span-12  lg:col-span-4 border-r-[1px]">
          <div className="flex flex-col justify-center border-b-[1px]  w-full">
            <h1 className="font-bold text-3xl text-[var(--sidebar-accent)] dark:text-slate-50 capitalize p-8">
              discover friends
            </h1>
            <Tabs defaultValue="filtered" className="w-full p-4">
              <TabsList className="bg-slate-200 dark:bg-slate-800 w-full rounded-md">
                <TabsTrigger
                  value="general"
                  className={`${
                    isActive === "general" && "bg-slate-50 dark:bg-slate-700"
                  } rounded-md dark:text-slate-50 cursor-pointer  transition-colors`}
                  onClick={() => setIsActive("general")}
                >
                  General
                </TabsTrigger>
                <TabsTrigger
                  value="filtered"
                  className={`${
                    isActive === "filtered" && "bg-slate-50 dark:bg-slate-700"
                  } rounded-md dark:text-slate-50 cursor-pointer transition-colors`}
                  onClick={() => setIsActive("filtered")}
                >
                  filtered
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col w-full p-4">
            {isActive == "filtered" ? (
              <div className="space-y-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="friendName"
                  placeholder="Omar Fouad"
                  className="p-2"
                  errorState
                />

                <div className="flex">
                  <div className="w-1/2 mr-1">
                    <CustomFormField
                      control={form.control}
                      fieldType={FormFieldType.DATE}
                      label="Birth Date"
                      name="olderThan"
                      errorState
                    />
                  </div>
                  <div className="w-1/2">
                    <CustomFormField
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      label="gender"
                      name="gender"
                      placeholder="Select a gender"
                      className="max-h-[250px]"
                      errorState
                    >
                      {genders.map((value, index) => (
                        <SelectItem
                          key={index}
                          value={value}
                          className="cursor-pointer transition-colors dark:hover:bg-slate-200 dark:hover:text-black dark:focus:bg-slate-200"
                        >
                          <div className="flex justify-center items-center">
                            <p className="text-md">{value}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </CustomFormField>
                  </div>
                </div>

                <SubmitButton
                  isLoading={isLoading}
                  className="bg-[var(--sidebar-accent)] dark:bg-slate-50 dark:text-slate-950 w-full text-slate-50 cursor-pointer rounded-md"
                >
                  search by name
                </SubmitButton>
              </div>
            ) : (
              <div className="flex justify-center items-center rounded-md border border-slate-200 bg-slate-100 p-2 my-2">
                <Input
                  placeholder="Omar Fouad"
                  type="text"
                  className="shad-input border-0  dark:text-slate-950"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
        <MainLayout
          users={data}
          isFetching={isFetching}
          error={error}
          isError={isError}
        />
      </form>
    </Form>
  );
};

export default DiscoverQuery;
