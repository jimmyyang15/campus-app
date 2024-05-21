import React, { useState } from "react";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/app/_components/ui/credenza";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { CalendarIcon, FileUp } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  AssignmentSchema,
  AssignmentSchemaType,
} from "@/lib/schemas/assignment";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/app/_components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/app/_components/ui/calendar";
import { api } from "@/trpc/react";
import { useEdgeStore } from "@/lib/edgestore";
import { useParams } from "next/navigation";
import { DateTimePicker } from "../date-time-picker";

const UploadAssignmentModal = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = React.useState<File>();
  const { id } = useParams()
  const { edgestore } = useEdgeStore();
  // const [file,setFile] = useState<File | undefined>(undefined)
  const form = useForm<AssignmentSchemaType>({
    resolver: zodResolver(AssignmentSchema),
    defaultValues: {
      name: "",
      
    },
  });
  const { mutateAsync: createAssignment,isLoading:isUploading } =
    api.assignment.createAssignment.useMutation();

  // 2. Define a submit handler.
  async function onSubmit(values: AssignmentSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const { file } = values;
    const res = await edgestore.publicFiles.upload({
      file,
      options:{
        manualFileName:file.name as string
      }
      // input:{
      //   name:file.name
      // }
      // onProgressChange: (progress) => {
      //   // you can use this to show a progress bar
      //   console.log(progress);
      // },
    });
    console.log(res);

    await createAssignment({
      ...values,
      file: res?.url as string,
      clubId:id as string
    });
  }
  return (
    <Credenza onOpenChange={setOpen} open={open}>
      <CredenzaTrigger asChild>
        <li className="flex cursor-pointer flex-col items-center gap-y-2 text-sm text-gray-500">
          <FileUp />
          <p>Upload assignment</p>
        </li>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle className="text-center">
            Upload Assignment
          </CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody className="mt-4 space-y-4 pb-4 text-center text-sm sm:pb-0 sm:text-left">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
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
              <FormField
                control={form.control}
                // defaultValue={user?.profile.dob as Date}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due date</FormLabel>
              <DateTimePicker date={field.value} setDate={field.onChange} />
                

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading...":"Upload"}
              </Button>
            </form>
          </Form>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
};

export default UploadAssignmentModal;
