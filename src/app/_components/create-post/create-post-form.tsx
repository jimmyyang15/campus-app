"use client";

import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import moment from "moment";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import QuillToolbar, { modules, formats } from "./editor-toolbar";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const CreatePostForm = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const { mutateAsync: createPost, isLoading } =
    useMutation({
      mutationFn:(payload:{title:string,content:string})=> axios.post(`/api/posts`,payload),
      onSuccess: () => {
        router.push("/")
        toast.success("Post created", {
          description: moment().format("LLLL"),
          // action: {
          //   label: "Dismiss",
          //   onClick: () => toast.dismiss(),
          // },
          closeButton: true,
        });

      },
    });



  async function onSubmit(values: z.infer<typeof PostSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    await createPost({
      ...values,
    });
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
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <>
                <QuillToolbar />
                <ReactQuill
                  // id="content"
                  
                  className=" border-border"
                  modules={modules}
                  formats={formats}
                  placeholder="Text(optional)"
                  theme="snow"
                  style={{}}
                  {...field}
                ></ReactQuill>
                </>
                
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* <Input placeholder="Hello..." {...field} /> */}
        {/* <PlateEditor  /> */}
        <Button
          type="submit"
          className="self-end text-white"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Creating a post..." : "Create"}
        </Button>
      </form>
    </Form>
  );
};

export default CreatePostForm;
