import AssignmentActivity from "@/app/_components/submissions/assignment-activity";
import { validateRequest } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";


const SubmissionPage = async({ params }:{params:{id:string}}) => {
  const user = await validateRequest();
  const clubMembers = await db.club.findFirst({
    where:{
      id:params.id
    },
    select:{
      members:true
    }
  });
  const memberOfClub = clubMembers?.members.find((member)=>member.id === user?.id);
  if(!memberOfClub && !user?.isMentor) {
    return redirect("/");
  }
  return (
    <AssignmentActivity />
  );
};

export default SubmissionPage;
