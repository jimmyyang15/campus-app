"use client";

import { api } from "@/trpc/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import Loading from "../loading";
import { DataTable } from "./data-table";
import { MappedSubmission, columns } from "./columns";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClubWithPayload, SubmissionWithPayload } from "@/types";


const SubmissionList = () => {
  const { id, assignmentId } = useParams();
  const { data: submissions } = useQuery<{
    data: SubmissionWithPayload[];
  }>({
    queryKey: ["submissionList"],
    queryFn: () =>
      fetch(`/api/clubs/${id}/assignments/${assignmentId}/submissions`).then(
        (res) => res.json(),
      ),
  });
  const { data: club, isLoading } = useQuery<{
    data: ClubWithPayload;
  }>({
    queryKey: ["clubSubmissions"],
    queryFn: () => fetch(`/api/clubs/${id}`).then((res) => res.json()),
  });
  const router = useRouter();

  const members = club?.data.members.filter((member) => !member.isMentor);
  const findSubmission = (userId: string) => {
    return submissions?.data.find((submission) => submission.userId === userId);
  };
  const mappedMembers = members?.map((member) => {
    return {
      // id:member.id,
      status: findSubmission(member.id)
        ? (findSubmission(member.id)?.createdAt?.getTime?.() as number) >=
          (findSubmission(
            member.id,
          )?.assignment?.createdAt?.getTime?.() as number)
          ? "Overdue"
          : "Submitted"
        : "Not Attempted",
      username: member.username,
      name: member.profile?.fullName,
      file: findSubmission(member.id)
        ? findSubmission(member.id)?.files.split("/").pop()
        : "-",
    };
  });

  return (
    <div>
      <Button variant="ghost" onClick={() => router.back()}>
        <ChevronLeft size={18} className="mr-2" />
        Back
      </Button>
      <h3>Submissions</h3>
      {isLoading || !club?.data.members ? (
        <Loading />
      ) : (
        <div className="mt-4 md:overflow-x-auto overflow-x-scroll w-[90%] mx-auto">
          <DataTable
            columns={columns}
            data={mappedMembers as MappedSubmission[]}
          />
        </div>
      )}
    </div>
  );
};


export default SubmissionList;
