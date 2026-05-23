import React from "react";
function Loading() {
  return (
    <div className="flex flex-col justify-center items-center py-12 gap-3 min-h-[40vh]">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-orange-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-semibold text-gray-500 animate-pulse">Loading menus...</p>
    </div>
  );
}
export default Loading;