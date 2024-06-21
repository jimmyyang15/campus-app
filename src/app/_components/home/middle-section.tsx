"use client";

import React, { useEffect } from "react";
import CreatePostSection from "./create-post-section";
import PostItem from "../post/post-item";

import { api } from "@/trpc/react";
import { PostsWithUser } from "@/types";
import Loading from "@/app/_components/loading";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "../session-provider";
// import { posts } from "@/data";

type Props = {
  isAdmin: boolean;
  // posts:PostsWithUser[]
};
const MiddleSection = ({ isAdmin }: Props) => {
  const { data:posts,isLoading } = useQuery<{
    data:PostsWithUser[]
  }>({
    queryKey: ['postsList'],
    queryFn: () =>
      fetch(`/api/posts`).then((res) =>
        res.json(),
      ),
  });
  const user = useSession();
  console.log(user)
  return (
    <section className="flex-1 border-r">
      {isAdmin ? <CreatePostSection /> : null}
      {!isLoading ? (
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
