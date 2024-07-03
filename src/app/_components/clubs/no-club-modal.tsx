import React, { useState } from "react";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/app/_components/ui/credenza";
import { Button } from "@/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/_components/ui/input";
import { useParams } from "next/navigation";
import { useSession } from "../session-provider";
import moment from "moment";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const NotificationSchema = z.object({
  reason: z.string(),
});

export type NotificationSchemaType = z.infer<typeof NotificationSchema>;

const NoActivityModal = ({ timeActivity }: { timeActivity: string }) => {
  const { id } = useParams();
  const user = useSession();
  const [open, setOpen] = useState(false);

  const { mutateAsync: notifyMentor, isLoading: notifyingMentor } = useMutation(
    {
      mutationFn: (payload: { clubId: string; reason: string }) =>
        axios.post(`/api/notification`, payload),
      onError:(err)=>{
        if (axios.isAxiosError(err)) {
          toast.error(err.message, {
            description: err.response?.data,
            // action: {
            //   label: "Dismiss",
            //   onClick: () => toast.dismiss(),
            // },
            closeButton: true,
          });
          // Do something with this error...
        }
      
      },
      onSuccess: () => {
        setOpen(false)
        toast.success("Mentor notified", {
          description: moment().format("LLLL"),
          // action: {
          //   label: "Dismiss",
          //   onClick: () => toast.dismiss(),
          // },
          closeButton: true,
        });
      },
      onSettled: () => {},
    },
  );

  const { mutateAsync: notifyMembers, isLoading: notifyingMembers } =
    useMutation({
      mutationFn: (payload: { clubId: string; reason: string }) =>
        axios.post(`/api/members-notification`, payload),
      onError: () => {
        throw new Error("Failed to send notification");
      },
      onSuccess: () => {
        setOpen(false)
        toast.success("Members notified", {
          description: moment().format("LLLL"),
          // action: {
          //   label: "Dismiss",
          //   onClick: () => toast.dismiss(),
          // },
          closeButton: true,
        });
      },
      onSettled: () => {},
    });
  const form = useForm<NotificationSchemaType>({
    resolver: zodResolver(NotificationSchema),
    defaultValues: {
      reason: "",
    },
  });
  const handleNotifyMentor = async () => {
    await notifyMentor({
      clubId: id as string,
      reason: form.getValues("reason"),
    });
  };
  const handleNotifyMembers = async () => {
    await notifyMembers({
      clubId: id as string,
      reason: form.getValues("reason"),
    });
  };

  function parseTime(time: string) {
    const [hours, minutes] = time.split(":");
    return Number(hours) * 60 + Number(minutes as string);
  }

  function isLater(time1: string, time2: string) {
    const minutes1 = parseTime(time1);
    const minutes2 = parseTime(time2);
    return minutes2 < minutes1;
  }
  return (
    <Credenza onOpenChange={setOpen} open={open}>
      <CredenzaTrigger asChild className="mt-4">
        <Button
          disabled={isLater(moment().format("HH:mm").slice(0, 5), timeActivity)}
        >
          I can't come
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Send absence notification</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody className="space-y-4 pb-4 text-center text-sm sm:pb-0 sm:text-left">
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Input placeholder="Type here..." {...field} />
                    </FormControl>
                    <FormDescription>Your reason</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={
                  (isLater(
                    moment().format("HH:mm").slice(0, 5),
                    timeActivity,
                  ) as boolean) ||
                  notifyingMembers ||
                  notifyingMentor
                }
                type="button"
                className="mt-4"
                onClick={
                  user.isMentor ? handleNotifyMembers : handleNotifyMentor
                }
              >
                {notifyingMembers || notifyingMentor ? (
                  "Sending..."
                ) : (
                  <>{user.isMentor ? "Notify members" : "Notify mentor"}</>
                )}
              </Button>
            </form>
          </Form>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
};

export default NoActivityModal;
