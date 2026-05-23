import { useState, useEffect } from "react";
import { Link } from "react-router";
import api from "../services/api";
function MyOrders() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get("/subscriptions");
        setSubscriptions(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch order history.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);
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
        <h1 className="text-4xl font-extrabold text-gray-800">Order Logs & History</h1>
        <p className="text-gray-500 mt-2">Track past deliveries and active subscription plan records.</p>
      </div>
      {error && <div className="bg-red-50 text-red-600 border border-red-100 p-6 rounded-2xl text-center max-w-md mx-auto my-8">{error}</div>}
      {!error && subscriptions.length === 0 && (
        <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center my-8 max-w-2xl mx-auto">
          <div className="text-5xl mb-4">📜</div>
          <h3 className="text-xl font-bold text-gray-700">No Past Orders Found</h3>
          <p className="text-gray-400 mt-1 mb-6">You don't have any previous subscription orders.</p>
          <Link to="/meals" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold transition-all inline-block">
            Order a Dabba Now
          </Link>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subscriptions.map((sub) => (
          <div key={sub._id} className="bg-white border border-orange-100 rounded-3xl p-6 shadow-md shadow-orange-500/5 hover:shadow-orange-500/10 transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-extrabold text-gray-800 text-lg">{sub.meal?.title || "Standard Meal Plan"}</h3>
                <p className="text-xs text-gray-400 mt-1">Provider: {sub.meal?.provider?.name || "Kitchen Chef"}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                sub.status === "Active" ? "bg-green-50 text-green-700 border border-green-100" :
                sub.status === "Delivered" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                "bg-gray-50 text-gray-700 border border-gray-100"
              }`}>
                {sub.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm border-t border-orange-50/50 pt-4 mt-2">
              <div>
                <span className="text-gray-400 block text-xs">Plan Type</span>
                <span className="font-semibold text-gray-700">{sub.duration} Subscription</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Start Date</span>
                <span className="font-semibold text-gray-700">{new Date(sub.startDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Daily Price</span>
                <span className="font-semibold text-gray-700">₹{sub.meal?.price || 0}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Dates Skipped</span>
                <span className="font-semibold text-red-600">{sub.skippedDates?.length || 0} Days</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default MyOrders;