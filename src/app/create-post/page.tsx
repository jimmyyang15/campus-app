import React from "react";
import CreatePostForm from "@/app/_components/create-post/create-post-form";
import { validateRequest } from "@/server/auth";
import { redirect } from "next/navigation";
export const metadata = {
  title: "Create Post",
  description: "This is the create post page",
  // icons: [{ rel: "icon", url: "/favicon.ico" }],
};
const CreatePostPage = async () => {
  const { user } = await validateRequest();

  if (user?.role !== "ADMIN") {
    return redirect("/");
  }

  return (
    <main className="mx-auto max-w-5xl border-x p-4 ">
      <p className="text-xl font-semibold">Create a post</p>
      <CreatePostForm />
    </main>
  );
};

export default CreatePostPage;
