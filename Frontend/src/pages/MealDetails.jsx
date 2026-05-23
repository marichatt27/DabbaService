import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
function MealDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Subscription Modal State
  const [showSubModal, setShowSubModal] = useState(false);
  const [submittingSub, setSubmittingSub] = useState(false);
  const [subDuration, setSubDuration] = useState("Weekly");
  const [subStartDate, setSubStartDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0] // Tomorrow's date
  );
  const [subError, setSubError] = useState("");
  useEffect(() => {
    const fetchMeal = async () => {
      try {
        setLoading(true);
        const response = await api.get("/meals");
        const foundMeal = response.data.find((m) => m._id === id);
        if (foundMeal) {
          setMeal(foundMeal);
        } else {
          setError("Meal offering not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Could not load meal details.");
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id]);
  const handleOpenSubscribe = () => {
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
    setShowSubModal(true);
  };
  const handleConfirmSubscribe = async (e) => {
    e.preventDefault();
    setSubError("");
    setSubmittingSub(true);
    try {
      const payload = {
        meal: meal._id,
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
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  if (error || !meal) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="text-gray-500 mt-2">{error || "Something went wrong."}</p>
        <Link to="/meals" className="mt-6 inline-block bg-orange-500 text-white font-bold px-6 py-3 rounded-2xl">
          Back to Menu
        </Link>
      </div>
    );
  }
  const isOwnMeal = user && user.role === "provider" && meal.provider?._id === user._id;
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/meals" className="text-sm font-semibold text-orange-600 hover:underline flex items-center gap-1.5 mb-6">
        ← Back to Menu
      </Link>
      <div className="bg-white border border-orange-100 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        {/* Left Col: Image */}
        <div className="h-80 md:h-full bg-orange-50 rounded-2xl overflow-hidden flex items-center justify-center relative">
          {meal.image ? (
            <img src={meal.image} alt={meal.title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-8">
              <span className="text-8xl">🍛</span>
              <p className="text-sm text-orange-400 mt-4 font-bold uppercase tracking-wider">Premium Box</p>
            </div>
          )}
          <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            {meal.category}
          </span>
        </div>
        {/* Right Col: Details */}
        <div className="flex flex-col justify-between py-2">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-2">{meal.title}</h1>
            <div className="text-2xl font-black text-orange-600 mb-6">
              ₹{meal.price} <span className="text-sm font-medium text-gray-400">/ day</span>
            </div>
            <div className="border-t border-b border-orange-50 py-4 mb-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description / Menu</h3>
              <p className="text-gray-600 text-base leading-relaxed whitespace-pre-wrap">{meal.description}</p>
            </div>
            <div className="space-y-2.5 text-sm mb-8">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Chef Name:</span>
                <span className="font-semibold text-gray-700">{meal.provider?.name || "Kitchen Partner"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Chef Email:</span>
                <span className="text-gray-500">{meal.provider?.email || "N/A"}</span>
              </div>
            </div>
          </div>
          <div>
            {isOwnMeal ? (
              <Link
                to={`/edit-meal/${meal._id}`}
                className="w-full bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold py-3.5 px-4 rounded-2xl block text-center transition-all"
              >
                Edit Meal Details
              </Link>
            ) : (
              <button
                onClick={handleOpenSubscribe}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black py-4 px-6 rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all hover:scale-[1.01]"
              >
                Subscribe Now 🍱
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Subscribe Modal */}
      {showSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-orange-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Subscribe to Dabba</h3>
                <button onClick={() => setShowSubModal(false)} className="text-white hover:text-orange-100 text-xl font-bold">✕</button>
              </div>
              <p className="text-sm opacity-90 mt-1">{meal.title}</p>
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
                  <span className="font-bold text-gray-700">₹{meal.price}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-bold">Estimated Total</span>
                  <span className="text-xl font-black text-orange-600">
                    ₹{subDuration === "Weekly" ? meal.price * 7 : meal.price * 30}
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
export default MealDetails;
