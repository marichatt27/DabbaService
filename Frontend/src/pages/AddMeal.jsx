import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../services/api";

function AddMeal() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Lunch",
    image: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.price) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      await api.post("/meals", {
        ...formData,
        price: Number(formData.price),
      });
      navigate("/meals");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add meal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white border border-orange-100 rounded-3xl shadow-xl shadow-orange-500/5 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6 text-white">
          <h1 className="text-2xl font-bold">Add New Dabba</h1>
          <p className="text-sm opacity-90 mt-1">Publish a daily meal menu for subscribers</p>
        </div>

        <div className="p-8">
          {error && <div className="bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-2xl text-sm mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Dabba Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Healthy North Indian Deluxe Thali"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 120"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL (Optional)</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/... or leave blank"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Menu Description *</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="List dishes included: e.g. Roti (3), Rice, Dal Tadka, Paneer Butter Masala..."
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                required
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-orange-50">
              <button type="button" onClick={() => navigate("/meals")} className="bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-3 px-6 rounded-2xl transition-colors text-sm">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-orange-500/20 transition-all text-sm disabled:opacity-50"
              >
                {submitting ? "Publishing..." : "Publish Meal Option"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMeal;