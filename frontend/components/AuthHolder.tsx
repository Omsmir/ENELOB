"use client";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
interface AuthCheckProps {
  children: React.ReactNode;
  session?: Session | null;
}

const AuthHolder: React.FC<AuthCheckProps> = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default AuthHolder;
