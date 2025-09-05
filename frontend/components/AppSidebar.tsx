"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Dialog, DialogTitle, DialogDescription } from "./ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import clsx from "clsx";
import { SideBarItems } from "@/lib/constants";
import { NavMain } from "./NavMenu";
import SideBarFooter from "./sidebar/SideBarFooter";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import { inter } from "@/fonts/font";

const AppSidebar = () => {
  const { open, setOpen, isMobile } = useSidebar();

  return (
    <Dialog>
      <Sidebar
        className="border-r dark:border-slate-700 h-screen z-30"
        collapsible="icon"
      >
        <SidebarHeader
          onClick={() => setOpen(!open)}
          className="flex  justify-center items-center h-14 px-4 border-b dark:border-slate-700 p-0 min-w-[25px] "
        >
          <span className={`flex justify-start items-center cursor-pointer `}>
            <h1 className={`text-2xl font-extrabold uppercase  text-[var(--sidebar-accent)] dark:text-slate-50 ${inter.className}`}>
              E
            </h1>
            <h1
              className={clsx(
                `text-2xl font-extrabold uppercase text-[var(--sidebar-accent)] dark:text-slate-50  ${inter.className}`,
                {
                  hidden: !open && !isMobile,
                }
              )}
            >
              nelob 
            </h1>
          </span>
        </SidebarHeader>
        <SidebarContent className="flex-1">
          <OverlayScrollbarsComponent>
            <SidebarGroup className="flex-1 p-0  overflow-x-hidden">
              <SidebarGroupContent
                className={clsx("flex-1 w-full pt-10 ", {
                  "pt-0": open && !isMobile,
                })}
              >
                <VisuallyHidden>
                  <DialogTitle>sidebar</DialogTitle>r
                  <DialogDescription>Here Is A Description</DialogDescription>
                </VisuallyHidden>
                <NavMain items={SideBarItems} />
              </SidebarGroupContent>
            </SidebarGroup>
          </OverlayScrollbarsComponent>
        </SidebarContent>
        <SideBarFooter />
      </Sidebar>
    </Dialog>
  );
};

export default AppSidebar;
