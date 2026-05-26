import { useEffect, useState } from "react";
import api from "../services/api";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-5xl font-extrabold text-gray-800">
          Manage Users
        </h1>

        <p className="text-gray-500 mt-3 text-lg">
          View and manage all registered users on the platform.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-md shadow-orange-500/5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-4xl">👥</span>

            <span className="bg-blue-100 text-blue-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
              Total
            </span>
          </div>

          <h2 className="text-4xl font-black text-gray-800">
            {users.length}
          </h2>

          <p className="text-gray-400 mt-2 text-sm">
            Registered users
          </p>
        </div>

        <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-md shadow-orange-500/5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-4xl">✅</span>

            <span className="bg-green-100 text-green-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
              Active
            </span>
          </div>

          <h2 className="text-4xl font-black text-gray-800">
            {users.filter((u) => u.isActive).length}
          </h2>

          <p className="text-gray-400 mt-2 text-sm">
            Active accounts
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-6 shadow-xl shadow-orange-500/10 text-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-4xl">🚫</span>

            <span className="bg-white/20 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase">
              Blocked
            </span>
          </div>

          <h2 className="text-4xl font-black">
            {users.filter((u) => !u.isActive).length}
          </h2>

          <p className="text-sm opacity-90 mt-2">
            Blocked accounts
          </p>
        </div>
      </div>

      {/* USERS LIST */}
      <div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center gap-3">
          <span>Users List</span>

          <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
            {users.length} Users
          </span>
        </h2>

        {loading ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-12 text-center">
            <div className="text-5xl mb-4">📭</div>

            <h3 className="text-2xl font-bold text-gray-700">
              No Users Found
            </h3>

            <p className="text-gray-400 mt-2">
              There are no registered users yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white border border-orange-100 rounded-3xl p-6 shadow-md shadow-orange-500/5"
              >

                <div className="flex justify-between items-start mb-5">

                  <div>
                    <h3 className="text-2xl font-extrabold text-gray-800">
                      {user.name}
                    </h3>

                    <p className="text-gray-400 text-sm mt-1">
                      {user.email}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      user.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isActive ? "Active" : "Blocked"}
                  </span>
                </div>

                <div className="space-y-3 text-sm mb-6">

                  <div className="flex justify-between">
                    <span className="text-gray-400">Phone</span>

                    <span className="font-semibold text-gray-700">
                      {user.phone || "Not Added"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Role</span>

                    <span className="font-semibold text-gray-700 capitalize">
                      {user.role}
                    </span>
                  </div>

                </div>

                <div className="flex gap-3">

                  <button
                    className={`w-full py-3 rounded-2xl text-sm font-bold transition-all ${
                      user.isActive
                        ? "bg-red-50 hover:bg-red-100 text-red-600"
                        : "bg-green-50 hover:bg-green-100 text-green-600"
                    }`}
                  >
                    {user.isActive ? "Block User" : "Activate User"}
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;