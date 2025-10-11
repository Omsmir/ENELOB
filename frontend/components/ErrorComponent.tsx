import React from "react";

interface ErrorComponentProps {
  isError: boolean;
  error: Error | null
  className?: string;
}

const ErrorComponent = ({ isError, error, className }: ErrorComponentProps) => {
  return (
    isError && error && (
      <div className={` ${className}`}>
        <div className="flex justify-center items-center p-4">
          <p className="font-medium capitalize">{error.message}</p>
        </div>
      </div>
    )
  );
};

export default ErrorComponent;
