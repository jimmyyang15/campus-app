"use client";

import Loading from "@/app/_components/loading";
import { useSession } from "@/app/_components/session-provider";
import { Button } from "@/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SubmissionSchema = z.object({
  attachment: z.instanceof(File),
});
type SubmissionSchemaType = z.infer<typeof SubmissionSchema>;

const SubmissionPage = () => {
  const { assignmentId } = useParams();
  const { user } = useSession();
  const router = useRouter();
  const form = useForm<SubmissionSchemaType>({
    resolver: zodResolver(SubmissionSchema),
  });
  const { data: assignment, isLoading } = api.assignment.getAssignment.useQuery(
    {
      assignmentId: assignmentId as string,
    },
  );
  const submission = assignment?.submissions.find(
    (item) => item.userId === user.id,
  );
  return (
    <div>
      <Button variant="ghost" onClick={() => router.back()}>
        <ChevronLeft size={18} className="mr-2" />
        Back
      </Button>
      <h4 className="my-4">Assignment Activity</h4>
      <div className="mb-4 space-y-4 ">
        <p className="font-semibold">{assignment?.name}</p>
        <p className="text-sm text-gray-500">{assignment?.desc}</p>
      </div>

      {isLoading && !assignment ? (
        <Loading />
      ) : (
        <div className="border">
          <div className="flex items-center  border-b text-sm">
            <p className="w-[120px] bg-secondary p-4">Submission status</p>
            <p className="p-4">{submission ? "Submitted" : "No Attempt"}</p>
          </div>
          <div className="flex items-center border-b text-sm">
            <p className="w-[120px] p-4">Time remaining</p>
            {new Date() < assignment!.dueDate ? (
              <p className="p-4 text-green-700">
                Assignment is due on {moment(assignment?.dueDate).format("lll")}
              </p>
            ) : (
              <p className="p-4 text-destructive">
                Assignment is overdue by {moment(assignment?.dueDate).format("lll")}
              </p>
            )}
          </div>
          <div className="flex items-center border-b text-sm">
            <p className="w-[120px] bg-secondary p-4">Last modified</p>
            <p className="p-4">-</p>
          </div>
          <Form {...form}>
            <form className="p-2">
              <FormField
                control={form.control}
                name="attachment"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Attachment</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        placeholder="File"
                        type="file"
                        accept="image/*, application/pdf,.zip,.rar,.7zip,.doc, .docx,.ppt, .pptx,.txt"
                        onChange={(event) =>
                          onChange(event.target.files && event.target.files[0])
                        }
                        className="cursor-pointer"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" className="mt-4 ">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default SubmissionPage;
