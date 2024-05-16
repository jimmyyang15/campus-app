import React, { useState } from "react";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/app/_components/ui/credenza";
import { UsersRound } from "lucide-react";
import { UserWithProfile } from "@/types";
import MemberItem from "./member-item";
import { ScrollArea } from "../ui/scroll-area";

const MembersModal = ({members}:{members:UserWithProfile[]}) => {
  const [open, setOpen] = useState(false);
console.log(members)
  return (
    <Credenza onOpenChange={setOpen} open={open}>
      <CredenzaTrigger asChild>
        <li className="flex cursor-pointer items-center gap-x-2">
          <UsersRound />
          Members
        </li>
      </CredenzaTrigger>
      <CredenzaContent>
        <ScrollArea>
        <CredenzaHeader>
          <CredenzaTitle className="text-center">Members</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody className="space-y-4 pb-4 mt-4 text-center text-sm sm:pb-0 sm:text-left">
          {members?.map((member)=>(
            <MemberItem key={member.id} member={member as UserWithProfile} />
          ))}
        </CredenzaBody>
        </ScrollArea>
 
      </CredenzaContent>
    </Credenza>
  );
};

export default MembersModal;
