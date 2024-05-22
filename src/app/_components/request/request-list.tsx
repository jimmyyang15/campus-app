"use client"

import { api } from "@/trpc/react";
import React from "react";
import RequestItem from "./request-item";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";

const RequestList = ({ clubId }: { clubId: string }) => {
  const { data: requests, isLoading } = api.request.getRequests.useQuery({
    clubId,
  });
  const router = useRouter();
  return (
    <div className="mt-4">
      <Button variant="ghost" onClick={() => router.back()}>
        <ChevronLeft size={18} className="mr-2" />
        Back
      </Button>
      <p className="text-center text-lg font-bold">Requests</p>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          {requests?.length === 0 ? (
            <p className="text-gray-500 ">No requests here</p>
          ) : (
            <>
              {requests?.map((request) => (
                <RequestItem key={request.id} request={request} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestList;
