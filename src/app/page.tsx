import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { CreatePost } from "@/app/_components/create-post";
// import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { validateRequest } from "@/server/auth";
import { redirect } from "next/navigation";
import { Button } from "./_components/ui/button";
import { signOut } from "./_actions/signout";

export default async function Home() {
  noStore();
  const { user } = await validateRequest();
  console.log(user)
	if (!user) {
		return redirect("/auth/signin");
	}
  const hello = await api.post.hello.query({ text: "from tRPC" });

  return (
    <main >
      {hello.greeting}
      <Button onClick={signOut}>Sign out</Button>
    </main>
  );
}

