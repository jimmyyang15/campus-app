"use client";

import React from "react";
import ClubItem from "./club-item";
import { api } from "@/trpc/react";
import CreateModal from "./create-modal";
import Loading from "../loading";
import { useSession } from "../session-provider";
import { ClubWithPayload } from "@/types";

const ClubList = () => {
  const { data: clubs, isLoading } = api.club.getClubs.useQuery();
  const user = useSession();
  return (
    <>
      {!user.isMentor && user.role === "USER" && !user.club ? (
        <p className="mb-4 text-center text-xl font-semibold">
          Seems like you're not in a club yet. Try finding one!
        </p>
      ) : null}

      {!user.club ? (
        <>
          {clubs && !isLoading ? (
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {clubs?.map((club, i) => (
                <ClubItem key={i} club={club as ClubWithPayload} />
              ))}
              {user.role === "ADMIN" ? <CreateModal /> : null}
            </div>
          ) : (
            <Loading />
          )}
        </>
      ) : (
        <>
          <div className="mb-4  gap-4">
            <ClubItem club={user.club as ClubWithPayload} />

            {user.role === "ADMIN" ? <CreateModal /> : null}
          </div>
        </>
      )}
    </>
  );
};

export default ClubList;
