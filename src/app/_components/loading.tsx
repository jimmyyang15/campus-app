import React from "react";
import { Loader } from "lucide-react";
const Loading = () => {
  return (
    <div className="flex justify-center p-4">
      <Loader className="animate-spin text-primary" size={24}/>

    </div>
  );
};

export default Loading;
