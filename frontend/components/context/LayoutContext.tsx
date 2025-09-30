"use client";
import { AccountSchema } from "@/lib/vaildation";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForm } from "react-hook-form";
import { useSession } from "../store/slices/AuthReducer";
import z from "zod";

interface LayoutContextProps {
  setTheme: Dispatch<SetStateAction<string>>;
  theme: string | undefined;
  setDate: Dispatch<SetStateAction<Date>>;
  setDisabled: Dispatch<SetStateAction<boolean>>;
  disabled: boolean;
  date: Date;
  editState: boolean;
  setEditState: Dispatch<SetStateAction<boolean>>;
  form: any;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setPreviewCover: Dispatch<SetStateAction<string | undefined>>;
  previewCover: string | undefined;
  setFilesLength: Dispatch<SetStateAction<number>>;
  fileLength: number;
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
  const [editState, setEditState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useSession();

  const [previewCover, setPreviewCover] = useState<string | undefined>(
    undefined
  );
  const [fileLength, setFilesLength] = useState<number>(0);

  const form = useForm<z.infer<typeof AccountSchema>>({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      full_name: session.full_name as string,
    },
  });
  return (
    <LayoutContext.Provider
      value={{
        theme,
        setTheme,
        disabled,
        setDate,
        date,
        setDisabled,
        editState,
        setEditState,
        form,
        isLoading,
        setIsLoading,
        setPreviewCover,
        previewCover,
        fileLength,
        setFilesLength
      }}
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
