import React from "react";
import CreatePostSection from "./create-post-section";
import PostItem from "./post-item";
import { Post } from "@prisma/client";
import { PostsWithUser } from "@/types";
// import { posts } from "@/data";

type Props = {
  isAdmin:boolean;
  posts:PostsWithUser[]
}
const MiddleSection = ({isAdmin,posts}:Props) => {
  return (
    <section className="flex-[.70] border-x">
      {isAdmin ? <CreatePostSection /> :null}
      
      {posts.map((item,i) => (
        <PostItem key={i} item={item} />
      ))}
    </section>
  );
};

export default MiddleSection;
