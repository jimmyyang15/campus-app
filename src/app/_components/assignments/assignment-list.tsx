"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import { ChevronLeft } from "lucide-react";
import Loading from "../loading";
import moment from "moment";
import { useSession } from "../session-provider";
import { handleDownload } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { toast } from "sonner";
import { AssignmentWithPayload } from "@/types";
import { useEdgeStore } from "@/lib/edgestore";
const AssignmentList = () => {
  const { id } = useParams();
  const user = useSession();
  const router = useRouter();
  const { data: assignments, isLoading } = useQuery<{
    data: AssignmentWithPayload[];
  }>({
    queryKey: ["assignmentList"],
    queryFn: () =>
      fetch(`/api/clubs/${id}/assignments`).then((res) => res.json()),
  });
  console.log(assignments);
  return (
    <div>
      <Button variant="ghost" onClick={() => router.back()}>
        <ChevronLeft size={18} className="mr-2" />
        Back
      </Button>
      {isLoading && !assignments ? (
        <Loading />
      ) : (
        <div className="mt-4 space-y-4">
          <>
            {assignments?.data.length === 0 ? (
              <>
                <h5>No assignments</h5>
              </>
            ) : (
              <>
                {assignments?.data.map((assignment) => (
                  <div
                    className="space-y-2 rounded-lg border p-4"
                    key={assignment.id}
                  >
                    <div className="flex items-center justify-between">
                      <p>{assignment.name}</p>
                      {user.isMentor ? <ItemDropdown assignment={assignment} /> : null}
                      
                    </div>
                    <p className="text-xs text-gray-500">
                      Due in {moment(assignment.dueDate).format("lll")}
                    </p>
                    <div className="flex items-center gap-x-2">
                      <Button
                        onClick={() =>
                          handleDownload(
                            assignment.file,
                            assignment.file.split("/").pop() as string,
                          )
                        }
                        className=""
                      >
                        Download file
                      </Button>
                      <Button
                        onClick={() =>
                          router.push(
                            user.isMentor
                              ? `/club/${id}/assignments/${assignment.id}/submissions`
                              : `/club/${id}/assignments/${assignment.id}/submission`,
                          )
                        }
                        className=""
                      >
                        {user.isMentor ? "Submissions" : "Submit"}
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        </div>
      )}
    </div>
  );
};


const ItemDropdown = ({ assignment }: { assignment:AssignmentWithPayload }) => {
  const queryClient = useQueryClient();
  const { id } = useParams()
  const { edgestore } = useEdgeStore();
  const [isDeleting,setIsDeleting] = useState<boolean>(false)
  const { mutateAsync: deleteAssignment } = useMutation({
    mutationFn: () => axios.delete(`/api/clubs/${id}/assignments/${assignment.id}`),
    onSuccess: () => {
      toast.success("Post deleted", {
        description: moment().format("LLLL"),
        // action: {
        //   label: "Dismiss",
        //   onClick: () => toast.dismiss(),
        // },
        closeButton: true,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["assignmentList"]);
    },
  });

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const promises = assignment.submissions.map((submission)=>{
        edgestore.publicFiles.delete({
         url: submission.files,
       });
     })
     await Promise.all(promises as void[])
     await deleteAssignment();
    } catch (error) {
      throw new Error("Oops... Something went wrong")
    }finally {
      setIsDeleting(false)
    }

  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IoEllipsisHorizontalSharp />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={handleDelete}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


export default AssignmentList;
