import React from "react";
import { Button } from "@/app/_components/ui/button";
import { ReactionWithUser } from "@/types";
import { useSession } from "@/app/_components/session-provider";
import { cn } from "@/lib/utils";
import { useReaction } from "@/hooks/use-reaction";
type Props = {
  count: number;
  icon:string;
  items:ReactionWithUser[];
  handleReact:()=>void
};
const ReactionButton = ({ count,icon,items,handleReact }: Props) => {
  const  user  = useSession();
  const userReacted = items.find((item)=>item.userId === user.id);
  if (count <= 0) return null;
  return (
    <Button
      className={cn("flex h-6 items-center gap-x-1 text-xs",{
        "bg-accent" : !!userReacted
      })}
      variant="outline"
      size="icon"
      type="button"
      onClick={handleReact}
    >
      <span>{icon}</span>
      <span>{count}</span>
    </Button>
  );
};

export default ReactionButton;
