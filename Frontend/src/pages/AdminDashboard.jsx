import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-orange-50 flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">

        <h2 className="text-3xl font-extrabold text-orange-400 mb-10">
          Admin Panel
        </h2>

        <nav className="space-y-4">

          <Link
            to="/admin-dashboard"
            className="block px-4 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/manage-users"
            className="block px-4 py-3 rounded-xl hover:bg-slate-800 transition"
          >
            Manage Users
          </Link>

          <Link
            to="/manage-providers"
            className="block px-4 py-3 rounded-xl hover:bg-slate-800 transition"
          >
            Manage Providers
          </Link>

          <Link
            to="/manage-meals"
            className="block px-4 py-3 rounded-xl hover:bg-slate-800 transition"
          >
            Manage Meals
          </Link>

        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-4xl font-extrabold text-slate-800">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your Dabba Service platform
          </p>

        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-3xl shadow-md p-6 hover:shadow-xl transition">
            <p className="text-gray-500 text-sm">
              Total Users
            </p>

            <h2 className="text-4xl font-bold mt-3 text-orange-500">
              120
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-6 hover:shadow-xl transition">
            <p className="text-gray-500 text-sm">
              Providers
            </p>

            <h2 className="text-4xl font-bold mt-3 text-orange-500">
              18
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-6 hover:shadow-xl transition">
            <p className="text-gray-500 text-sm">
              Meals
            </p>

            <h2 className="text-4xl font-bold mt-3 text-orange-500">
              52
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-6 hover:shadow-xl transition">
            <p className="text-gray-500 text-sm">
              Subscriptions
            </p>

            <h2 className="text-4xl font-bold mt-3 text-orange-500">
              87
            </h2>
          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="mb-10">

          <h2 className="text-2xl font-bold text-slate-800 mb-5">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <Link
              to="/manage-users"
              className="bg-white rounded-3xl shadow-md p-6 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold mb-2 text-orange-500">
                Manage Users
              </h3>

              <p className="text-gray-500">
                View and manage all platform users
              </p>
            </Link>

            <Link
              to="/manage-providers"
              className="bg-white rounded-3xl shadow-md p-6 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold mb-2 text-orange-500">
                Manage Providers
              </h3>

              <p className="text-gray-500">
                Approve or suspend providers
              </p>
            </Link>

            <Link
              to="/manage-meals"
              className="bg-white rounded-3xl shadow-md p-6 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold mb-2 text-orange-500">
                Manage Meals
              </h3>

              <p className="text-gray-500">
                Edit or remove meals
              </p>
            </Link>

          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white rounded-3xl shadow-md p-6">

          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Recent Activity
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between items-center border-b pb-3">
              <p className="text-gray-700">
                New provider registered
              </p>

              <span className="text-sm text-gray-400">
                2 mins ago
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-3">
              <p className="text-gray-700">
                User subscribed to monthly plan
              </p>

              <span className="text-sm text-gray-400">
                10 mins ago
              </span>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-gray-700">
                Meal updated by provider
              </p>

              <span className="text-sm text-gray-400">
                25 mins ago
              </span>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;