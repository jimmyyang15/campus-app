"use client";

import { ColumnDef } from "@tanstack/react-table";


export type MappedInfo = {
  id: string;
  username: string;
  name: string;
  absenceCount:number;
};

export const columns: ColumnDef<MappedInfo>[] = [
  {
    accessorKey: "username",
    header: "Username",
       
  },
  {
    accessorKey: "name",
    header: "Name",
      
  },
  {
    accessorKey:"absenceCount",
    header:"Absence Count"
  }

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
  
];
