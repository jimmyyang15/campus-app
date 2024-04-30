import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Profile } from "@prisma/client";

const AvatarProfile = ({ profile }: { profile: Profile }) => {
  const { fullName, profilePicture } = profile;

  return (
    <Avatar>
      <AvatarImage
        alt="@shadcn"
        src={
          profilePicture
            ? profilePicture
            : `https://ui-avatars.com/api/?background=random&name=${fullName}`
        }
        className="object-cover"
      />
      <AvatarFallback>
        <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200"></div>
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarProfile;
