"use client";

import moment from "moment";
import { useParams } from "next/navigation";
import React from "react";
import NoActivityModal from "./no-club-modal";
import { useQuery } from "@tanstack/react-query";
import { ClubWithPayload } from "@/types";
import Loading from "../loading";
import { getNextWeekday } from "@/lib/utils";

const ClubHome = () => {
  const { id } = useParams();

  // const { data: club } = api.club.singleClub.useQuery({
  //   id: id as string,
  // });
  const { data:club, isLoading } = useQuery<{
    data:ClubWithPayload
  }>({
    queryKey: ["clubHome"],
    queryFn: () => fetch(`/api/clubs/${id}`).then((res) => res.json()),
  });


  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {club?.data.dayActivity === new Date().getDay().toString() ? (
            <>
              <h3>Your club activity will start at {club.data.timeActivity} PM</h3>
              <NoActivityModal timeActivity={club.data.timeActivity} />
            </>
          ) : (
            <>
              <h3>There will be no club activity today</h3>
              <h5>
                Next activity will be on{" "}
                {moment(getNextWeekday(club?.data.dayActivity as string)).format(
                  "LL",
                )}{" "}
                at {club?.data.timeActivity} PM
              </h5>
            </>
          )}
          {/* <SendNotificationBtn /> */}
        </>
      )}
    </div>
  );
};

export default ClubHome;
