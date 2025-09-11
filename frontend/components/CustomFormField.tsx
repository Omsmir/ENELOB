"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldError } from "react-hook-form";
import { Textarea } from "./ui/textarea";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import { MainLayoutHook } from "./context/LayoutContext";
import { Calendar } from "primereact/calendar";

export enum FormFieldType {
  INPUT = "input",
  PASSWORD = "password",
  TEXTAREA = "textarea",
  SELECT = "select",
  NUMBER = "number",
  SKELETON = "skeleton",
  SEARCH = "search",
  DATE = "datePicker",
  PHONE = "phoneInput",
  COLOR = "colorPicker",
  COUNTRY = "country",
  CHECKBOX = "checkbox",
  OTP = "Otp",
}

interface CustomProps {
  control: Control<any> | undefined;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  icon?: (icon: any) => React.ReactNode;
  iconAlt?: string;
  disabled?: boolean;
  Lucide?: React.ReactNode;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
  min?: number;
  max?: number;
  type?: string;
  error?: any;
  forget?: boolean;
  state?: boolean;
  innerState?: boolean;
  className?: string;
  optionalLabel?: string;
  onChange?: Dispatch<SetStateAction<string>>;
  value?: string;
  showTimeSelect?: boolean;
  timeOnly?: boolean;
  calenderDays?: Date[];
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  const { date, setDate, setDisabled } = MainLayoutHook();
  const ErrorComponent = () => {
    if (props.state) {
      if (props.error) {
        return <CloseCircleFilled className=" text-red-500" size={20} />;
      } else if (field.value) {
        return <CheckCircleFilled className=" text-green-500" size={20} />;
      }
    } else {
      return null;
    }
  };

  const classes = {
    searchSelect: "Country focus:outline-none",
    optionsWrapper: "countryOptionsWrapper",
    option: "hover:bg-slate-500",
  };

  const handleChange = (e: any) => {
    field.onChange(e.value);

    setDate(e.value);

    setDisabled(false);
  };

  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div
          className={cn(
            "flex justify-center items-center rounded-md outline-0 bg-slate-100 dark:text-slate-950 dark:border-[var(--sidebar-accent)] focus:border-0 ",
            props.className
          )}
        >
          {props.Lucide && (
            <span className="ml-2 w-[24px] h-[24px]">{props.Lucide}</span>
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              disabled={props.disabled}
              className="shad-input shadow-0"
            />
          </FormControl>
          <div className="flex justify-center items-center mx-2">
            <ErrorComponent />
          </div>
        </div>
      );
    case FormFieldType.PASSWORD:
      return (
        <div className="flex justify-center items-center rounded-md border border-slate-200 bg-slate-100">
          {props.Lucide && (
            <span className="ml-2 w-[24px] h-[24px]">{props.Lucide}</span>
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              type={props.type}
              disabled={props.disabled}
              className="shad-input border-0"
            />
          </FormControl>
          <div className="flex justify-center items-center mx-2">
            {props.error ? (
              <CloseCircleFilled className=" text-red-500 mx-2" size={20} />
            ) : (
              field.value && (
                <>
                  <CheckCircleFilled
                    className=" text-green-500 mx-2"
                    size={20}
                  />
                  {props.children}
                </>
              )
            )}
          </div>
        </div>
      );
    case FormFieldType.NUMBER:
      return (
        <div className="flex rounded-md border justify-center items-center border-slate-200 bg-slate-100">
          {props.Lucide && (
            <span className="ml-2 w-[24px] h-[24px]">{props.Lucide}</span>
          )}
          <FormControl>
            <input
              type="number"
              placeholder={props.placeholder}
              {...field}
              min={props.min}
              max={props.max}
              disabled={props.disabled}
              className="shad-input flex-1 border-0 px-4 focus:outline-none"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    case FormFieldType.TEXTAREA:
      return (
        <div className="flex">
          <FormControl>
            <Textarea
              placeholder={props.placeholder}
              {...field}
              disabled={props.disabled}
              className="shad-textArea border-0 resize-none focus:shadow-[none] p-4 bg-white dark:bg-slate-800"
            />
          </FormControl>
          <div className="flex justify-center items-center mx-2">
            <ErrorComponent />
          </div>
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <div
          className={`shad-select-custom  ${props.className}`}
        >
          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={props.disabled}
        
            >
              <FormControl>
                <SelectTrigger
                  className={`cursor-pointer dark:text-slate-600 border-0 w-full !shadow-[none] transition-colors`}
                >
                  <SelectValue placeholder={props.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent
                className={cn(" dark:bg-slate-50 dark:text-black max-h-[225px]")}
              >
                {props.children}
              </SelectContent>
            </Select>
          </FormControl>
        </div>
      );
    case FormFieldType.DATE:
      return (
        <div className="shad-select-custom">
          <FormControl>
            <Calendar
              value={field.value || date}
              onChange={(e) => handleChange(e)}
              showIcon
              className={`w-full pl-2 p-calender ${props.className}`}
              placeholder="select a date"
              variant="filled"
              dateFormat="mm/dd/yy"
              showTime={props.showTimeSelect || undefined}
              timeOnly={props.timeOnly || undefined}
              hourFormat="12"
              enabledDates={props.calenderDays}
              stepMinute={30}
              disabled={props.disabled}
              touchUI
            />
          </FormControl>
        </div>
      );
    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <div className="flex justify-between">
            {props.label && (
              <FormLabel className="shad-input-label dark:text-slate-50">
                <div className="flex items-center">
                  <h1 className="mr-1 capitalize">{props.label}</h1>
                  <p className="text-[12px] text-slate-600">
                    {props.optionalLabel}
                  </p>
                </div>
              </FormLabel>
            )}
            {props.forget && (
              <Link href={`/reset`}>
                <p className="text-sm text-sky-700 hover:underline">
                  Forget Password
                </p>
              </Link>
            )}
          </div>
          <RenderField field={field} props={props} />

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
