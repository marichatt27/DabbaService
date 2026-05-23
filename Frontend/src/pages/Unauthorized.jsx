import React from "react";
import { Link } from "react-router";
function Unauthorized() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-6">🚫</div>
      <h1 className="text-4xl font-black text-gray-800 tracking-tight mb-3">Access Denied</h1>
      <p className="text-lg text-gray-500 max-w-md mb-8">
        You do not have the necessary permissions to access this page. If you believe this is an error, please log in with a different account.
      </p>
      <div className="flex gap-4">
        <Link
          to="/"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-md"
        >
          Go Home
        </Link>
        <Link
          to="/login"
          className="bg-white border border-orange-200 text-orange-600 font-bold px-6 py-3 rounded-2xl transition-all shadow-sm"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
export default Unauthorized;
