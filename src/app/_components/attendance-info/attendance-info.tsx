"use client";
import React from "react";
import Loading from "@/app/_components/loading";
import { UserWithProfile } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "./data-table";
import { MappedInfo, columns } from "./columns";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
const AttendanceInfo = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: members, isLoading } = useQuery<{
    data: {
      members: UserWithProfile[];
    };
  }>({
    queryKey: ["membersAttendance"],
    queryFn: () => fetch(`/api/clubs/${id}/members`).then((res) => res.json()),
  });
  const mappedMembers = members?.data?.members?.map((member) => {
    return {
      id: member.id,
      name: member.profile?.fullName,
      username: member.username,
      absenceCount: !member.absences ? 0 : member.absences.length,
    };
  });
  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ChevronLeft size={18} className="mr-2" />
            Back
          </Button>
          <h5>Absence Info</h5>
          <div className="mx-auto mt-4 w-[90%] overflow-x-scroll md:overflow-x-auto">
            <DataTable columns={columns} data={mappedMembers as MappedInfo[]} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceInfo;
