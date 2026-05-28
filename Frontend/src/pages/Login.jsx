import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setSubmitting(true);

    const result = await login(email, password);

    setSubmitting(false);

    if (result.success) {


      try {

        const profileRes = await import("../services/api")
          .then((m) => m.default.get("/auth/me"));

        const role = profileRes.data.role;

        if (role === "admin") {
          navigate("/admin-dashboard");
        } else if (role === "provider") {
          navigate("/provider-dashboard");
        } else {
          navigate("/meals");
        }

      } catch (err) {
        console.log(err);
        navigate("/");
      }

    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-orange-100 rounded-3xl shadow-xl shadow-orange-500/5 p-8">

        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
            Welcome Back
          </h2>

          <p className="text-gray-500 mt-2">
            Log in to manage your daily dabba menu
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-2xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-150 disabled:opacity-50"
          >
            {submitting ? "Logging in..." : "Log In"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-orange-600 font-bold hover:underline"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;