"use client";

import { UserWithProfile } from "@/types";
import Image from "next/image";
import React from "react";
import InviteModal from "./invite-modal";
import MembersModal from "./members-modal";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import Loading from "../loading";
import { Button } from "@/app/_components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useSession } from "../session-provider";

const ClubSettings = () => {
  const { id } = useParams();
  const  user= useSession()
  const router = useRouter();
  const { data: club, isLoading } = api.club.singleClub.useQuery({
    id: id as string,
  });

  console.log(club);
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
            <p className="text-center text-xl font-bold ">{club?.name}</p>
            <Image
              src={club?.clubImage as string}
              alt="club profile image"
              width={0}
              height={0}
              sizes="100vw"
              className="h-[100px] w-[100px] rounded-full"
            />
            <p className="text-gray-500">{club?.members.length} members</p>
            <ul className="space-y-4 self-start text-gray-500">
              {user.isMentor ? <InviteModal />: null}
              
              <MembersModal members={club?.members as UserWithProfile[]} />
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default ClubSettings;
