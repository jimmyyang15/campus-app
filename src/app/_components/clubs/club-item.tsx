import { Club } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { Button } from "@/app/_components/ui/button";
import { useSession } from "../session-provider";

const ClubItem = ({ club }: { club: Club }) => {
  const { user } = useSession();
  const alreadyInTheClub = user.clubs.find((item)=>item.id === club.id);
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
        {(user.role === "USER" && !user.isMentor && !alreadyInTheClub)?     <Button className="" variant={"outline"}>
          Request Join
        </Button>:null}
        {(user.role === "USER" && alreadyInTheClub) ? <Button className="" variant={"outline"}>
          Go to club 
        </Button> : null}
    
      </div>
    </div>
  );
};

export default ClubItem;
