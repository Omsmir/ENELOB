"use client";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import clsx from "clsx";
import BadgeAvatar from "./Avatar";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { open, isMobile } = useSidebar();
  const { data: session } = useSession();
  return (
    <nav className="fixed w-full h-14 bg-[var(--sidebar)] z-30 border-b dark:border-slate-700 ">
      <div
        className={clsx(
          " flex flex-row items-center justify-between h-full py-2 pl-14 transition-all pr-8 overflow-hidden",
          { "pl-14 md:pl-[260px]": open },
          { "pl-8": isMobile }
        )}
      >
        <div className="flex flex-1">
          {isMobile && <SidebarTrigger />}
          <div className="flex flex-col ">
            <h1 className="text-sm font-medium capitalize hidden sm:block mx-4">
              good morning {session?.user.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center">
          <BadgeAvatar
            profileImg={session?.user.image}
            displayName={session?.user.name}
            active
            titleClassName="!text-sm"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
