import { useState, useEffect } from "react";
import api from "../services/api";

function ProviderDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [data, setData] = useState({
    date: "",
    mealCounts: { Breakfast: 0, Lunch: 0, Dinner: 0, Total: 0 },
    deliveries: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/subscriptions/kitchen/dashboard?date=${selectedDate}`);
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDate]);

  const handleUpdateStatus = async (subId, newStatus) => {
    try {
      await api.put(`/subscriptions/${subId}`, { status: newStatus });
      alert(`Subscription marked as ${newStatus}!`);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("Failed to update subscription status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800">Kitchen Dashboard</h1>
          <p className="text-gray-500 mt-2">Manage daily meal counts and track subscriber deliveries.</p>
        </div>

        <div className="bg-white border border-orange-100 px-4 py-3 rounded-2xl shadow-sm flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-500">Target Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border-none font-bold text-gray-700 focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 border border-red-100 p-6 rounded-2xl text-center max-w-md mx-auto my-8">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-md shadow-orange-500/5 hover:shadow-orange-500/10 transition-shadow">
              <div className="flex justify-between items-center mb-3">
                <span className="text-3xl">🍳</span>
                <span className="bg-amber-100 text-amber-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Breakfast</span>
              </div>
              <div className="text-3xl font-black text-gray-800">{data.mealCounts.Breakfast}</div>
              <p className="text-xs text-gray-400 mt-2">Meals to prepare today</p>
            </div>

            <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-md shadow-orange-500/5 hover:shadow-orange-500/10 transition-shadow">
              <div className="flex justify-between items-center mb-3">
                <span className="text-3xl">🍛</span>
                <span className="bg-orange-100 text-orange-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Lunch</span>
              </div>
              <div className="text-3xl font-black text-gray-800">{data.mealCounts.Lunch}</div>
              <p className="text-xs text-gray-400 mt-2">Meals to prepare today</p>
            </div>

            <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-md shadow-orange-500/5 hover:shadow-orange-500/10 transition-shadow">
              <div className="flex justify-between items-center mb-3">
                <span className="text-3xl">🍜</span>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Dinner</span>
              </div>
              <div className="text-3xl font-black text-gray-800">{data.mealCounts.Dinner}</div>
              <p className="text-xs text-gray-400 mt-2">Meals to prepare today</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-6 shadow-xl shadow-orange-500/10 text-white">
              <div className="flex justify-between items-center mb-3">
                <span className="text-3xl">📦</span>
                <span className="bg-white/20 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Total</span>
              </div>
              <div className="text-4xl font-black">{data.mealCounts.Total}</div>
              <p className="text-xs opacity-90 mt-2">Total daily dabbas to prep</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
              <span>Delivery Log</span>
              <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2.5 py-1 rounded-full">{data.deliveries.length} Subscribers</span>
            </h2>

            {data.deliveries.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center max-w-2xl mx-auto">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-xl font-bold text-gray-700">No Deliveries Today</h3>
                <p className="text-gray-400 mt-1">Either there are no active subscriptions, or all users have skipped delivery for this date.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.deliveries.map((delivery) => (
                  <div key={delivery._id} className="bg-white border border-orange-100/50 rounded-3xl p-6 shadow-md shadow-orange-500/5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4 gap-2">
                        <div>
                          <h4 className="font-extrabold text-gray-800 text-lg">{delivery.user?.name || "Customer"}</h4>
                          <p className="text-xs text-gray-400 mt-0.5">{delivery.user?.email}</p>
                        </div>
                        <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                          delivery.meal?.category === "Breakfast" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                          delivery.meal?.category === "Lunch" ? "bg-orange-50 text-orange-600 border border-orange-100" :
                          "bg-indigo-50 text-indigo-600 border border-indigo-100"
                        }`}>
                          {delivery.meal?.category}
                        </span>
                      </div>

                      <div className="space-y-3 mb-6 text-sm border-t border-orange-50/50 pt-4">
                        <div className="flex items-start gap-2.5">
                          <span className="text-gray-400">Meal:</span>
                          <span className="font-bold text-gray-700">{delivery.meal?.title || "Standard Dabba"}</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="text-gray-400">Phone:</span>
                          <a href={`tel:${delivery.user?.phone}`} className="font-bold text-orange-600 hover:underline">{delivery.user?.phone || "No phone updated"}</a>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="text-gray-400 shrink-0">Address:</span>
                          <span className="text-gray-500 text-xs">{delivery.user?.address || "No delivery address updated"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 border-t border-orange-50/50 pt-4 mt-auto">
                      <button onClick={() => handleUpdateStatus(delivery._id, "Delivered")} className="w-full bg-green-50 hover:bg-green-100 text-green-700 py-3 rounded-xl text-xs font-bold transition-all">
                        ✓ Delivered
                      </button>
                      <button onClick={() => handleUpdateStatus(delivery._id, "Paused")} className="w-full bg-yellow-50 hover:bg-yellow-100 text-yellow-700 py-3 rounded-xl text-xs font-bold transition-all">
                        ‖ Pause Plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ProviderDashboard;