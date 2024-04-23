import Link from "next/link";
import React from "react";

const CreatePostSection = () => {
  return (
    <section className="border-b p-4 flex justify-end">
      <Link href="/create-post" className="rounded-md bg-primary px-8 py-2 font-light text-white shadow-[0_4px_14px_0_rgb(0,118,255,39%)] transition duration-200 ease-linear hover:bg-primary/90 hover:shadow-[0_6px_20px_rgba(0,118,255,23%)]">
        Create Post
      </Link>
    </section>
  );
};

export default CreatePostSection;
