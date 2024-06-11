"use client";

import { api } from "@/trpc/react";
import moment from "moment";
import { useParams } from "next/navigation";
import React from "react";
import SendNotificationBtn from "./send-notification";
import NoActivityModal from "./no-club-modal";

const ClubHome = () => {
  const { id } = useParams();
  
  const { data: club } = api.club.singleClub.useQuery({
    id: id as string,
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
  
  console.log(getNextWeekday(club?.dayActivity as string).toString());
  return (
    <div>
      {club?.dayActivity === new Date().getDay().toString() ? (
        <>
          <h3>Your club activity will start at {club.timeActivity} PM</h3>
          <NoActivityModal timeActivity={club.timeActivity} />
        </>
      ) : (
        <>
          <h3>There will be no club activity today</h3>
          <h5>
            Next activity will be on{" "}
            {moment(getNextWeekday(club?.dayActivity as string)).format("LL")}{" "}
            at {club?.timeActivity} PM
          </h5>
        </>
      )}
      {/* <SendNotificationBtn /> */}
    </div>
  );
};

export default ClubHome;
