"use client";

import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/app/_components/ui/button";
import { ChevronLeft } from "lucide-react";
import Loading from "../loading";
import moment from "moment";
import { useSession } from "../session-provider";
const AssignmentList = () => {
  const { id } = useParams();
  const { user } = useSession()
  const router = useRouter();
  const { data: assignments, isLoading } =
    api.assignment.getAssignments.useQuery({
      clubId: id as string,
    });
    const handleDownload = (url:string,fileName:string) => {
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.download = fileName || "downloaded-file";
          document.body.appendChild(link);
  
          link.click();
  
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Error fetching the file:", error);
        });
    };
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
              <div className="flex items-center gap-x-2">
              <Button onClick={()=>handleDownload(assignment.file,assignment.file.split("/").pop() as string)}  className="">Download file</Button>
              <Button onClick={()=>router.push(`/club/${id}/assignments/${assignment.id}/submission`)} className="">{user.isMentor ? 'Submissions' : "Submit"}</Button>

              </div>
            </div>
          ))}
        </div>}
    </div>
  );
};

export default AssignmentList;