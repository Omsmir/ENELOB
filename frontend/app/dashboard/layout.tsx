import Dashboard from "@/components/Dashboard";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  DashboardHook,
} from "@/components/context/Dashboardprovider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <Navbar />
      <Dashboard>
        {children}
      </Dashboard>
    </SidebarProvider>
  );
}
