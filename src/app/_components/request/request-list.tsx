import { api } from "@/trpc/react";
import React from "react";
import RequestItem from "./request-item";
import Loading from "../loading";

const RequestList = ({ clubId }: { clubId: string }) => {
  const { data: requests, isLoading } = api.request.getRequests.useQuery({
    clubId,
  });
  return (
    <div className="mt-4">
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
