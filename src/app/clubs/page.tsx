import React from "react";
import CreateModal from "../_components/clubs/create-modal";
export const metadata = {
  title: "Clubs",
  description: "This is the club page",
  // icons: [{ rel: "icon", url: "/favicon.ico" }],
};
const ClubsPage = () => {
  return (
    <main className="relative mx-auto min-h-screen max-w-6xl p-4 ">
      <CreateModal />
    </main>
  );
};

export default ClubsPage;
