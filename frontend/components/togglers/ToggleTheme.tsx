"use client";
import { Moon, Sun } from "lucide-react";
import { MainLayoutHook } from "../context/LayoutContext";
import { Button } from "../ui/button";

const ThemeToggle = () => {
  const { theme, setTheme } = MainLayoutHook();

  const handleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      onClick={handleTheme}
      className=" w-full cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-900 dark:bg-slate-800 bg-slate-100 dark:text-slate-50 text-black transition-colors"
    >
      {theme === "dark" ? (
        <div className="flex items-center">
          <h2 className="mr-1 font-medium">Light</h2>
          <Sun />
        </div>
      ) : (
        <div className="flex items-center">
          <h2 className="mr-1 font-medium ">Dark</h2>
          <Moon />
        </div>
      )}
    </Button>
  );
};

export default ThemeToggle;
