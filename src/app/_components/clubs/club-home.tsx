"use client";

import { api } from "@/trpc/react";
import moment from "moment";
import { useParams } from "next/navigation";
import React from "react";
import SendNotificationBtn from "./send-notification";
import NoActivityModal from "./no-club-modal";
import { useQuery } from "@tanstack/react-query";
import { ClubWithPayload } from "@/types";
import Loading from "../loading";

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
  function getNextWeekday(weekday: string) {
    const date = new Date();
    const resultDate = new Date(date.getTime());

    // Get the current day of the week (0-6)
    const currentDay = date.getDay();

    // Calculate how many days to add to get to the desired weekday
    const daysToAdd = (Number(weekday) + 7 - currentDay) % 7 || 7;
    console.log(daysToAdd);
    // Add the days to the current date
    resultDate.setDate(date.getDate() + daysToAdd);

    return resultDate;
  }

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
