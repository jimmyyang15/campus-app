"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar";
import { authRoutes } from "@/server/authRoutes";
import { User } from "lucia";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {
  user: User | null;
}
const Navbar = ({ user }: Props) => {
  const pathname = usePathname();

  if (authRoutes.includes(pathname)) {
    return null;
  }

  return (
    <nav className="container sticky top-0 z-40 flex items-center border-b bg-white/30 backdrop-blur-sm">
      <Link href="/">
        <Image
          src="/assets/logo.png"
          alt="logo"
          width={80}
          height={80}
          objectFit="cover"
        />
      </Link>
      <ul className="flex items-center gap-x-6 font-semibold text-foreground">
        <li className="link">
          <Link href="/">Home</Link>
        </li>
        <li className="link">
          <Link href="/">Your Club</Link>
        </li>
        <li className="link">
          <Link href="/">Invitations</Link>
        </li>
        <li className="link">
          <Link href="/">Rewards</Link>
        </li>
      </ul>
      <div className="flex items-center gap-x-4 ml-auto">
        <Avatar>
          <AvatarImage alt="@shadcn" />
          <AvatarFallback>
            <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200"></div>
          </AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
};

export default Navbar;
