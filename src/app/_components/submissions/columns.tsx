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

import { Input } from "@/app/_components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { toast } from "sonner";
import { useState } from "react";
import { Credenza, CredenzaTrigger, CredenzaHeader, CredenzaContent, CredenzaTitle } from "@/app/_components/ui/credenza";

export type MappedSubmission = {
  id: string;
  status: "Not Attempted" | "Submitted" | "Overdue";
  username: string;
  name: string;
  file: string;
  mark: number;
  submissionId:string;
};

export const columns: ColumnDef<MappedSubmission>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div
          className={cn("text-left", {
            "text-green-600": row.original.status === "Submitted",
            "text-red-500": row.original.status === "Overdue",
          })}
        >
          {row.original.status}
        </div>
      );
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
      return (
        <div className="text-left font-medium">
          {getDownloadFileName(row.original.file)}
        </div>
      );
    },
  },
  {
    accessorKey: "mark",
    header: "Score",
    cell: function ScoreAction({ row }) {
      return (
        <div>
          {row.original.mark ? row.original.mark : "-"}
          {/* <Input  className="w-16 appearance-none h-8" min={0} max={100} type="number" width={100}/> */}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: function ActionComponent({ row }) {
      const queryClient = useQueryClient()
      const { id, assignmentId } = useParams();
      const [open,setOpen] = useState(false)
      const formSchema = z.object({
        score: z.number(),
      });
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          score: 0,
        },
      });
      const { mutateAsync: markSubmission,isLoading } = useMutation({
        mutationFn:(payload:{
          mark:number,
          submissionId:string,
        })=>axios.put(`/api/clubs/${id}/assignments/${assignmentId}/submissions/mark-submission`,payload),
        onSuccess: (data) => {
          console.log(data)
          setOpen(false);
          toast.success("Submission marked", {
            description: moment().format("LLLL"),
            // action: {
            //   label: "Dismiss",
            //   onClick: () => toast.dismiss(),
            // },
            closeButton: true,
          });
        },
        onSettled: () => {
          queryClient.invalidateQueries(['submissionList'])
        },
      });
      async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        await markSubmission({
          mark:values.score,
          submissionId:row.original.submissionId
        })

      }
      if (row.original.file === "-") return null;
      return (
        <Credenza onOpenChange={setOpen} open={open}>
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
                onClick={() =>
                  handleDownload(
                    row.original.file,
                    getDownloadFileName(row.original.file) as string,
                  )
                }
              >
                Download
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CredenzaTrigger>Mark</CredenzaTrigger>
              </DropdownMenuItem>
              {/* <DropdownMenuSeparator /> */}
            </DropdownMenuContent>
          </DropdownMenu>
          <CredenzaContent className="sm:max-w-md">
            <CredenzaHeader>
              <CredenzaTitle>Mark Submission</CredenzaTitle>
            </CredenzaHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="score"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} onChange={event => field.onChange(+event.target.value)} />
                      </FormControl>
                   
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </Form>
          </CredenzaContent>
        </Credenza>
      );
    },
  },
];


