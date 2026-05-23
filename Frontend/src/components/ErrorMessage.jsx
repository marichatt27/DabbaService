import React from "react";
function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="bg-red-50 text-red-700 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium my-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
      <span className="text-lg">⚠️</span>
      <div className="flex-1">{message}</div>
    </div>
  );
}
export default ErrorMessage;
