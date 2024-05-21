"use client";

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
import { useParams,useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SubmissionSchema = z.object({
  attachment: z.instanceof(File),
});
type SubmissionSchemaType = z.infer<typeof SubmissionSchema>;

const SubmissionPage = () => {
  const { assignmentId } = useParams();
  const router = useRouter()
  const form = useForm<SubmissionSchemaType>({
    resolver: zodResolver(SubmissionSchema),
  });
  const { data } = api.assignment.getAssignment.useQuery({
    assignmentId: assignmentId as string,
  });
  console.log(data);
  return (
    <div>
         <Button variant="ghost" onClick={() => router.back()}>
        <ChevronLeft size={18} className="mr-2" />
        Back
      </Button>
      <h4 className="mb-4">Assignment Activity</h4>
      <div className="border">
        <div className="flex items-center  text-sm border-b">
            <p className="p-4 bg-secondary w-[120px]">Submission status</p>
            <p className="p-4">No attempt</p>
        </div>
        <div className="flex items-center text-sm border-b">
            <p className="p-4 ">Time remaining</p>
            <p className="p-4"></p>
        </div>
        <div className="flex items-center border-b text-sm">
            <p className="p-4 bg-secondary w-[120px]">Last modified</p>
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
            <Button type="submit" className="mt-4 ">Submit</Button>

            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SubmissionPage;
