"use client";

import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ClubWithPayload } from "@/types";
import { getNextWeekday } from "@/lib/utils";
import { Schedule } from "@prisma/client";
import moment from "moment";
import { toast } from "sonner";
import Link from "next/link";
import Loading from "../loading";
const ClubAttendance = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { data: club } = useQuery<{
    data: ClubWithPayload;
  }>({
    queryKey: ["clubHome"],
    queryFn: () => fetch(`/api/clubs/${id}`).then((res) => res.json()),
  });
  const { data: clubSchedules, isLoading } = useQuery<{
    data: Schedule[];
  }>({
    queryKey: ["clubSchedules"],
    queryFn: () =>
      fetch(`/api/clubs/${id}/attendance`).then((res) => res.json()),
  });

  const { mutateAsync: createSchedule, isLoading: isCreating } = useMutation({
    mutationFn: (payload: { title: string; dateTime: Date }) =>
      axios.post(`/api/clubs/${id}/attendance`, payload),
    onSuccess: () => {
      toast.success("Schedule created ", {
        description: moment().format("LLLL"),
        // action: {
        //   label: "Dismiss",
        //   onClick: () => toast.dismiss(),
        // },
        closeButton: true,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["clubSchedules"]);
    },
  });

  const handleCreateSchedule = async () => {
    if(club?.data.dayActivity === new Date().getDay().toString()) {
      await createSchedule({
        title: `Pertemuan ${!clubSchedules ? 1 : clubSchedules.data.length + 1}`,
        dateTime: getNextWeekday(club?.data.dayActivity as string),
      });
    } else {
      toast.error("Please wait until the next activity",{
        closeButton:true
      })
    }
   
  };
  return (
    <div className="space-y-4">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Button variant="ghost" onClick={() => router.back()}>
            <ChevronLeft size={18} className="mr-2" />
            Back
          </Button>
          <h5>Attendance List</h5>
          {clubSchedules?.data.map((schedule) => (
            <ScheduleComponent key={schedule.id} schedule={schedule} />
          ))}
          <Button
            variant={"outline"}
            onClick={handleCreateSchedule}
            disabled={isCreating}
          >
            <FaPlus className="mr-2" />
            {isCreating ? "Creating new schedule" : "Create new schedule"}
          </Button>
        </>
      )}
    </div>
  );
};

const ScheduleComponent = ({ schedule }: { schedule: Schedule }) => {
  const { id } = useParams();
  return (
    <div className="flex items-center justify-between gap-x-4 rounded-lg border px-4 py-2 text-sm">
      <p>{schedule.title}</p>
      <p>{moment(schedule.date).format("L")}</p>
      <Button variant={"outline"}>
        <Link href={`/club/${id}/attendance-list/${schedule.id}`}>View</Link>
      </Button>
    </div>
  );
};

export default ClubAttendance;
