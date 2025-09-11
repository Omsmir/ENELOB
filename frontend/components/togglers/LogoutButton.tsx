"use client";
import { Button } from "../ui/button";
import Swal from "sweetalert2";
import { DashboardHook } from "../context/Dashboardprovider";
import { Mutations } from "@/actions/mutations";
import { useSession } from "../store/slices/AuthReducer";

interface LogoutButtonProps {
  className?: string;
}

const LogoutButton = ({ className }: LogoutButtonProps) => {
  const { setTheme, api } = DashboardHook();
  const { session } = useSession();
  const logout = Mutations.useLogout(api);

  const handelLogOut = async () => {
    try {
      Swal.fire({
        title: "Do you want to logout?",
        showDenyButton: true,
        denyButtonText: "cancel",
        denyButtonColor: "#71717a",
        confirmButtonColor: "#b91c1c",
        confirmButtonText: "logout",
      }).then(async (result) => {
        if (result.isDenied) {
          Swal.fire("Not logged out", "", "info");
        } else if (result.isConfirmed) {
          Swal.fire("Logged out", "", "success");

          await logout.mutateAsync({ id: session._id});

          setTheme("light");
        }
      });
    } catch (error: any) {
      console.error("Delete Error:", error);
      alert("An error occurred while logging you out.");
    }
  };
  return (
    <Button className={className} onClick={handelLogOut}>
      Sign Out
    </Button>
  );
};

export default LogoutButton;
