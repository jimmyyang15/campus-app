"use client";

import React from "react";
import {  usePathname } from "next/navigation";
import { User } from "lucia";
import ProtectedRoute from "./protected-route";
import { authRoutes } from "@/server/authRoutes";

interface Props {
  children: React.ReactNode;
  user: User | null;
}



const AuthWrapper = ({ children, user }: Props) => {
  const pathname = usePathname();
  console.log("fdsfsdfds", pathname);



  return (
    <>
      {!authRoutes.includes(pathname) ? (
        <ProtectedRoute user={user}>{children}</ProtectedRoute>
      ) : (
        children
      )}
    </>
  );
};

export default AuthWrapper;
