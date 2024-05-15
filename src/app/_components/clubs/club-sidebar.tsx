"use client";

import { cn } from "@/lib/utils";
import { ClipboardMinus, FileUp, Settings } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { TbCertificate } from "react-icons/tb";
const ClubSidebar = () => {
  const { id } = useParams();
  const pathname = usePathname();
  return (
    <aside className="h-screen  flex-[.10] space-y-8 p-4">
      <Link
        href={`/club/${id}/settings`}
        className={cn("flex flex-col items-center gap-y-1 text-gray-500", {
          "text-foreground": pathname.includes("/settings"),
        })}
      >
        <Settings />
        <p className="text-sm ">Settings</p>
      </Link>
      <Link
        href="/"
        className={cn("flex flex-col items-center gap-y-1 text-gray-500", {
          "text-foreground": pathname.includes("/upload"),
        })}
      >
        <FileUp />
        <p className="text-center text-sm">Upload Assignment</p>
      </Link>
      <Link
        href="/"
        className={cn("flex flex-col items-center gap-y-1 text-gray-500",{
          "text-foreground" : pathname.includes("/submissions")
        })}
      >
        <ClipboardMinus />
        <p className="text-sm ">Submissions</p>
      </Link>
      <Link
        href="/"
        className={cn("flex flex-col items-center gap-y-1 text-gray-500",{
          "text-foreground" : pathname.includes("/certificate")
        })}
      >
        <TbCertificate size={24} />
        <p className="text-sm ">Certificate</p>
      </Link>
      <Link
        href={`/club/${id}/requests`}
        className={cn("flex flex-col items-center gap-y-1 text-gray-500",{
          "text-foreground" : pathname.includes("/requests")
        })}
      >
        <Settings />
        <p className="text-sm ">Requests</p>
      </Link>
    </aside>
  );
};

export default ClubSidebar;
