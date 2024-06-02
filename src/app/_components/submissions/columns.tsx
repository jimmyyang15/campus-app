"use client"
 
import { ColumnDef } from "@tanstack/react-table"

export type Submission = {
    id:string;
    status:"Not Attempted" | "Submitted" | "Overdue",
    username:string,
    name:string,
    file:string
}

 
export const columns: ColumnDef<Submission>[] = [
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "file",
      header: "File",
    },

  ]