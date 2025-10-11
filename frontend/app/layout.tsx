import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "../components/QueryProvider";
import { MainLayoutProvider } from "../components/context/LayoutContext";
import { poppins } from "../fonts/font";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DashboardProvider } from "@/components/context/Dashboardprovider";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import ReduxProvider from "@/components/store/reduxProvider";
import NotificationContext from "@/components/NotificationContext";

export const metadata: Metadata = {
  title: "Enelob - Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className}`}>
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <PrimeReactProvider>
              <QueryProvider>
                <DashboardProvider>
                  <NotificationContext>
                    <MainLayoutProvider>{children}</MainLayoutProvider>
                  </NotificationContext>
                </DashboardProvider>
              </QueryProvider>
            </PrimeReactProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
