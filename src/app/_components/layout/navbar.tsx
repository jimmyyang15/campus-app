"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { authRoutes } from "@/server/authRoutes";
import { User } from "lucia";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { ModeToggle } from "@/app/_components/mode-toggle";
import AvatarDropdown from "../avatar-dropdown";
import { api } from "@/trpc/react";
import { Profile } from "@prisma/client";
import { cn } from "@/lib/utils";

interface Props {
  user: User | null;
}
const Navbar = ({ user }: Props) => {
  const pathname = usePathname();

  if (authRoutes.includes(pathname)) {
    return null;
  }

  return (
    <nav className="container sticky top-0 z-40 flex items-center gap-x-4 border-b bg-white/30 backdrop-blur-sm dark:bg-transparent">
      <Link href="/">
        <Image
          className="object-cover"
          src="/assets/logo.png"
          alt="logo"
          width={80}
          height={80}
        />
      </Link>
      <ul className="flex items-center gap-x-6 font-semibold ">
        <li className={cn('link',{
          "text-foreground" : pathname==="/"
        })}>
          <Link href="/">Home</Link>
        </li>
        {user?.role === "ADMIN" ? (
          <li className={cn('link',{
            "text-foreground" : pathname==="/clubs"
          })}>
            <Link href="/clubs">Clubs</Link>
          </li>
        ) : (
          <li className={cn('link',{
            "text-foreground" : pathname==="/clubs"
          })}>
            <Link href="/clubs">Your Clubs</Link>
          </li>
        )}
        {user?.role === "USER" ? (
          <>
            {!user.isMentor ? (
              <li className={cn('link',{
                "text-foreground" : pathname==="/invitations"
              })}>
                <Link href="/invitations">Invitations</Link>
              </li>
            ) : null}

            {/* <li className="link">
              <Link href="/">Rewards</Link>
            </li> */}
          </>
        ) : null}
      </ul>
      <div className="ml-auto flex items-center gap-x-4">
        <ModeToggle />
        <AvatarDropdown profile={user?.profile as Profile} />
      </div>
    </nav>
  );
};

export default Navbar;
