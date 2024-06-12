"use client";

import { ClubWithPayload, UserWithProfile } from "@/types";
import React from "react";
import InviteModal from "./invite-modal";
import MembersModal from "./members-modal";
import { useParams, useRouter } from "next/navigation";
import Loading from "../loading";
import { Button } from "@/app/_components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useSession } from "../session-provider";
import { useQuery } from "@tanstack/react-query";

const ClubSettings = () => {
  const { id } = useParams();
  const  user= useSession()
  const router = useRouter();
  const { data:club, isLoading } = useQuery<{
    data:ClubWithPayload
  }>({
    queryKey: ["clubSettings"],
    queryFn: () => fetch(`/api/clubs/${id}`).then((res) => res.json()),
  });

  console.log(club)

  return (
    <>
      <Button variant="ghost" onClick={() => router.back()}>
        <ChevronLeft size={18} className="mr-2" />
        Back
      </Button>
      <div className="flex flex-col items-center gap-y-2">
        {isLoading && club ? (
          <Loading />
        ) : (
          <>
            <p className="text-center text-xl font-bold ">{club?.data.name}</p>
            <img
              src={club?.data.clubImage as string}
              alt="club profile image"
          
              className="h-[100px] w-[100px] rounded-full"
            />
            <p className="text-gray-500">{club?.data.members.length} members</p>
            <ul className="space-y-4 self-start text-gray-500">
              {user.isMentor ? <InviteModal />: null}
              
              <MembersModal members={club?.data.members as UserWithProfile[]} />
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default ClubSettings;
