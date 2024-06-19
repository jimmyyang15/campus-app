import React, { useEffect, useState } from "react";
import { Toggle } from "@/app/_components/ui/toggle";
import { IoMdNotifications, IoMdNotificationsOff } from "react-icons/io";
import {
  getCurrentPushSubscription,
  registerPushNotifications,
  unregisterPushNotifications,
} from "@/lib/pushService";
import { Button } from "./ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "sonner";

const PushSubscriptionToggle = () => {
  const [hasActivePushSubscription, setHasActivePushSubscription] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function getActivePushSubscription() {
      const subscription = await getCurrentPushSubscription();
      setHasActivePushSubscription(!!subscription);
    }

    getActivePushSubscription();
  }, []);

  async function setPushNotificationsEnabled(enabled: boolean) {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (enabled) {
        await registerPushNotifications();
        toast.success("Push subscription enabled", {
          // action: {
          //   label: "Dismiss",
          //   onClick: () => toast.dismiss(),
          // },
          closeButton: true,
        });
      } else {
        await unregisterPushNotifications();
        toast.success("Push subscription disabled", {
          // action: {
          //   label: "Dismiss",
          //   onClick: () => toast.dismiss(),
          // },
          closeButton: true,
        });
      }
      setHasActivePushSubscription(enabled);
    } catch (error) {
      console.error(error);
      if (enabled && Notification.permission === "denied") {
        alert("Please enable push notifications in your browser settings");
      } else {
        alert("Something went wrong. Please try again!");
      }
    } finally {
      setIsLoading(false);
    }
  }
  // if (hasActivePushSubscription === undefined) return null;
  return (
    <Button variant={"outline"} disabled={isLoading}>
      {isLoading ? (
        <AiOutlineLoading3Quarters className="animate-spin" />
      ) : (
        <>
          {hasActivePushSubscription ? (
            <IoMdNotifications
              size="18"
              onClick={() => setPushNotificationsEnabled(false)}
            />
          ) : (
            <IoMdNotificationsOff
              size="18"
              onClick={() => setPushNotificationsEnabled(true)}
            />
          )}
        </>
      )}
    </Button>
  );
};

export default PushSubscriptionToggle;
