import React from "react";

const PostCardSkeleton = () => {
  return (
    <div className="bg-white shadow rounded-2xl mb-6 overflow-hidden border border-gray-200 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div className="flex flex-col gap-2">
          <div className="w-24 h-3 bg-gray-300 rounded"></div>
          <div className="w-16 h-2 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3 space-y-2">
        <div className="w-full h-3 bg-gray-300 rounded"></div>
        <div className="w-3/4 h-3 bg-gray-300 rounded"></div>
      </div>

      {/* Image placeholder */}
      <div className="w-full h-64 bg-gray-300"></div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex gap-4">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
        </div>
        <div className="w-12 h-3 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;
