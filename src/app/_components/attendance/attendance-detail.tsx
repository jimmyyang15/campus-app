"use client";

import { UserWithProfile } from "@/types";
import { Schedule } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useParams,useRouter } from "next/navigation";
import React, { useMemo } from "react";
import Loading from "../loading";
import moment from "moment";
import { DataTable } from "./data-table";
import { MappedAttendance, columns } from "./columns";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";

const AttendanceDetail = () => {
  const { id, scheduleId } = useParams();
  const router = useRouter();
  const { data: members, isLoading } = useQuery<{
    data: {
      members: UserWithProfile[];
    };
  }>({
    queryKey: ["membersAttendance"],
    queryFn: () => fetch(`/api/clubs/${id}/members`).then((res) => res.json()),
  });
  const { data: schedule, isLoading: scheduleLoading } = useQuery<{
    data: Schedule;
  }>({
    queryKey: ["scheduleDetail"],
    queryFn: () =>
      fetch(`/api/clubs/${id}/attendance/${scheduleId}`).then((res) =>
        res.json(),
      ),
  });

  const mappedMembers = members?.data?.members?.map((member) => {
    return {
      id: member.id,
      name: member.profile?.fullName,
      username: member.username,
      absence: member.absences,
    };
  });

  console.log(mappedMembers);
  return (
    <div>
      <Button variant="ghost" onClick={() => router.back()}>
        <ChevronLeft size={18} className="mr-2" />
        Back
      </Button>
      {scheduleLoading || isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          <h2>{schedule?.data.title}</h2>
          <p>{moment(schedule?.data.date).format("LL")}</p>
          <DataTable
            columns={columns}
            data={mappedMembers as MappedAttendance[]}
          />
        </div>
      )}
    </div>
  );
};

export default AttendanceDetail;
