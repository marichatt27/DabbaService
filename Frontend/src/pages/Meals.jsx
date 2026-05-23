import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Meals() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [showSubModal, setShowSubModal] = useState(false);
  const [submittingSub, setSubmittingSub] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [subDuration, setSubDuration] = useState("Weekly");
  const [subStartDate, setSubStartDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0] // Tomorrow
  );
  const [subError, setSubError] = useState("");

  const categories = ["All", "Breakfast", "Lunch", "Dinner"];

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const response = await api.get("/meals");
      setMeals(response.data);
    } catch (err) {
      console.error(err);
      setError("Could not load meals. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleDeleteMeal = async (mealId) => {
    if (!window.confirm("Are you sure you want to delete this meal item?")) return;
    try {
      await api.delete(`/meals/${mealId}`);
      setMeals(meals.filter((m) => m._id !== mealId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete the meal.");
    }
  };

  const handleOpenSubscribe = (meal) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "customer") {
      alert("Only customers can subscribe to meals.");
      return;
    }
    if (!user.address || !user.phone) {
      alert("Please update your delivery address and phone number in your Profile before subscribing!");
      navigate("/profile");
      return;
    }
    setSelectedMeal(meal);
    setShowSubModal(true);
  };

  const handleConfirmSubscribe = async (e) => {
    e.preventDefault();
    setSubError("");
    setSubmittingSub(true);

    try {
      const payload = {
        meal: selectedMeal._id,
        duration: subDuration,
        startDate: subStartDate,
      };
      await api.post("/subscriptions", payload);
      setShowSubModal(false);
      navigate("/subscriptions");
    } catch (err) {
      console.error(err);
      setSubError(err.response?.data?.message || "Failed to create subscription.");
    } finally {
      setSubmittingSub(false);
    }
  };

  const filteredMeals = selectedCategory === "All"
    ? meals
    : meals.filter((m) => m.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800">Dabba Menu</h1>
          <p className="text-gray-500 mt-2">Explore authentic, freshly cooked meals delivered daily to your doorstep.</p>
        </div>

        {user && user.role === "provider" && (
          <Link
            to="/add-meal"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            + Add New Meal Offer
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-8 bg-orange-100/30 p-2 rounded-2xl max-w-max">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              selectedCategory === cat ? "bg-white text-orange-600 shadow-sm" : "text-gray-600 hover:text-orange-600 hover:bg-orange-50/55"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 text-red-600 border border-red-100 p-6 rounded-2xl text-center max-w-md mx-auto my-8">{error}</div>}

      {!error && filteredMeals.length === 0 && (
        <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center my-8">
          <div className="text-5xl mb-4">🍽️</div>
          <h3 className="text-xl font-bold text-gray-700">No Meals Available</h3>
          <p className="text-gray-400 mt-1">There are no dishes matching this category at the moment.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMeals.map((meal) => {
          const isOwnMeal = user && user.role === "provider" && meal.provider?._id === user._id;

          return (
            <div key={meal._id} className="bg-white rounded-3xl overflow-hidden border border-orange-100/50 shadow-xl shadow-orange-500/5 hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              <div className="h-56 bg-orange-50 relative overflow-hidden flex items-center justify-center">
                {meal.image ? (
                  <img src={meal.image} alt={meal.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <span className="text-5xl">🍛</span>
                    <p className="text-xs text-orange-400 mt-2 font-bold uppercase tracking-wider">Dabba Box</p>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-600 uppercase tracking-wider shadow-sm">
                  {meal.category}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="text-xl font-extrabold text-gray-800 line-clamp-1">{meal.title}</h3>
                  <div className="text-xl font-black text-orange-600 whitespace-nowrap">
                    ₹{meal.price}<span className="text-xs font-medium text-gray-400">/day</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">{meal.description}</p>

                <div className="text-xs text-gray-400 border-t border-orange-50/50 pt-4 mb-5">
                  Prepared by: <span className="font-semibold text-gray-600">{meal.provider?.name || "Home Chef"}</span>
                </div>

                <div className="mt-auto">
                  {isOwnMeal ? (
                    <div className="grid grid-cols-2 gap-3">
                      <Link to={`/edit-meal/${meal._id}`} className="w-full bg-orange-50 hover:bg-orange-100 text-orange-600 text-center py-3 rounded-xl text-sm font-bold transition-colors">
                        Edit Details
                      </Link>
                      <button onClick={() => handleDeleteMeal(meal._id)} className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl text-sm font-bold transition-colors">
                        Delete
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenSubscribe(meal)}
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-4 rounded-2xl shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 transition-all active:scale-95"
                    >
                      Subscribe
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showSubModal && selectedMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-orange-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Subscribe to Dabba</h3>
                <button onClick={() => setShowSubModal(false)} className="text-white hover:text-orange-100 text-xl font-bold">✕</button>
              </div>
              <p className="text-sm opacity-90 mt-1">{selectedMeal.title}</p>
            </div>

            <form onSubmit={handleConfirmSubscribe} className="p-6 space-y-5">
              {subError && <div className="bg-red-50 text-red-600 border border-red-100 px-4 py-2.5 rounded-xl text-sm">{subError}</div>}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subscription Duration</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSubDuration("Weekly")}
                    className={`py-3 rounded-xl border font-bold text-sm transition-all ${
                      subDuration === "Weekly" ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    Weekly Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubDuration("Monthly")}
                    className={`py-3 rounded-xl border font-bold text-sm transition-all ${
                      subDuration === "Monthly" ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    Monthly Plan
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Delivery Start Date</label>
                <input
                  type="date"
                  value={subStartDate}
                  min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                  onChange={(e) => setSubStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium text-gray-700"
                  required
                />
              </div>

              <div className="border-t border-orange-50 pt-4">
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="text-gray-400 font-medium">Daily Cost</span>
                  <span className="font-bold text-gray-700">₹{selectedMeal.price}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-bold">Estimated Total</span>
                  <span className="text-xl font-black text-orange-600">
                    ₹{subDuration === "Weekly" ? selectedMeal.price * 7 : selectedMeal.price * 30}
                    <span className="text-xs font-normal text-gray-400 ml-1">
                      ({subDuration === "Weekly" ? "7 days" : "30 days"})
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowSubModal(false)} className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-3.5 rounded-2xl transition-colors text-sm">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingSub}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-orange-500/20 transition-all text-sm disabled:opacity-50"
                >
                  {submittingSub ? "Subscribing..." : "Confirm & Subscribe"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Meals;