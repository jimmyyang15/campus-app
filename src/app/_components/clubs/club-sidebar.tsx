"use client";

import { cn } from "@/lib/utils";
import { ClipboardMinus, FileUp, Settings } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { TbCertificate } from "react-icons/tb";
import UploadAssignmentModal from "./upload-assignment-modal";
import { useSession } from "../session-provider";
const ClubSidebar = () => {
  const { id } = useParams();
  const pathname = usePathname();
  const { user } = useSession()
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
      {!user.isMentor ?       <Link
        href={`/club/${id}/assignments`}
        className={cn("flex flex-col items-center gap-y-1 text-gray-500", {
          "text-foreground": pathname.includes("/assignments"),
        })}
      >
        <Settings />
        <p className="text-sm ">Assignments</p>
      </Link>:null}
 

        {user.isMentor ?<UploadAssignmentModal />:null }
      {user.isMentor ?   <Link
        href="/"
        className={cn("flex flex-col items-center gap-y-1 text-gray-500",{
          "text-foreground" : pathname.includes("/submissions")
        })}
      >
        <ClipboardMinus />
        <p className="text-sm ">Submissions</p>
      </Link>:null}
      {user.isMentor ?  <Link
        href="/"
        className={cn("flex flex-col items-center gap-y-1 text-gray-500",{
          "text-foreground" : pathname.includes("/certificate")
        })}
      >
        <TbCertificate size={24} />
        <p className="text-sm ">Certificate</p>
      </Link>:null}
        
        {user.isMentor ?    <Link
        href={`/club/${id}/requests`}
        className={cn("flex flex-col items-center gap-y-1 text-gray-500",{
          "text-foreground" : pathname.includes("/requests")
        })}
      >
        <Settings />
        <p className="text-sm ">Requests</p>
      </Link>:null}
     
   
    </aside>
  );
};

export default ClubSidebar;
