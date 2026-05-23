import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center py-16 md:py-24 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent rounded-[40px] px-6 border border-orange-100/30 shadow-sm relative overflow-hidden mb-16">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-400/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl -z-10"></div>

        <span className="bg-orange-100 text-orange-700 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6 inline-block">
          Fresh, Healthy & Homemade Daily
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-gray-800 tracking-tight leading-none mb-6">
          Community <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Dabba</span> Service
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 font-medium">
          A platform for local home-tiffin kitchens to manage daily subscribers. Healthy home-style meals, customized to your schedule.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/meals"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold px-8 py-4 rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-95 text-base"
          >
            Explore Today's Menu 🍽️
          </Link>
          {!user && (
            <Link
              to="/register"
              className="bg-white hover:bg-gray-50 border border-orange-200 text-orange-600 font-extrabold px-8 py-4 rounded-2xl transition-all shadow-sm text-base"
            >
              Sign Up Now
            </Link>
          )}
          {user && user.role === "provider" && (
            <Link
              to="/provider-dashboard"
              className="bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 font-extrabold px-8 py-4 rounded-2xl transition-all shadow-sm text-base"
            >
              Go to Kitchen Dashboard 🍳
            </Link>
          )}
          {user && user.role === "customer" && (
            <Link
              to="/subscriptions"
              className="bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 font-extrabold px-8 py-4 rounded-2xl transition-all shadow-sm text-base"
            >
              View My Subscriptions 🍱
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="bg-white border border-orange-100/50 p-8 rounded-3xl shadow-md shadow-orange-500/5 transition-all hover:shadow-orange-500/10">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-xl font-extrabold text-gray-800 mb-2">Weekly Subscription</h3>
          <p className="text-sm text-gray-400 font-medium">Subscribe to flexible weekly or monthly schedules.</p>
        </div>
        <div className="bg-white border border-orange-100/50 p-8 rounded-3xl shadow-md shadow-orange-500/5 transition-all hover:shadow-orange-500/10">
          <div className="text-4xl mb-4">🔀</div>
          <h3 className="text-xl font-extrabold text-gray-800 mb-2">Skip a Meal Toggle</h3>
          <p className="text-sm text-gray-400 font-medium">Toggle "Skip" on your subscription calendar to hold delivery instantly.</p>
        </div>
        <div className="bg-white border border-orange-100/50 p-8 rounded-3xl shadow-md shadow-orange-500/5 transition-all hover:shadow-orange-500/10">
          <div className="text-4xl mb-4">📍</div>
          <h3 className="text-xl font-extrabold text-gray-800 mb-2">Address Management</h3>
          <p className="text-sm text-gray-400 font-medium">Easily update your home/office address and save contact details.</p>
        </div>
        <div className="bg-white border border-orange-100/50 p-8 rounded-3xl shadow-md shadow-orange-500/5 transition-all hover:shadow-orange-500/10">
          <div className="text-4xl mb-4">🍳</div>
          <h3 className="text-xl font-extrabold text-gray-800 mb-2">Kitchen Dashboard</h3>
          <p className="text-sm text-gray-400 font-medium">Providers get real-time metrics, prep logs, and subscriber details.</p>
        </div>
      </div>

      <div className="bg-orange-500 text-white rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-orange-500/20">
        <div>
          <h3 className="text-2xl md:text-3xl font-black">Are you a Home Chef?</h3>
          <p className="opacity-90 mt-2 font-medium">Start offering meal subscriptions to your local community today!</p>
        </div>
        <Link
          to="/register"
          className="bg-white text-orange-600 font-extrabold px-6 py-3.5 rounded-2xl shadow-md hover:bg-orange-50 transition-colors whitespace-nowrap"
        >
          Join as Kitchen Provider
        </Link>
      </div>
    </div>
  );
}

export default Home;