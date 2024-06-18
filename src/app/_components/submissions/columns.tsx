"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/app/_components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { cn, getDownloadFileName, handleDownload } from "@/lib/utils";

export type MappedSubmission = {
    id:string;
    status:"Not Attempted" | "Submitted" | "Overdue",
    username:string,
    name:string,
    file:string
}

 
export const columns: ColumnDef<MappedSubmission>[] = [
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
  
   
        return <div className={cn("text-left",{
          "text-green-600" : row.original.status === "Submitted",
          "text-red-500" : row.original.status === "Overdue" 
        })}>
          {row.original.status}
        </div>
      },
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
      cell: ({ row }) => {
  
   
        return <div className="text-left font-medium">{getDownloadFileName(row.original.file)}</div>
      },
    },
    {
      
      id: "actions",
      cell: ({ row }) => {
        if(row.original.file === "-") return null
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
              onClick={()=>handleDownload(row.original.file,getDownloadFileName(row.original.file) as string)}
              >
                Download
              </DropdownMenuItem>
              {/* <DropdownMenuSeparator /> */}
             
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },

  ]