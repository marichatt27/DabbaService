import React from "react";
import { Link } from "react-router";
function MealCard({ meal, user, onSubscribe, onDelete }) {
  const isOwnMeal = user && user.role === "provider" && meal.provider?._id === user._id;
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-orange-100/50 shadow-xl shadow-orange-500/5 hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Meal Image */}
      <div className="h-56 bg-orange-50 relative overflow-hidden flex items-center justify-center">
        {meal.image ? (
          <img
            src={meal.image}
            alt={meal.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <span className="text-5xl">🍛</span>
            <p className="text-xs text-orange-400 mt-2 font-bold uppercase tracking-wider">
              Dabba Box
            </p>
          </div>
        )}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-600 uppercase tracking-wider shadow-sm">
          {meal.category}
        </div>
      </div>
      {/* Meal Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-2">
          <Link 
            to={`/meals/${meal._id}`}
            className="text-xl font-extrabold text-gray-800 hover:text-orange-600 transition-colors line-clamp-1"
          >
            {meal.title}
          </Link>
          <div className="text-xl font-black text-orange-600 whitespace-nowrap">
            ₹{meal.price}
            <span className="text-xs font-medium text-gray-400">/day</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">
          {meal.description}
        </p>
        <div className="text-xs text-gray-400 border-t border-orange-50/50 pt-4 mb-5">
          Prepared by: <span className="font-semibold text-gray-600">{meal.provider?.name || "Home Chef"}</span>
        </div>
        {/* Actions */}
        <div className="mt-auto">
          {isOwnMeal ? (
            <div className="grid grid-cols-2 gap-3">
              <Link
                to={`/edit-meal/${meal._id}`}
                className="w-full bg-orange-50 hover:bg-orange-100 text-orange-600 text-center py-3 rounded-xl text-sm font-bold transition-colors"
              >
                Edit Details
              </Link>
              <button
                onClick={() => onDelete(meal._id)}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl text-sm font-bold transition-colors"
              >
                Delete
              </button>
            </div>
          ) : (
            <button
              onClick={() => onSubscribe(meal)}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-4 rounded-2xl shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 transition-all active:scale-95"
            >
              Subscribe
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default MealCard;
