import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Post } from "@/data";
import Image from "next/image";

interface Props {
 item:Post
}
const PostItem = ({item}: Props) => {
  return (
    <div className="border-b p-4 space-y-4">
      <div className="flex gap-x-4 items-center">
        <Avatar>
          <AvatarImage alt="@shadcn" />
          <AvatarFallback>
            <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200"></div>
          </AvatarFallback>
        </Avatar>
        <p>{item.author}</p>
      </div>
      <p>{item.text}</p>
      <Image src={item.picture} className="object-cover w-full h-96" sizes="100vw" width={0} height={0} alt="post-media" />
    </div>
  );
};

export default PostItem;
