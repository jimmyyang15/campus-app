import { UserWithProfile } from "@/types";
import React from "react";
import AvatarProfile from "../avatar-profile";
import { Profile } from "@prisma/client";
import { Button } from "@/app/_components/ui/button";

const MemberItem = ({ member }: { member: UserWithProfile }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        <AvatarProfile profile={member.profile as Profile} />
        <p>{member.profile?.fullName}</p>
      </div>
      <div className="flex items-center gap-x-2">
        <Button className="border-destructive h-8 text-xs" variant={'outline'}>KICK</Button>
        <Button variant={'outline'} className="h-8 text-xs">Appoint is Admin</Button>
      </div>
    </div>
  );
};

export default MemberItem;
