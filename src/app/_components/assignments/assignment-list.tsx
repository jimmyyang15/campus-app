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
import { useQuery } from "@tanstack/react-query";
import { Assignment } from "@prisma/client";
const AssignmentList = () => {
  const { id } = useParams();
  const user = useSession();
  const router = useRouter();
  const { data:assignments,isLoading } = useQuery<{
    data:Assignment[]
  }>({
    queryKey: ['assignmentList'],
    queryFn: () =>
      fetch(`/api/assignments/${id}`).then((res) =>
        res.json(),
      ),
  })
  console.log(assignments)
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
                    <p>{assignment.name}</p>
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

export default AssignmentList;
