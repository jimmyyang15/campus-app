"use client";

import React, { useEffect } from "react";
import CreatePostSection from "./create-post-section";
import PostItem from "../post/post-item";

import { api } from "@/trpc/react";
import { PostsWithUser } from "@/types";
import Loading from "@/app/_components/loading";
import { useQuery } from "@tanstack/react-query";
// import { posts } from "@/data";

type Props = {
  isAdmin: boolean;
  // posts:PostsWithUser[]
};
const MiddleSection = ({ isAdmin }: Props) => {
  const { data:posts,isLoading } = useQuery<{
    data:PostsWithUser[]
  }>({
    queryKey: ['assignmentList'],
    queryFn: () =>
      fetch(`/api/posts`).then((res) =>
        res.json(),
      ),
  })
  return (
    <section className="flex-1 border-x">
      {isAdmin ? <CreatePostSection /> : null}
      {posts ? (
        <>
          {posts?.data.map((item, i) => (
            <PostItem key={i} item={item as PostsWithUser} />
          ))}
        </>
      ) : (
        <Loading />
      )}
    </section>
  );
};

export default MiddleSection;
