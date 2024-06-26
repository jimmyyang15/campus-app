import React, { useMemo, useState } from "react";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,

  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/app/_components/ui/credenza";
import { Button } from "@/app/_components/ui/button";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,

} from "@/app/_components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AutoComplete,type Option } from "../autocomplete";
import { useParams } from "next/navigation";
import Loading from "../loading";
import { toast } from "sonner";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { UserWithProfile } from "@/types";
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username can't be empty",
  }),
});
const InviteModal = () => {
  const [open, setOpen] = useState(false);
  const { id } = useParams()
  const { data:members,isLoading } = useQuery<{
    data:UserWithProfile[]
  }>({
    queryKey: ['invitationMembers'],
    queryFn: () =>
      fetch(`/api/invitations/members/${id}`).then((res) =>
        res.json(),
      ),
  })
  const queryClient = useQueryClient()

  const { mutateAsync:inviteMember,isLoading:isInviting } = useMutation({
    mutationFn:(payload:{
      recipientId:string,
      clubId:string
    })=>axios.post(`/api/invitations/invite-member`,payload),  
    onSuccess: () => {
      setOpen(false)
      toast.success("Member invited", {
        description: moment().format("LLLL"),
        // action: {
        //   label: "Dismiss",
        //   onClick: () => toast.dismiss(),
        // },
        closeButton: true,
      });
    },
    onSettled:()=>{
      queryClient.invalidateQueries(['invitationMembers'])
    }
  })
  const [value, setValue] = useState<Option>()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });
  async function onSubmit() {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    await inviteMember({
      clubId:id as string,
      recipientId:value?.value as string
    })

  }
  const memberOptions = useMemo(()=>{
    return  members?.data?.map((member)=>{
      return {
        value:member.id,
        label:member.profile?.fullName
      }
    })
  
  },[members]) 

  console.log(members)
  return (
    <Credenza onOpenChange={setOpen} open={open}>
      <CredenzaTrigger asChild>
        <li className="flex cursor-pointer items-center gap-x-2">
          <Plus />
          Invite Members
        </li>
      </CredenzaTrigger>
      <CredenzaContent>
        {(isLoading && !members)? <Loading /> : <>
        <CredenzaHeader>
          <CredenzaTitle className="text-center">Invite members</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody className="space-y-4 pb-4 mt-4 text-center text-sm sm:pb-0 sm:text-left">
          <Form {...form}>
            <form  className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <AutoComplete
                    options={memberOptions as Option[]}
                    emptyMessage="No results."
                    placeholder="Find something"
                    // isLoading={isLoading}
                    onValueChange={setValue}
                    value={value}
                    // disabled={isDisabled}
                  />
                )}
              />
              <Button type="button" onClick={onSubmit} disabled={isInviting}>
                {isInviting ? "Sending..." : "Send"}
              </Button>
            </form>
          </Form>
        </CredenzaBody>
        </>}
        
      </CredenzaContent>
    </Credenza>
  );
};

export default InviteModal;
