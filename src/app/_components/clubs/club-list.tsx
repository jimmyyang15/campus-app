"use client";

import { Club } from "@prisma/client";
import React from "react";
import ClubItem from "./club-item";
import { api } from "@/trpc/react";
import CreateModal from "./create-modal";
import Loading from "../loading";
import { useSession } from "../session-provider";
import { ClubWithInclude } from "@/types";

const ClubList = () => {
  const { data: clubs } = api.club.getClubs.useQuery();
  const { user } = useSession();
  console.log(clubs);
  return (
    <>
      {!user.isMentor && user.role === "USER" && user.clubs.length === 0 ? (
        <p className="mb-4 text-center text-xl font-semibold">
          Seems like you're not in a club yet. Try finding one!
        </p>
      ) : null}

      {user.clubs.length === 0 ? (
        <>
          {clubs ? (
            <div className="mb-4 grid grid-cols-2 gap-4">
              {clubs?.map((club, i) => (
                <ClubItem key={i} club={club as ClubWithInclude} />
              ))}
              {user.role === "ADMIN" ? <CreateModal /> : null}
            </div>
          ) : (
            <Loading />
          )}
        </>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-2 gap-4">
            {user.isMentor ? (
              <>
                {user?.clubs?.map((club, i) => (
                  <ClubItem key={i} club={club as ClubWithInclude} />
                ))}
              </>
            ) : null}

            {user.role === "ADMIN" ? <CreateModal /> : null}
          </div>
        </>
      )}
    </>
  );
};

export default ClubList;
