"use client";

import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/app/_components/ui/button";
import { ChevronLeft } from "lucide-react";
import Loading from "../loading";
import moment from "moment";
import { useSession } from "../session-provider";
import { handleDownload } from "@/lib/utils";
const AssignmentList = () => {
  const { id } = useParams();
  const { user } = useSession()
  const router = useRouter();
  const { data: assignments, isLoading } =
    api.assignment.getAssignments.useQuery({
      clubId: id as string,
    });

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
              <Button onClick={()=>router.push(user.isMentor ? `/club/${id}/assignments/${assignment.id}/submissions` :  `/club/${id}/assignments/${assignment.id}/submission`)} className="">{user.isMentor ? 'Submissions' : "Submit"}</Button>

              </div>
            </div>
          ))}
        </div>}
    </div>
  );
};

export default AssignmentList;
