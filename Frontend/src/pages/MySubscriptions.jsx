import { useState, useEffect } from "react";
import { Link } from "react-router";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function MySubscriptions() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/subscriptions");
      setSubscriptions(response.data);
    } catch (err) {
      console.error(err);
      setError("Could not load subscriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleCancelSubscription = async (subId) => {
    if (!window.confirm("Are you sure you want to cancel this subscription?")) return;
    try {
      await api.delete(`/subscriptions/${subId}`);
      fetchSubscriptions();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel subscription.");
    }
  };

  const handleToggleSkip = async (subId, dateString) => {
    try {
      const response = await api.post(`/subscriptions/${subId}/skip`, { date: dateString });
      setSubscriptions(subscriptions.map(sub => {
        if (sub._id === subId) {
          return {
            ...sub,
            skippedDates: response.data.subscription.skippedDates
          };
        }
        return sub;
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to update skip status.");
    }
  };

  const getNext7Days = () => {
    const days = [];
    const weekdayOptions = { weekday: "short" };
    const dayOptions = { day: "numeric", month: "short" };
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      let label = "";
      if (i === 0) label = "Today";
      else if (i === 1) label = "Tomorrow";
      else label = date.toLocaleDateString("en-US", weekdayOptions);

      const subLabel = date.toLocaleDateString("en-US", dayOptions);
      days.push({ dateString, label, subLabel });
    }
    return days;
  };

  const next7Days = getNext7Days();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">My Subscriptions</h1>
        <p className="text-gray-500 mt-2">Manage your active dabba plans and skip daily meals when you're away.</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 border border-red-100 p-6 rounded-2xl text-center max-w-md mx-auto my-8">{error}</div>}

      {!error && subscriptions.length === 0 && (
        <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center my-8 max-w-2xl mx-auto">
          <div className="text-5xl mb-4">🍱</div>
          <h3 className="text-xl font-bold text-gray-700">No Active Subscriptions</h3>
          <p className="text-gray-400 mt-1 mb-6">You are not subscribed to any daily dabba services.</p>
          <Link to="/meals" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold transition-all inline-block">
            Explore Menu & Subscribe
          </Link>
        </div>
      )}

      <div className="space-y-10">
        {subscriptions.map((sub) => {
          const startDateFormated = new Date(sub.startDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return (
            <div key={sub._id} className="bg-white border border-orange-100 rounded-3xl shadow-xl shadow-orange-500/5 overflow-hidden transition-all hover:shadow-orange-500/10">
              <div className="bg-orange-50/50 px-8 py-6 border-b border-orange-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-md shadow-orange-500/20">🍱</div>
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-800">{sub.meal?.title || "Dabba Plan"}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Subscribed to: <span className="font-semibold">{sub.meal?.provider?.name || "Kitchen Chef"}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-orange-100 text-orange-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">{sub.duration} Plan</span>
                  <span className="bg-green-100 text-green-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">{sub.status}</span>
                  <button onClick={() => handleCancelSubscription(sub._id)} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                    Cancel Plan
                  </button>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Start Date</span>
                    <p className="text-sm font-semibold text-gray-700 mt-1">{startDateFormated}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Price Details</span>
                    <p className="text-sm font-semibold text-gray-700 mt-1">₹{sub.meal?.price || 0} / Day</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivery Location</span>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{user?.address || "No address configured"}</p>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-orange-50/20 border border-orange-100/50 p-6 rounded-3xl space-y-4">
                  <div>
                    <h4 className="font-extrabold text-gray-800 text-base">Skip Delivery Schedule</h4>
                    <p className="text-xs text-gray-400 mt-1">Click on any date to skip its meal delivery. Green means active; Red means skipped.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                    {next7Days.map((day) => {
                      const isSkipped = sub.skippedDates.includes(day.dateString);
                      const isBeforeStartDate = new Date(day.dateString) < new Date(sub.startDate);

                      return (
                        <button
                          key={day.dateString}
                          disabled={isBeforeStartDate}
                          onClick={() => handleToggleSkip(sub._id, day.dateString)}
                          className={`p-3 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                            isBeforeStartDate
                              ? "opacity-30 border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                              : isSkipped
                              ? "border-red-500 bg-red-50 text-red-700 shadow-sm"
                              : "border-green-500 bg-green-50 text-green-700 hover:border-green-600 shadow-sm"
                          }`}
                        >
                          <span className="text-[10px] uppercase font-bold tracking-wider opacity-85">{day.label}</span>
                          <span className="text-sm font-black mt-1">{day.subLabel}</span>
                          <span className="text-[9px] font-bold mt-2 uppercase tracking-wide px-2 py-0.5 rounded-full bg-white border">
                            {isBeforeStartDate ? "Pending" : isSkipped ? "Skipped" : "Active"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MySubscriptions;