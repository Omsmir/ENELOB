"use client";

import AppSidebar from "@/components/AppSidebar";

const Dashboard = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="relative w-full">
        {children}
      </main>
    </div>
  );
};

export default Dashboard;
