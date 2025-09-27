"use client";
import { useState, useEffect } from "react";

export function useDebounce<T>(
  value: T,
  delay: number = 500
): { friendName: T } {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler); // cleanup on value change
    };
  }, [value, delay]);

  const data = {
    friendName: debouncedValue,
  };
  return data;
}
