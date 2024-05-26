import React, { useEffect, useState } from "react";
import { Toggle } from "@/app/_components/ui/toggle";
import { IoMdNotifications, IoMdNotificationsOff } from "react-icons/io";
import {
  getCurrentPushSubscription,
  registerPushNotifications,
  unregisterPushNotifications,
} from "@/lib/pushService";
const PushSubscriptionToggle = () => {
  const [hasActivePushSubscription, setHasActivePushSubscription] =
    useState<boolean>();
  useEffect(() => {
    async function getActivePushSubscription() {
      const subscription = await getCurrentPushSubscription();
      setHasActivePushSubscription(!!subscription);
    }

    getActivePushSubscription();
  }, []);

  async function setPushNotificationsEnabled(enabled: boolean) {
    try {
      if (enabled) {
        await registerPushNotifications();
      } else {
        await unregisterPushNotifications();
      }
      setHasActivePushSubscription(enabled);
    } catch (error) {
      console.error(error);
      if (enabled && Notification.permission === "denied") {
        alert("Please enable push notifications in your browser settings");
      } else {
        alert("Something went wrong. Please try again!");
      }
    }
  }
  if(hasActivePushSubscription === undefined) return null;
  return (
    <Toggle size="sm" aria-label="">
      {hasActivePushSubscription ? (
        <IoMdNotifications size='18' onClick={() => setPushNotificationsEnabled(false)} />
      ) : (
        <IoMdNotificationsOff size='18' onClick={()=>setPushNotificationsEnabled(true)}  />
      )}
    </Toggle>
  );
};

export default PushSubscriptionToggle;
