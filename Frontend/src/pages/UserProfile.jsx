import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function UserProfile() {
  const { user, updateProfile, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const result = await updateProfile({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
    });
    setSaving(false);

    if (result.success) {
      setSuccess("Profile and delivery details updated successfully!");
    } else {
      setError(result.error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <p className="text-gray-500 mt-2">Please log in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white border border-orange-100 rounded-3xl shadow-xl shadow-orange-500/5 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-8 text-white">
          <h1 className="text-3xl font-extrabold">Delivery Profile</h1>
          <p className="opacity-90 mt-1">Manage your daily delivery address and contact information</p>
        </div>

        <div className="p-8">
          {error && <div className="bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-2xl text-sm mb-6">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 border border-green-100 px-4 py-3 rounded-2xl text-sm mb-6">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address (Verified)</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-100 bg-gray-50 text-gray-400 rounded-2xl cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Account Type</label>
                <div className="w-full px-4 py-3 border border-gray-100 bg-orange-50/50 text-orange-700 font-bold capitalize rounded-2xl">
                  {user.role}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Dabba Delivery Address</label>
              <textarea
                name="address"
                rows="4"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your full home or office address (e.g. House No, Street, Apartment Name, Area, City, Pincode)"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                required
              ></textarea>
              <p className="text-xs text-gray-400 mt-1.5">Our delivery executives will use this address for delivering your subscription.</p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-150 disabled:opacity-50"
              >
                {saving ? "Saving Changes..." : "Save Delivery Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;