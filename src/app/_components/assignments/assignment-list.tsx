"use client";

import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/app/_components/ui/button";
import { ChevronLeft } from "lucide-react";
import Loading from "../loading";
import moment from "moment";
import { getDownloadUrl } from '@edgestore/react/utils';
const AssignmentList = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: assignments, isLoading } =
    api.assignment.getAssignments.useQuery({
      clubId: id as string,
    });
    const handleDownload = (url:string) => {
      console.log('we')
      getDownloadUrl(
        url, // the url of the file to download
        url.split("/").pop() // optional, the name of the file to download
      );
    }
  return (
    <div>
      <Button variant="ghost" onClick={() => router.back()}>
        <ChevronLeft size={18} className="mr-2" />
        Back
      </Button>
      {isLoading && !assignments ? <Loading /> : <div className="mt-4 space-y-4">
          {assignments?.map((assignment)=>(
            <div className="p-4 border rounded-lg space-y-2" key={assignment.id}>
              <p>{assignment.name}</p>
              {/* <p className="text-gray-500 text-sm">{assignment.file.split("/").pop()}</p> */}
              <p className="text-gray-500 text-xs">Due in {moment(assignment.dueDate).format('lll')}</p>
              <Button onClick={()=>handleDownload(assignment.file)}  className="">Download file</Button>
            </div>
          ))}
        </div>}
    </div>
  );
};

export default AssignmentList;
