"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { cn, getDownloadFileName, handleDownload } from "@/lib/utils";
import { Absence } from "@prisma/client";
import { Checkbox } from "../ui/checkbox";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export type MappedAttendance = {
  id: string;
  username: string;
  name: string;
  absence: Absence[];
};

export const columns: ColumnDef<MappedAttendance>[] = [
  {
    accessorKey: "username",
    header: "Username",
       
  },
  {
    accessorKey: "name",
    header: "Name",
      
  },

  // {
  //     accessorKey: "status",
  //     header: "Status",
  //     cell: ({ row }) => {

  //       return <div className={cn("text-left",{
  //         "text-green-600" : row.original.status === "Submitted",
  //         "text-red-500" : row.original.status === "Overdue"
  //       })}>
  //         {row.original.status}
  //       </div>
  //     },
  //   },
  {
    header: "Hadir",

    cell: ({ row }) => {
        const { scheduleId,id } = useParams();
        const queryClient = useQueryClient();

        const { mutateAsync: hadir} = useMutation({
          mutationFn:(payload:{
            userId:string
          })=>axios.post(`/api/clubs/${id}/attendance/${scheduleId}/hadir`,payload),
         
          onSettled: () => {
            queryClient.invalidateQueries(['membersAttendance'])
            queryClient.invalidateQueries(['scheduleDetail'])

          },
        });
        const handleChange = async() => {
          await hadir({
            userId:row.original.id
          })
        }
        const absent = row.original.absence.find((item)=>item.scheduleId === scheduleId)
      return (
        <div>
          <Checkbox disabled={!absent} checked={!absent} onCheckedChange={handleChange} />
        </div>
      );
    },
  },
  {
    header: "Tidak Hadir",
    cell: ({ row }) => {
        const { scheduleId,id } = useParams();
        const queryClient = useQueryClient();
        const { mutateAsync: absen} = useMutation({
          mutationFn:(payload:{
            userId:string
          })=>axios.post(`/api/clubs/${id}/attendance/${scheduleId}/absent`,payload),
         
          onSettled: () => {
            queryClient.invalidateQueries(['membersAttendance'])
            queryClient.invalidateQueries(['scheduleDetail'])

          },
        });
        const handleChange = async() => {
          console.log('fdsfsd')
          await absen({
            userId:row.original.id
          })
        }
        const absent = row.original.absence.find((item)=>item.scheduleId === scheduleId)
        console.log(absent)
      return (
        <div>
          <Checkbox checked={absent !== undefined} disabled={absent !== undefined} onCheckedChange={handleChange}/>
        </div>
      );
    },
  },
];
