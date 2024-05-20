import { UserWithProfile } from "@/types";
import React from "react";
import AvatarProfile from "../avatar-profile";
import { Profile } from "@prisma/client";
import { Button } from "@/app/_components/ui/button";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import moment from "moment";
import { utils } from "prettier/doc.js";
import { useSession } from "../session-provider";

const MemberItem = ({ member }: { member: UserWithProfile }) => {
  const utils = api.useUtils();
  const { id } = useParams();
  const { user } = useSession();

  const { mutateAsync: kickMember, isLoading } =
    api.club.kickMember.useMutation({
      onSuccess: () => {
        toast.success("Club created ", {
          description: moment().format("LLLL"),
          // action: {
          //   label: "Dismiss",
          //   onClick: () => toast.dismiss(),
          // },
          closeButton: true,
        });
      },
      onSettled: () => {
        utils.club.singleClub.invalidate({
          id: id as string,
        });
      },
    });
  const handleKick = async () => {
    await kickMember({
      clubId: id as string,
      memberId: member.id,
    });
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        <AvatarProfile profile={member.profile as Profile} />
        <p>{member.profile?.fullName}</p>
      </div>
      {user.isMentor ? (
        <>
          {!member.isMentor ? (
            <div className="flex items-center gap-x-2">
              <Button
                className="h-8 border-destructive text-xs"
                variant={"outline"}
                onClick={handleKick}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Kick"}
              </Button>
              <Button variant={"outline"} className="h-8 text-xs">
                Appoint as Admin
              </Button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default MemberItem;
