import { Club } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { Button } from "@/app/_components/ui/button";
import { useSession } from "../session-provider";
import { api } from "@/trpc/react";
import { ClubWithInclude } from "@/types";
import { toast } from "sonner";
import moment from "moment";
import Link from "next/link";

const ClubItem = ({ club }: { club: ClubWithInclude }) => {
  const { user } = useSession();
  const alreadyInTheClub = user.clubs.find((item) => item.id === club.id);
  const utils = api.useUtils();
  const requestSent = club?.request?.find((item) => item.userId === user.id);
  const { mutateAsync: requestJoin, isLoading: isRequesting } =
    api.request.requestJoin.useMutation({
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
        utils.club.getClubs.invalidate();
      },
    });

  const handleRequest = async () => {
    await requestJoin({
      clubId: club.id,
    });
  };
  return (
    <div className="space-y-2 overflow-hidden rounded-lg border">
      <Image
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
            onClick={handleRequest}
            className=""
            variant={"outline"}
            disabled={isRequesting || !!requestSent}
          >
            {isRequesting
              ? "Sending Request"
              : requestSent
                ? "Request Sent"
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
