"use client";

import React from "react";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";

const SendNotificationBtn = () => {
  const { id } = useParams();

  const handleNotify = async () => {
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
  return <Button onClick={handleNotify}>Notify mentor</Button>;
};

export default SendNotificationBtn;
