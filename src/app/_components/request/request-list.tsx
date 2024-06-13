"use client"

import { api } from "@/trpc/react";
import React from "react";
import RequestItem from "./request-item";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { RequestWithPayload } from "@/types";

const RequestList = ({ clubId }: { clubId: string }) => {
  const { data:requests,isLoading } = useQuery<{
    data:RequestWithPayload[]
  }>({
    queryKey: ['requestsList'],
    queryFn: () =>
      fetch(`/api/clubs/${clubId}/requests`).then((res) =>
        res.json(),
      ),
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
          {requests?.data.length === 0 ? (
            <p className="text-gray-500 ">No requests here</p>
          ) : (
            <>
              {requests?.data.map((request) => (
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
