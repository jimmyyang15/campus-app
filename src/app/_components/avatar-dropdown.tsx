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
const AvatarDropdown = ({ name }: { name: string }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage alt="@shadcn" />
          <AvatarFallback>
            <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200"></div>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="truncate text-center">
          {name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User size={16} />
          <DropdownMenuItem>Profile</DropdownMenuItem>
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
