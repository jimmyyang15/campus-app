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
      {!member.isMentor ? (
        <div className="flex items-center gap-x-2">
          <Button
            className="h-8 border-destructive text-xs"
            variant={"outline"}
          >
            KICK
          </Button>
          <Button variant={"outline"} className="h-8 text-xs">
            Appoint as Admin
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default MemberItem;
