import React from "react";
import ClubSidebar from "@/app/_components/clubs/club-sidebar";

const ClubLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className=" flex">
      <ClubSidebar />
      <div className="flex-1 border-x p-4">{children}</div>
    </div>
  );
};

export default ClubLayout;
