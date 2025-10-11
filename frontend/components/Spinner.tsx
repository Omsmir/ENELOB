import { cn } from "@/lib/utils";
import { Spin } from "antd";
import React from "react";

interface SpinnerProps {
  text?: string;
  className: string;
  size?: "small" | "large" | "default";
}
const Spinner: React.FC<SpinnerProps> = ({ text, className, size }) => {
  return (
    <div
      className={cn("flex justify-center items-center h-screen ", className)}
    >
      <div className="flex justify-center items-center">
        {text && <p className="text-sm font-medium mx-2 capitalize">{text}</p>}

        <Spin size={size ?? "large"} />
      </div>
    </div>
  );
};

interface ReusableSpinnerProps {
  isLoading: boolean;
  isFetching?: boolean;
  text?: string;
  className: string;
  size?: "small" | "large" | "default";
}

export const ReusableSpinner = ({
  isLoading,
  isFetching,
  text,
  className,
  size,
}: ReusableSpinnerProps) => {
  return isLoading && <Spinner className={className} text={text} size={size} />;
};

export default Spinner;
