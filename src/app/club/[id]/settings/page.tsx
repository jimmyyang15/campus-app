"use client"

import ClubSettings from "@/app/_components/clubs/club-settings";
import Loading from "@/app/_components/loading";
import { Button } from "@/app/_components/ui/button";
import { api } from "@/trpc/react";
import { ClubWithPayload } from "@/types";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const SettingsClubPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data:club,isLoading } = api.club.singleClub.useQuery({
    id:id as string
  })

  return (
    <main>
      <Button variant="ghost" onClick={() => router.back()}>
        <ChevronLeft size={18} className="mr-2" />
        Back
      </Button>
      {isLoading ? <Loading />:  <ClubSettings club={club as ClubWithPayload} />}
      
    </main>
  );
};

export default SettingsClubPage;
