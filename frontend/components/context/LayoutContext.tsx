"use client";
import { useTheme } from "next-themes";
import {
  createContext,
  Dispatch,
  RefObject,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";

interface LayoutContextProps {
  setTheme: Dispatch<SetStateAction<string>>;
  theme: string | undefined;
  setDate: Dispatch<SetStateAction<Date>>;
  setDisabled: Dispatch<SetStateAction<boolean>>;
  disabled: boolean;
  date: Date;
}

const LayoutContext = createContext<LayoutContextProps | null>(null);

export const MainLayoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { theme, setTheme } = useTheme();
  const [date, setDate] = useState<Date>(new Date());
  const [disabled, setDisabled] = useState<boolean>(true);
  return (
    <LayoutContext.Provider
      value={{ theme, setTheme, disabled, setDate, date, setDisabled }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const MainLayoutHook = () => {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error(
      "MainLayout Hook Can't be used outside mainLayout provider"
    );
  }
  return context;
};
