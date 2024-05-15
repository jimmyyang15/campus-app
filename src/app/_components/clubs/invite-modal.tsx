import React, { useState } from 'react'
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
import { Button } from '@/app/_components/ui/button';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from '@/app/_components/ui/form';
import { Input } from '@/app/_components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username can't be empty",
    }),
  })
const InviteModal = () => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <Credenza onOpenChange={setOpen} open={open}>
    <CredenzaTrigger asChild>
      <li className='flex items-center gap-x-2 cursor-pointer'>
        <Plus />
        Invite Members
      </li>
    </CredenzaTrigger>
    <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle className="text-center">Invite members</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody className="space-y-4 pb-4 text-center text-sm sm:pb-0 sm:text-left">
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
        
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
        </CredenzaBody>
    </CredenzaContent>
  </Credenza>
  )
}

export default InviteModal