"use client";


import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Menu } from "@/app/_components/ui/menu";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { SidebarToggle } from "./sidebar-toggle";
import { usePathname } from "next/navigation";
import { authRoutes } from "@/server/authRoutes";

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const pathname = usePathname();


  if (!sidebar || authRoutes.includes(pathname)) return null;

  return (
    <aside
      className={cn(
        "fixed border-r left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0",
        sidebar?.isOpen === false ? "w-[90px]" : "w-72",
      )}
    >
      <div className="relative flex h-full flex-col px-3 py-4  items-center shadow-md dark:shadow-zinc-800">
        <SidebarToggle
          isOpen={sidebar?.isOpen}
          setIsOpen={sidebar?.setIsOpen}
        />

        {/* <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <PanelsTopLeft className="w-6 h-6 mr-1" />
            <h1
              className={cn(
                "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
                sidebar?.isOpen === false
                  ? "-translate-x-96 opacity-0 hidden"
                  : "translate-x-0 opacity-100"
              )}
            >
              Brand
            </h1>
          </Link>
        </Button> */}
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  );
}
