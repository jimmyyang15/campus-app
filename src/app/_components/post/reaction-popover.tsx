import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";

const ReactionPopover = () => {
  return (
    <div>
      <Popover>
        <PopoverTrigger className="text-gray-500 text-sm font-semibold">Reactions</PopoverTrigger>
        <PopoverContent>
        😀👍❤️️🤣🔥</PopoverContent>
      </Popover>
    </div>
  );
};

export default ReactionPopover;
