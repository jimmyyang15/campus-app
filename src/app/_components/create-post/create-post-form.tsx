"use client";

import React, { useState } from "react";
import { slateToHtml,htmlToSlate } from '@slate-serializers/html'
import moment from 'moment'
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
import { PostSchema } from "@/lib/schemas/post";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { PlateEditor } from "./editor";
import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const CreatePostForm = () => {
  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      // desc: "",
    },
  });

  const { mutateAsync:createPost,isLoading } = api.post.createPost.useMutation({
    onSuccess: () => {
      toast.success("Post created", {
        description: moment().format('LLLL'),
        // action: {
        //   label: "Dismiss",
        //   onClick: () => toast.dismiss(),
        // },
        closeButton: true,
      });
    },
  })
  const [content, setContent] = useState<any>();

  async function onSubmit(values: z.infer<typeof PostSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    await createPost({
      ...values,
      desc:slateToHtml(content)
    })
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 flex flex-col space-y-8"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Hello..." {...field} />
              </FormControl>
              <FormDescription>
                This is going to be the title of your post
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormLabel>Description</FormLabel>
        {/* <Input placeholder="Hello..." {...field} /> */}
        <PlateEditor setContent={setContent} />

        <FormMessage />
        <Button type="submit" className="text-white" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoading ? "Creating a post..." : "Create"}
          </Button>
      </form>
    </Form>
  );
};

export default CreatePostForm;
