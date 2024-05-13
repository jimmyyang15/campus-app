
'use client'
import React from "react";
import PostActions from "./post-actions";
import ReactionsList from "./reactions-list";
import { api } from "@/trpc/react";
import { Profile, Reaction } from "@prisma/client";
import AvatarProfile from "../avatar-profile";
import Loading from "../loading";
import { Input } from "@/app/_components/ui/input";
import { Textarea } from "@/app/_components/ui/textarea";

const PostDetailComponent = ({ id }: { id: string }) => {
  const { data: post, isLoading } = api.post.singlePost.useQuery({
    postId: id,
  });
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="space-y-4  p-4  ">
          <div className="flex items-center gap-x-4">
            <AvatarProfile profile={post?.user.profile as Profile} />
            <p>{post?.user.profile?.fullName}</p>
          </div>
          <p className="text-lg font-bold ">{post?.title}</p>
          <div dangerouslySetInnerHTML={{ __html: post?.content as string }} />
          <PostActions postId={id} />
          <ReactionsList
            postId={id}
            reactions={post?.reactions as Reaction[]}
          />
          <Textarea placeholder="Write a comment"  />
        </div>
      )}
    </>
  );
};

export default PostDetailComponent;
