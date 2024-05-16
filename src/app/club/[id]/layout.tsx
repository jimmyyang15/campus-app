import React from "react";
import ClubSidebar from "@/app/_components/clubs/club-sidebar";

const ClubLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className=" flex">
      <ClubSidebar />
      <div className="flex-[0.80] border-x p-4">{children}</div>
      <div className="flex-[0.10] ">dsdsdsd</div>
    </div>
  );
};

export default ClubLayout;
