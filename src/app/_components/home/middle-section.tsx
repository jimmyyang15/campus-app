import React from "react";
import CreatePostSection from "./create-post-section";
import PostItem from "./post-item";
import { posts } from "@/data";

const MiddleSection = () => {
  return (
    <section className="flex-[.50] border-x">
      <CreatePostSection />
      {posts.map((item) => (
        <PostItem item={item} />
      ))}
    </section>
  );
};

export default MiddleSection;
