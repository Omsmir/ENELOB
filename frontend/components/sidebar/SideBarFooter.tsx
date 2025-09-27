"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronUp, User } from "lucide-react";
import ThemeToggle from "../togglers/ToggleTheme";
import { useSession } from "../store/slices/AuthReducer";
import { Mutations } from "@/actions/mutations";
import { DashboardHook } from "../context/Dashboardprovider";
import ReuseableEventButton from "../togglers/ReuseableEventButton";

const SideBarFooter = () => {
  const { session } = useSession();
  const { api } = DashboardHook();
  const logout = Mutations.useLogout(api);

  const clickHandler = async () => {
    await logout.mutateAsync({ id: session._id });
  };
  const fire_description = {
    title: "Do you want to log out?",
    confirmed: "Logged out",
    denied: "Not logged out",
    confirmTitle: "Log out",
  };
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="font-medium lowercase whitespace-nowrap transition-colors cursor-pointer hover:bg-slate-100 hover:text-dark-300 hover:dark:hover:bg-[var(--sidebar-accent)] hover:dark:text-slate-50 ">
                <User /> {session.full_name}
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width] sm:w-[220px] bg-slate-100 dark:bg-[var(--sidebar-accent)] dark:border-[var(--sidebar-accent)]"
            >
              <DropdownMenuItem className=" p-0 ">
                <ThemeToggle />
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer hover:bg-slate-200 p-0 dark:hover:bg-[var(--sidebar-background)]">
                <ReuseableEventButton
                  fire_description={fire_description}
                  clickHandler={clickHandler}
                  title="log out"
                  className="cursor-pointer w-full bg-transparent text-black dark:text-slate-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-900 transition-colors"
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default SideBarFooter;
