

import { unstable_noStore as noStore } from "next/cache";

// import { getServerAuthSession } from "@/server/auth";
import { validateRequest } from "@/server/auth";

import MiddleSection from "@/app/_components/home/middle-section";
import Guidelines from "@/app/_components/layout/guidelines";


export const metadata = {
  title: "Home",
  description: "This is the home page",
  // icons: [{ rel: "icon", url: "/favicon.ico" }],
};

// const fetchPosts = async():Promise<PostsWithUser[]> =>{
//   const posts = await db.post.findMany({
//     include:{
//       user:{
//         include:{
//           profile:true
//         }
//       }
//     },
//     orderBy:{
//       createdAt:'desc'
//     }
//   });
//   return posts;
// }

export default async function Home() {
  noStore();
  const { user } = await validateRequest();
	// if (!user) {
	// 	return redirect("/auth/signin");
	// }

  // const posts = await api.post.getPosts.query();
  return (
    <main className="min-h-screen container flex ">
      <div className="flex-[.15]"></div>
      <MiddleSection  isAdmin={user?.role==="ADMIN"} />
      <Guidelines />

    </main>

  );
}

