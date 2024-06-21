"use client";

import React from "react";
import { Button } from "@/app/_components/ui/button";
import { ChevronLeft, Download, SquarePen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSubmission } from "@/hooks/use-submission";
import Loading from "@/app/_components/loading";
import { cn, getDownloadFileName, handleDownload } from "@/lib/utils";
import moment from "moment";
import {  useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  Form,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const SubmissionSchema = z.object({
  attachment: z.instanceof(File, {
    message: "Required",
  }),
});
type SubmissionSchemaType = z.infer<typeof SubmissionSchema>;
const AssignmentActivity = () => {
  const router = useRouter();
  const form = useForm<SubmissionSchemaType>({
    resolver: zodResolver(SubmissionSchema),
  });
  const {
    assignment,
    isLoading,
    submission,
    isSubmitting,
    selectedFile,
    setSelectedFile,
    handleEditSubmission,
    handleRemoveSubmission,
    onSubmit,
    isRemoving,
    isEditing,
  } = useSubmission();
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
            <p
              className={cn("p-4", {
                submission: "text-green-700",
              })}
            >
              {submission ? "Submitted" : "No Attempt"}
            </p>
          </div>
          <div className="flex items-center border-b text-sm">
            <p className="w-[120px] p-4">Time remaining</p>
            {new Date() < new Date(assignment!.dueDate) ? (
              <p className="p-4 text-green-700">
                Assignment is due on {moment(assignment?.dueDate).format("lll")}
              </p>
            ) : (
              <p className="p-4 text-destructive">
                Assignment is overdue by{" "}
                {moment(assignment?.dueDate).format("lll")}
              </p>
            )}
          </div>
          <div className="flex items-center border-b text-sm">
            <p className="w-[120px] bg-secondary p-4">Last modified</p>
            <p className="p-4">-</p>
          </div>
          <Form {...form}>
            {submission ? null : (
              <form className="p-2" onSubmit={form.handleSubmit(onSubmit)}>
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
                            onChange(
                              event.target.files && event.target.files[0],
                            )
                          }
                          className="cursor-pointer"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="mt-4 "
                    disabled={isSubmitting || !form.watch("attachment")}
                  >
                    {isSubmitting ? "Processing..." : "Submit"}
                  </Button>
                </div>
              </form>
            )}
            {!!submission ? (
              <div className="flex items-center  border-b text-sm">
                <p className="w-[120px]  p-4">File submission</p>
                <div className="p-4">
                  <div className="flex items-center gap-x-4">
                    <p>
                      {selectedFile
                        ? selectedFile?.name
                        : submission.files.split("/").pop()}
                    </p>

                    <div className="flex items-center gap-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            onClick={() =>
                              handleDownload(
                                submission.files,
                                getDownloadFileName(
                                  submission?.files,
                                ) as string,
                              )
                            }
                          >
                            <Download className="text-gray-500" size={16} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <form>
                              <div className="flex flex-row items-center">
                                <input
                                  type="file"
                                  id="custom-input"
                                  onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                  ) =>
                                    setSelectedFile(
                                      event.target.files?.[0] as File,
                                    )
                                  }
                                  hidden
                                />
                                <label
                                  htmlFor="custom-input"
                                  className="cursor-pointer"
                                >
                                  <SquarePen
                                    className="text-gray-500"
                                    size={16}
                                  />
                                </label>
                              </div>
                            </form>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit file</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            onClick={handleRemoveSubmission}
                            disabled={isRemoving}
                          >
                            {isRemoving ? (
                              <AiOutlineLoading3Quarters className="animate-spin" />
                            ) : (
                              <Trash2 className="text-gray-500" size={16} />
                            )}
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove submission</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {selectedFile ? (
                        <div className="flex items-center gap-x-2">
                          <Button
                            className="h-8"
                            disabled={isEditing}
                            onClick={handleEditSubmission}
                          >
                            {isEditing ? "Processing..." : "Edit"}
                          </Button>
                          <Button
                            className="h-8"
                            onClick={() => setSelectedFile(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center"></div>
                </div>
              </div>
            ) : null}
          </Form>
        </div>
      )}
    </div>
  );
};

export default AssignmentActivity;
