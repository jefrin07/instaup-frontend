import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="relative w-12 h-12">
        <div className="animate-spin absolute w-full h-full rounded-full border-4 border-t-blue-500 border-gray-300"></div>
      </div>
    </div>
  );
};

export default Loading;
