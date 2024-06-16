import Image from "next/image";
import React from "react";
import { Button } from "@/app/_components/ui/button";
import { useSession } from "../session-provider";
import { api } from "@/trpc/react";
import { ClubWithPayload } from "@/types";
import { toast } from "sonner";
import moment from "moment";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const ClubItem = ({ club }: { club: ClubWithPayload }) => {
  const user = useSession();
  const { data:userRequest } = useQuery({
    queryKey:['userRequest'],
    queryFn: () =>
      fetch(`/api/clubs/${club.id}/requests/user-request`).then((res) => res.json()),
  });
  const alreadyInTheClub = user?.club?.id === club.id;
  const queryClient = useQueryClient()
  const requestSent = club?.request?.find((item) => item.userId === user.id);
  const { mutateAsync: requestJoin, isLoading: isRequesting } =
    useMutation({
      mutationFn:()=>axios.post(`/api/clubs/${club.id}/requests`),
      onSuccess: () => {
        toast.success("Request Sent", {
          description: moment().format("LLLL"),

          // action: {
          //   label: "Dismiss",
          //   onClick: () => toast.dismiss(),
          // },
          closeButton: true,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries(['clubList'])
        // utils.request.userRequest.invalidate();

      },
    });
    const { mutateAsync: cancelRequest, isLoading: isCancelling } =
    useMutation({
      mutationFn:()=>axios.post(`/api/clubs/${club.id}/requests/cancel-request`),
      onSuccess: () => {
        toast.success("Request Cancelled", {
          description: moment().format("LLLL"),

          // action: {
          //   label: "Dismiss",
          //   onClick: () => toast.dismiss(),
          // },
          closeButton: true,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries(['clubList'])

        // utils.request.userRequest.invalidate();
      },
    });

  const handleRequest = async () => {
    await requestJoin();
  };

  const handleCancel = async () => {
    await cancelRequest();
  };

  return (
    <div className="space-y-2 overflow-hidden rounded-lg border">
      <Image
      unoptimized={true}
        src={club.clubImage}
        alt="club image"
        width={0}
        height={0}
        className="h-56 w-full object-cover "
        sizes="100vw"
      />

      <div className="space-y-2 px-4 py-2">
        <p className="text-lg font-semibold text-foreground">{club.name}</p>
        <p className="text-sm text-gray-500">{club.desc}</p>
        {user.role === "USER" && !user.isMentor && !alreadyInTheClub ? (
          <Button
            onClick={()=>requestSent ? handleCancel() : handleRequest()}
            className=""
            variant={"outline"}
            disabled={isRequesting || isCancelling || requestSent ? false : userRequest ? true : false}
          >
            {isRequesting
              ? "Sending Request"
              : requestSent
                ? isCancelling ? "Cancelling Request" : "Cancel Request"
                : "Send Request"}
          </Button>
        ) : null}
        {user.role === "USER" && alreadyInTheClub ? (
          <Link href={`/club/${club.id}`}>
            <Button className="" variant={"outline"}>
              Go to club
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default ClubItem;
