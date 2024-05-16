"use client";

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
import { Button } from "@/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClubSchema, ClubSchemaType } from "@/lib/schemas/club";
import { Loader2, Plus } from "lucide-react";
import { SingleImageDropzone } from "@/app/_components/single-dropzone-image";
import SelectMentors from "./select-mentors";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { api } from "@/trpc/react";
import { UserWithProfile } from "@/types";
import { useEdgeStore } from "@/lib/edgestore";
import moment from "moment";
import { toast } from "sonner";
const CreateModal = () => {
  const [file, setFile] = useState<File>();
  const utils = api.useUtils();

  const [open, setOpen] = useState(false);
  const { edgestore } = useEdgeStore();
  const { data: mentors } = api.user.getMentors.useQuery();
  const { mutateAsync: createClub, isLoading } =
    api.club.createClub.useMutation({
      onSuccess: () => {
        setOpen(false);
        toast.success("Club created ", {
          description: moment().format("LLLL"),
          // action: {
          //   label: "Dismiss",
          //   onClick: () => toast.dismiss(),
          // },
          closeButton: true,
        });
      },
      onSettled: () => {
        utils.club.getClubs.invalidate();
      },
    });
  const form = useForm<ClubSchemaType>({
    resolver: zodResolver(ClubSchema),
    defaultValues: {
      name: "",
      desc: "",
    },
  });
  async function onSubmit(values: ClubSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (file) {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          // you can use this to show a progress bar
          console.log(progress);
        },
      });
      await createClub({
        ...values,
        desc: values?.desc as string,
        clubImage: res.url as string,
      });
    } else {
      await createClub({
        ...values,
        desc: values?.desc as string,
      });
    }
  }
  return (
    <Credenza onOpenChange={setOpen} open={open}>
      <CredenzaTrigger asChild>
        <Button variant={"outline"}>
          <Plus className="mr-2 h-4 w-4" />
          Create Club
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <ScrollArea className="h-[500px]">
          <CredenzaHeader>
            <CredenzaTitle className="text-center">Create a club</CredenzaTitle>
          </CredenzaHeader>
          <CredenzaBody className="space-y-4 pb-4 text-center text-sm sm:pb-0 sm:text-left">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Type here..." {...field} />
                      </FormControl>
                      <FormDescription>This is the club's name</FormDescription>
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
                        <Input placeholder="Type here..." {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the club's description
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SelectMentors mentors={mentors as UserWithProfile[]} />
                <SingleImageDropzone
                  className="w-full"
                  width={0}
                  height={200}
                  value={file}
                  onChange={(file) => {
                    setFile(file);
                  }}
                />
                <Button type="submit" variant={"outline"} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isLoading ? "Creating a club..." : "Create club"}
                </Button>
              </form>
            </Form>
          </CredenzaBody>
        </ScrollArea>
      </CredenzaContent>
    </Credenza>
  );
};

export default CreateModal;
