import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = formData;
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setSuccess("");
    setSubmitting(true);

    const result = await register(name, email, password, role);
    setSubmitting(false);

    if (result.success) {
      setSuccess("Account registered successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white border border-orange-100 rounded-3xl shadow-xl shadow-orange-500/5 p-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-gray-500 mt-2">Join the Community Dabba Service today</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-2xl text-sm mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 border border-green-100 px-4 py-3 rounded-2xl text-sm mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="John Doe"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="you@example.com"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">I am a...</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white transition-all"
            >
              <option value="customer">Customer (Order daily meals)</option>
              <option value="provider">Provider (Run a dabba kitchen)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-150 mt-2 disabled:opacity-50"
          >
            {submitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-600 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register; 