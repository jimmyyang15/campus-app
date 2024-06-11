"use client";

import React from "react";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { useSession } from "../session-provider";

const SendNotificationBtn = () => {
  const { id } = useParams();
  const user = useSession()
  const handleNotifyMentor = async () => {
    const response = await fetch("/api/notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clubId: id,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send notification");
    }
  };

  const handleNotifyMembers = async() => {
    const response = await fetch("/api/members-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clubId: id,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send notification");
    }
  }
  return <Button onClick={user.isMentor ? handleNotifyMembers : handleNotifyMentor}>
    {user.isMentor ? "Notify members" : "Notify mentor"}
  </Button>;
};

export default SendNotificationBtn;
