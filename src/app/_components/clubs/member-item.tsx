import { UserWithProfile } from "@/types";
import React from "react";
import AvatarProfile from "../avatar-profile";
import { Profile } from "@prisma/client";
import { Button } from "@/app/_components/ui/button";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import moment from "moment";
import { useSession } from "../session-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const MemberItem = ({ member }: { member: UserWithProfile }) => {
  const queryClient = useQueryClient()
  const { id } = useParams();
  const user  = useSession();

  const { mutateAsync: kickMember, isLoading } =
    useMutation({
      mutationFn:(payload:{
        memberId:string
      })=>axios.post(`/api/clubs/${id}/members`,payload),
      onSuccess: () => {
        toast.success("Member Kicked", {
          description: moment().format("LLLL"),
          // action: {
          //   label: "Dismiss",
          //   onClick: () => toast.dismiss(),
          // },
          closeButton: true,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries(['clubSettings'])
      },
    });
  const handleKick = async () => {
    
    await kickMember({
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
   
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default MemberItem;
