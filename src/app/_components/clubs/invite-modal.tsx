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
import { Button } from "@/app/_components/ui/button";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AutoComplete,type Option } from "../autocomplete";
import { UserWithProfile } from "@/types";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import Loading from "../loading";
import { toast } from "sonner";
import moment from "moment";
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username can't be empty",
  }),
});
const InviteModal = () => {
  const [open, setOpen] = useState(false);
  const { id } = useParams()
  const {data,isLoading} = api.club.getInviteMembers.useQuery({
    clubId:id as string
  });
  const utils = api.useUtils();

  const { mutateAsync:inviteMember,isLoading:isInviting } = api.club.inviteMember.useMutation({
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
      utils.club.getInviteMembers.invalidate({
        clubId:id as string
      })
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
  const memberOptions = data?.map((member)=>{
    return {
      value:member.id,
      label:member.profile?.fullName
    }
  })

  console.log(data)
  return (
    <Credenza onOpenChange={setOpen} open={open}>
      <CredenzaTrigger asChild>
        <li className="flex cursor-pointer items-center gap-x-2">
          <Plus />
          Invite Members
        </li>
      </CredenzaTrigger>
      <CredenzaContent>
        {isLoading && !data ? <Loading /> : <>
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
