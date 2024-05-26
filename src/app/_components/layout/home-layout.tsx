"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Sidebar } from "@/app/_components/layout/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { authRoutes } from "@/server/authRoutes";
import { usePathname } from "next/navigation";

export default function AdminPanelLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const pathname = usePathname()

  if (!sidebar ) return null;

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72",
          !authRoutes.includes(pathname)?"min-h-[calc(100vh_-_56px)]  transition-[margin-left] ease-in-out duration-300":""
        )}
      >
        {children}
      </main>

    </>
  );
}