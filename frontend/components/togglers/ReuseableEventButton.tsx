"use client";
import { Button } from "../ui/button";
import Swal from "sweetalert2";
import { DashboardHook } from "../context/Dashboardprovider";
import { Mutations } from "@/actions/mutations";
import { useSession } from "../store/slices/AuthReducer";

interface ReuseableEventButtonProps {
  className?: string;
  title: string;
  fire_description: {
    title: string;
    denied: string;
    confirmed: string;
    confirmTitle: string;
  };
  clickHandler: () => Promise<void>;
}

const ReuseableEventButton = ({
  className,
  fire_description,
  title,
  clickHandler,
}: ReuseableEventButtonProps) => {
  const { setTheme, api } = DashboardHook();
  const logout = Mutations.useLogout(api);

  const handleEvent = async () => {
    try {
      Swal.fire({
        title: fire_description.title,
        showDenyButton: true,
        denyButtonText: "cancel",
        denyButtonColor: "#71717a",
        confirmButtonColor: "#b91c1c",
        confirmButtonText: fire_description.confirmTitle,
      }).then(async (result) => {
        if (result.isDenied) {
          Swal.fire(fire_description.denied, "", "info");
        } else if (result.isConfirmed) {
          Swal.fire(fire_description.confirmed, "", "success");

          await clickHandler();

          setTheme("light");
        }
      });
    } catch (error: any) {
      console.error("Delete Error:", error);
      alert("An error occurred while executing the event");
    }
  };
  return (
    <Button className={className} onClick={handleEvent}>
      {title}
    </Button>
  );
};

export default ReuseableEventButton;
