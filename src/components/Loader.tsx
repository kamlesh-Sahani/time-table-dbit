import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="flex flex-col items-center">
        <div className="relative flex space-x-2">
          <div className="w-5 h-5 bg-black rounded-full animate-bounce"></div>
          <div className="w-5 h-5 bg-black rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-5 h-5 bg-black rounded-full animate-bounce animation-delay-400"></div>
        </div>
        <p className="mt-6 text-2xl font-bold text-[#4B3F72]">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
