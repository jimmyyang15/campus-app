import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { signOut } from "../_actions/signout";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { Profile } from "@prisma/client";


const AvatarDropdown = ({ profile }: { profile: Profile }) => {

  const { fullName,profilePicture } = profile;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage alt="@shadcn" src={profilePicture ? profilePicture : `https://ui-avatars.com/api/?background=random&name=${profile.fullName}`} className="object-cover" />
          <AvatarFallback>
            <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200"></div>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="truncate text-center">
          {fullName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-x-2">
          <User size={16} />
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem >
          <form action={signOut} className="flex items-center gap-x-2">
          <LogOut size={16} />

            <button>
                Sign Out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarDropdown;
