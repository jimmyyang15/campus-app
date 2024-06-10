"use client";

import { cn } from "@/lib/utils";
import {  Settings } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { TbCertificate } from "react-icons/tb";
import UploadAssignmentModal from "./upload-assignment-modal";
import { useSession } from "../session-provider";
import { MdAssignment, MdOutlineHome } from "react-icons/md";
import { useMediaQuery } from "@/hooks/use-media-query";
import { TbUserQuestion } from "react-icons/tb";
const ClubSidebar = () => {
  const { id } = useParams();
  const pathname = usePathname();
  const user  = useSession();
  const mobile = useMediaQuery("(max-width: 640px)");
  return (
    <aside className="h-screen  flex-[.10] space-y-8 p-2 sm:p-4 ">
      <Link
        href={`/club/${id}`}
        className={cn("flex flex-col items-center gap-y-1 text-gray-500", {
          "text-foreground": pathname.includes(`/club/${id}`),
        })}
      >
              <MdOutlineHome size={mobile ? 21 : 23} />

        <p className="hidden text-xs font-semibold sm:block">Home</p>
      </Link>

      <Link
        href={`/club/${id}/settings`}
        className={cn("flex flex-col items-center gap-y-1 text-gray-500", {
          "text-foreground": pathname.includes("/settings"),
        })}
      >
        <Settings size={mobile ? 18 : 20} />
        <p className="hidden text-xs font-semibold sm:block">Settings</p>
      </Link>
      {user.isMentor ? <UploadAssignmentModal /> : null}

      <Link
        href={`/club/${id}/assignments`}
        className={cn("flex flex-col items-center gap-y-1 text-gray-500", {
          "text-foreground": pathname.includes("/assignments"),
        })}
      >
        <MdAssignment size={mobile ? 18 : 20} />
        <p className="hidden text-xs font-semibold sm:block">Assignments</p>
      </Link>

      {/* {user.isMentor ?   <Link
        href="/"
        className={cn("flex flex-col items-center gap-y-1 text-gray-500",{
          "text-foreground" : pathname.includes("/submissions")
        })}
      >
        <ClipboardMinus />
        <p className="text-sm ">Submissions</p>
      </Link>:null} */}
      {user.isMentor ? (
        <Link
          href={`/club/${id}/certificate`}
          className={cn("flex flex-col items-center gap-y-1 text-gray-500", {
            "text-foreground": pathname.includes("/certificate"),
          })}
        >
          <TbCertificate size={mobile ? 18 : 20} />
          <p className="hidden text-xs font-semibold sm:block">Certificate</p>
        </Link>
      ) : null}

      {user.isMentor ? (
        <Link
          href={`/club/${id}/requests`}
          className={cn("flex flex-col items-center gap-y-1 text-gray-500", {
            "text-foreground": pathname.includes("/requests"),
          })}
        >
          <TbUserQuestion size={mobile ? 21 : 23} />
          <p className="hidden text-xs font-semibold sm:block">Requests</p>
        </Link>
      ) : null}
    </aside>
  );
};

export default ClubSidebar;
