import AssignmentActivity from "@/app/_components/submissions/assignment-activity";
import { validateRequest } from "@/server/auth";
import { redirect } from "next/navigation";


const SubmissionPage = async() => {
  const user =await validateRequest();

  if(user?.isMentor) {
      return redirect("/")
  }
  
  return (
    <AssignmentActivity />
  );
};

export default SubmissionPage;
