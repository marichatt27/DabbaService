import React from "react";
function SearchBar({ value, onChange, placeholder = "Search for thalis, cuisines or providers..." }) {
  return (
    <div className="relative w-full max-w-lg mb-8 shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <span className="text-gray-400">🔍</span>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3.5 bg-white border border-orange-100 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
      />
    </div>
  );
}
export default SearchBar;
