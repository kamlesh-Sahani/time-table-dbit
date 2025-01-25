import React from "react";
import { Loader2 } from "lucide-react";
const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-transparent">
      <Loader2 className="h-16 w-16 animate-spin text-[#4B3F72]" />
    </div>
  );
};

export default Loader;
