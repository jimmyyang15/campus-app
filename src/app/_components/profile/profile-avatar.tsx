"use client";

import { Profile } from "@prisma/client";
import { Camera } from "lucide-react";
import Image from "next/image";
import React, { useRef } from "react";

type Props = {
  profile: Profile;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  preview: string;
};
const ProfileAvatar = ({ profile, setFile, preview }: Props) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    hiddenFileInput!.current!.click();
  };
  return (
    <div className=" flex justify-center">
      <div className="relative cursor-pointer " onClick={handleClick}>
        <Image
          alt="profile-picture"
          src={
            preview
              ? preview
              : profile.profilePicture
                ? profile.profilePicture
                : `https://ui-avatars.com/api/?background=random&name=${profile.fullName}`
          }
          width={0}
          height={0}
          sizes="100vw"
          className="object-cover rounded-full h-[100px] w-[100px]"
        />
        <div className="absolute bottom-0 left-0 right-0 top-0  rounded-full bg-[#00000071]"></div>
        <Camera
          size="32"
          className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
        />
        <input
          ref={hiddenFileInput}
          onChange={(e) => setFile(e.target.files?.[0])}
          accept="image/png,  image/jpeg"
          type="file"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ProfileAvatar;
