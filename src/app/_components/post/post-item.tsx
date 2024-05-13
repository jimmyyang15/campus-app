"use client"

import React from "react";
import { PostsWithUser } from "@/types";
import AvatarProfile from "../avatar-profile";
import { Profile } from "@prisma/client";
import PostActions from "./post-actions";
import ReactionsList from "./reactions-list";
import { db } from "@/server/db";
import Link from "next/link";
interface Props {
  item: PostsWithUser;
}

// const fetchPostReactions = async(postId:string) => {
//   const reactions = await db.reaction.findMany({
//       where:{
//           postId
//       }
//   });
//   return reactions
// }
const PostItem = ({ item }: Props) => {

  return (
    <Link href={`/post/${item.id}`}>
    <div className="space-y-4 border-b p-4 hover:bg-accent/10 cursor-pointer transition-colors">
      
      <div className="flex items-center gap-x-4">
        <AvatarProfile profile={item.user.profile as Profile} />
        <p>{item.user.profile?.fullName}</p>
      </div>
      <p className="text-lg font-bold ">{item.title}</p>
      <div dangerouslySetInnerHTML={{ __html: item.content as string }} />
      <PostActions postId={item.id} />
      <ReactionsList postId={item.id} reactions={item.reactions} />
      {/* <Image src={item.picture} className="object-cover w-full h-96" sizes="100vw" width={0} height={0} alt="post-media" /> */}
    </div> 
    </Link>
    
  );
};

export default PostItem;
