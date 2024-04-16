import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { CreatePost } from "@/app/_components/create-post";
// import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { validateRequest } from "@/server/auth";
import { redirect } from "next/navigation";
import { Button } from "./_components/ui/button";
import { signOut } from "./_actions/signout";
import { headers } from "next/headers";
import BackgroundDot from "./_components/ui/background-dot";

export const metadata = {
  title: "Home",
  description: "This is the home page",
  // icons: [{ rel: "icon", url: "/favicon.ico" }],
};
export default async function Home() {
  noStore();
  const { user } = await validateRequest();
	if (!user) {
		return redirect("/auth/signin");
	}
  const hello = await api.post.hello.query({ text: "from tRPC" });

  return (
    <main className="min-h-screen container">
      <form action={signOut}>
        <button>signout</button>
      </form>

    </main>

  );
}

