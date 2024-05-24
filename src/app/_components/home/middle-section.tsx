"use client";

import React, { useEffect } from "react";
import CreatePostSection from "./create-post-section";
import PostItem from "../post/post-item";

import { api } from "@/trpc/react";
import { PostsWithUser } from "@/types";
import Loading from "@/app/_components/loading";
// import { posts } from "@/data";

type Props = {
  isAdmin: boolean;
  // posts:PostsWithUser[]
};
const MiddleSection = ({ isAdmin }: Props) => {
  const { data: posts } = api.post.getPosts.useQuery();

  return (
    <section className="flex-[.70] border-x">
      {isAdmin ? <CreatePostSection /> : null}
      {posts ? (
        <>
          {posts?.map((item, i) => (
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
