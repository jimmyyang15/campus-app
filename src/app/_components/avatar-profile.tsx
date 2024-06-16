import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Profile } from "@prisma/client";

const AvatarProfile = ({ profile }: { profile: Profile }) => {

  return (
    <Avatar>
      <AvatarImage
        alt="@shadcn"
        src={
          profile?.profilePicture
            ? profile?.profilePicture
            : `https://ui-avatars.com/api/?background=random&name=${profile?.fullName}`
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
