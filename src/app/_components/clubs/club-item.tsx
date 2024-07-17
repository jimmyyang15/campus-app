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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";

const ClubItem = ({ club }: { club: ClubWithPayload }) => {
  console.log(club);
  const mentor = club.members?.find((member) => member.isMentor);
  const user = useSession();
  const { data: userRequest } = useQuery({
    queryKey: ["userRequest"],
    queryFn: () =>
      fetch(`/api/clubs/${club.id}/requests/user-request`).then((res) =>
        res.json(),
      ),
  });
  const alreadyInTheClub = user?.club?.id === club.id;
  const queryClient = useQueryClient();
  const requestSent = club?.request?.find((item) => item.userId === user.id);
  const { mutateAsync: requestJoin, isLoading: isRequesting } = useMutation({
    mutationFn: () => axios.post(`/api/clubs/${club.id}/requests`),
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
      queryClient.invalidateQueries(["clubList"]);
      queryClient.invalidateQueries(["userRequest"]);
      // utils.request.userRequest.invalidate();
    },
  });
  const { mutateAsync: cancelRequest, isLoading: isCancelling } = useMutation({
    mutationFn: () =>
      axios.post(`/api/clubs/${club.id}/requests/cancel-request`),
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
      queryClient.invalidateQueries(["clubList"]);

      queryClient.invalidateQueries(["userRequest"]);
    },
  });
  const { mutateAsync: deleteClub, isLoading: isDeleting } = useMutation({
    mutationFn: () =>
      axios.delete(`/api/clubs/${club.id}`),
    onSuccess: () => {
      toast.success("Club deleted", {
        description: moment().format("LLLL"),

        // action: {
        //   label: "Dismiss",
        //   onClick: () => toast.dismiss(),
        // },
        closeButton: true,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["clubList"]);

    },
  });

  const handleRequest = async () => {
    await requestJoin();
  };

  const handleCancel = async () => {
    await cancelRequest();
  };

  const handleDeleteClub = async() => {
    await deleteClub();
  }

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
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-foreground">{club.name}</p>
          {user.role === "ADMIN" ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <IoEllipsisHorizontalSharp />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                className="text-destructive"
                onClick={handleDeleteClub}
                disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
        {mentor ? (
          <p className="text-sm text-foreground">
            by {mentor?.profile?.fullName}
          </p>
        ) : null}

        <p className="text-sm text-gray-500">{club.desc}</p>
        {user.role === "USER" && !user.isMentor && !alreadyInTheClub ? (
          <>
            {requestSent ? (
              <Button
                onClick={() => handleCancel()}
                className=""
                variant={"outline"}
                disabled={isCancelling}
              >
                {isCancelling ? "Cancelling request" : "Cancel request"}
              </Button>
            ) : (
              <Button
                onClick={handleRequest}
                className=""
                variant={"outline"}
                disabled={isRequesting}
              >
                {isRequesting ? "Sending..." : "Send request"}
              </Button>
            )}
          </>
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
