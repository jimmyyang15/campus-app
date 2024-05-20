"use client";

import { ProfileSchema, ProfileSchemaType } from "@/lib/schemas/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import ProfileAvatar from "./profile-avatar";
import { api } from "@/trpc/react";
import { User } from "lucia";
import { toast } from "sonner";
import { useEdgeStore } from "@/lib/edgestore";
import { Profile } from "@prisma/client";
import moment from "moment";

type Props = {
  user: User | null;
};
const ProfileForm = ({ user }: Props) => {
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState<string | undefined>()
  const { edgestore } = useEdgeStore();

  console.log(file);
  useEffect(() => {
    if (!file) {
        setPreview(undefined)
        return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
}, [file])

  const { isLoading, mutateAsync: updateProfile } =
    api.profile.updateProfile.useMutation({
      onSuccess: () => {
        toast.success("Profile updated", {
          description: moment().format('LLLL'),

          // action: {
          //   label: "Dismiss",
          //   onClick: () => toast.dismiss(),
          // },
          closeButton: true,
        });
      },
    });

  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      fullName: user?.profile.fullName,
      city: user?.profile.city as string,
    },
  });

  async function onSubmit(values: ProfileSchemaType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (file) {
      const res = await edgestore.publicFiles.upload({
        file,
        // onProgressChange: (progress) => {
        //   // you can use this to show a progress bar
        //   console.log(progress);
        // },
        
        options: {
          replaceTargetUrl: user?.profile.profilePicture as string,
        },
      });
      const data = {
        ...values,
        profilePicture:res.url
      }

      await updateProfile(data);

    } else {
      await updateProfile(values);
    }
  }
  return (
    <div>
      <ProfileAvatar
        profile={user?.profile as Profile}
        preview={preview as string}
        setFile={setFile}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            defaultValue={user?.profile.fullName}
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Andrian" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            defaultValue={user?.profile.city as string}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Medan" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            defaultValue={user?.profile.dob as Date}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                    
                      classNames={{
                        caption_label: "flex items-center text-sm font-medium",
                        dropdown: "rdp-dropdown bg-card",
                        dropdown_icon: "ml-2",
                        dropdown_year: "rdp-dropdown_year ml-3",
                        button: "",
                        button_reset: "",
                      }}
                      
                      mode="single"
                      captionLayout="dropdown-buttons"
                      fromYear={1950}
                      toYear={new Date().getFullYear()}
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="text-white" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoading ? "Updating" : "Update Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
