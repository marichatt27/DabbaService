import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 text-gray-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-black bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
        >
          DabbaService
        </Link>
        <nav className="flex items-center gap-6 font-medium text-gray-600">
          <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
          <Link to="/meals" className="hover:text-orange-600 transition-colors">Menu</Link>
          {user ? (
            <>
              {user.role === "customer" && (
                <Link to="/subscriptions" className="hover:text-orange-600 transition-colors">
                  My Subscriptions
                </Link>
              )}
              {user.role === "provider" && (
                <Link to="/provider-dashboard" className="hover:text-orange-600 transition-colors font-bold text-orange-600">
                  Kitchen Dashboard 🍳
                </Link>
              )}
              <Link to="/profile" className="hover:text-orange-600 transition-colors">Profile</Link>
              <div className="flex items-center gap-3 pl-4 border-l border-orange-100">
                <div className="text-right">
                  <div className="text-xs text-gray-400 capitalize">{user.role}</div>
                  <div className="text-sm font-semibold text-gray-700">{user.name}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-orange-50 hover:bg-orange-100 text-orange-600 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:shadow-sm"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-orange-600 transition-colors">Login</Link>
              <Link
                to="/register"
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02]"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;