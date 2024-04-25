"use client"

import { Camera } from "lucide-react";
import Image from "next/image";
import React, { useRef } from "react";

const ProfileAvatar = ({ name }: { name: string }) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    hiddenFileInput!.current!.click();
  };
  return (
    <div className=" flex justify-center">
      <div className="relative cursor-pointer" onClick={handleClick}>
        <Image
          alt="profile-picture"
          src={`https://ui-avatars.com/api/?background=random&name=${name}`}
          width={100}
          height={100}
          sizes="100vw"
          className="object-fit rounded-full"
        />
        <div className="absolute bottom-0 left-0 right-0 top-0  bg-[#00000071] rounded-full"></div>
        <Camera
          size="32"
          className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
        />
        <input ref={hiddenFileInput} type="file" className="hidden"/>

      </div>
    </div>
  );
};

export default ProfileAvatar;
