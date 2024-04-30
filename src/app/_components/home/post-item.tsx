import React from "react";
import { PostsWithUser } from "@/types";
import AvatarProfile from "../avatar-profile";
import { Profile } from "@prisma/client";
interface Props {
  item: PostsWithUser;
}
const PostItem = ({ item }: Props) => {
  return (
    <div className="space-y-4 border-b p-4">
      
      <div className="flex items-center gap-x-4">
        <AvatarProfile profile={item.user.profile as Profile} />
        <p>{item.user.profile?.fullName}</p>
      </div>
      <p className="text-lg font-bold ">{item.title}</p>
      <div dangerouslySetInnerHTML={{ __html: item.desc as string }} />
      {/* <Image src={item.picture} className="object-cover w-full h-96" sizes="100vw" width={0} height={0} alt="post-media" /> */}
    </div>
  );
};

export default PostItem;
