import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";

import { signOut } from "../_actions/signout";
import { CircleUser, LogOut } from "lucide-react";
import Link from "next/link";
import { Profile } from "@prisma/client";
import AvatarProfile from "./avatar-profile";

const AvatarDropdown = ({ profile }: { profile: Profile }) => {
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <AvatarProfile profile={profile} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="truncate text-center">
          {profile?.fullName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-x-2">
          <CircleUser size={16} />
          <Link href="/account/profile">Account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <form action={signOut} className="flex items-center gap-x-2">
            <LogOut size={16} />

            <button>Sign Out</button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarDropdown;
