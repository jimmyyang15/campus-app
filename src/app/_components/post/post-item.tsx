"use client";

import React, { useState } from "react";
import { PostsWithUser } from "@/types";
import AvatarProfile from "../avatar-profile";
import { Profile } from "@prisma/client";
import PostActions from "./post-actions";
import ReactionsList from "./reactions-list";
import Link from "next/link";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";

import { Button } from "@/app/_components/ui/button";
import { DropdownMenu, DropdownMenuSeparator,DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger  } from "@/app/_components/ui/dropdown-menu";
import { useSession } from "../session-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import moment from "moment";
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
  const user = useSession();
  return (
    <Link href={`/post/${item.id}`}>
      <div className="cursor-pointer space-y-4 border-b p-4 transition-colors hover:bg-accent/10">
        <div className="flex items-center gap-x-4">
          <AvatarProfile profile={item.user.profile as Profile} />
          <p className="mr-auto">{item.user.profile?.fullName}</p>
          {user.role === 'ADMIN' ? <ItemDropdown postId={item.id} /> : null}
          
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

const ItemDropdown = ({postId}:{postId:string}) => {
  const queryClient = useQueryClient()
  const { mutateAsync:deletePost,isLoading:isDeleting } = useMutation({
    mutationFn:()=>axios.delete(`/api/posts/${postId}`),
    onSuccess: () => {
      toast.success("Post deleted", {
        description: moment().format("LLLL"),
        // action: {
        //   label: "Dismiss",
        //   onClick: () => toast.dismiss(),
        // },
        closeButton: true,
      });
    },
    onSettled:()=>{
      queryClient.invalidateQueries(['postsList'])
    }
  });

  const handleDelete = async() => {
    await deletePost()
  }
  return (
<DropdownMenu>
  <DropdownMenuTrigger>
    <IoEllipsisHorizontalSharp />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={(e) => {
      e.stopPropagation()
      e.nativeEvent.preventDefault()
      handleDelete()
    }}>
      {isDeleting ? "Deleting..." : "Delete"}
    </DropdownMenuItem>

  </DropdownMenuContent>
</DropdownMenu>
  );
};

export default PostItem;
