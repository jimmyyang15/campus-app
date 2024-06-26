import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { ClubSchemaType } from "@/lib/schemas/club";
import { useFormContext } from "react-hook-form";
import { UserWithProfile } from "@/types";
type Props = {
  mentors: UserWithProfile[];
};
const SelectMentors = ({ mentors }: Props) => {
  const form = useFormContext<ClubSchemaType>();
  return (
    <FormField
      control={form.control}
      name="mentorId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select a mentor</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a mentor" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {mentors.map((mentor, i) => (
                <SelectItem key={i} value={mentor.id}>
                  {mentor.profile?.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
    
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectMentors;
