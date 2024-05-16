import ClubSettings from "@/app/_components/clubs/club-settings";

import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";

import React from "react";

const SettingsClubPage = async ({
  params,
}: {
  params: { id:string };
}) => {


  return (
    <main>
      <ClubSettings />
    </main>
  );
};

export default SettingsClubPage;
