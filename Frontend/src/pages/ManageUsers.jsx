import { useEffect, useState } from "react";
import api from "../services/api";

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    // FETCH USERS
    const fetchUsers = async () => {
        try {
            const res = await api.get("/auth/admin/users");

            setUsers(res.data);
            setFilteredUsers(res.data);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // SEARCH + FILTER
    useEffect(() => {

        let updated = [...users];

        // SEARCH
        if (search.trim()) {
            updated = updated.filter((user) =>
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
            );
        }

        // FILTER
        if (filter === "active") {
            updated = updated.filter((user) => user.isActive);
        }

        if (filter === "blocked") {
            updated = updated.filter((user) => !user.isActive);
        }

        setFilteredUsers(updated);

    }, [search, filter, users]);

    // BLOCK / ACTIVATE
    const handleToggleUser = async (id, isActive) => {
        try {

            await api.put(`/auth/admin/users/${id}`, {
                isActive: !isActive,
            });

            fetchUsers();

        } catch (err) {
            console.log(err);
            alert("Failed to update user.");
        }
    };

    // DELETE USER
    const handleDeleteUser = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/auth/admin/users/${id}`);

            fetchUsers();

        } catch (err) {
            console.log(err);
            alert("Failed to delete user.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            {/* HEADER */}
            <div className="mb-10">
                <h1 className="text-5xl font-extrabold text-gray-800">
                    Manage Users
                </h1>

                <p className="text-gray-500 mt-3 text-lg">
                    Control customer accounts and monitor platform users.
                </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* TOTAL */}
                <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-md shadow-orange-500/5">
                    <div className="flex justify-between items-center mb-3">
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

                {/* ACTIVE */}
                <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-md shadow-orange-500/5">
                    <div className="flex justify-between items-center mb-3">
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

                {/* BLOCKED */}
                <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-6 shadow-xl shadow-orange-500/10 text-white">
                    <div className="flex justify-between items-center mb-3">
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

            {/* SEARCH + FILTER */}
            <div className="bg-white border border-orange-100 rounded-3xl p-5 mb-8 shadow-md shadow-orange-500/5 flex flex-col md:flex-row gap-4 justify-between">

                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-96 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none"
                >
                    <option value="all">All Users</option>
                    <option value="active">Active Users</option>
                    <option value="blocked">Blocked Users</option>
                </select>
            </div>

            {/* USERS TABLE */}
            <div className="bg-white border border-orange-100 rounded-3xl overflow-hidden shadow-md shadow-orange-500/5">

                {/* TABLE HEADER */}
                <div className="grid grid-cols-12 gap-4 px-6 py-5 bg-orange-50 border-b border-orange-100 text-sm font-extrabold text-gray-700 uppercase tracking-wider">

                    <div className="col-span-3">User</div>

                    <div className="col-span-3">Email</div>

                    <div className="col-span-2">Phone</div>

                    <div className="col-span-1">Role</div>

                    <div className="col-span-1">Status</div>

                    <div className="col-span-2 text-center">Actions</div>
                </div>

                {loading ? (

                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                    </div>

                ) : filteredUsers.length === 0 ? (

                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">📭</div>

                        <h3 className="text-2xl font-bold text-gray-700">
                            No Users Found
                        </h3>

                        <p className="text-gray-400 mt-2">
                            No matching users available.
                        </p>
                    </div>

                ) : (

                    filteredUsers.map((user) => (
                        <div
                            key={user._id}
                            className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-orange-50 items-center hover:bg-orange-50/40 transition-all"
                        >

                            {/* USER */}
                            <div className="col-span-3">
                                <h3 className="font-bold text-gray-800">
                                    {user.name}
                                </h3>
                            </div>

                            {/* EMAIL */}
                            <div className="col-span-3 text-gray-500 text-sm">
                                {user.email}
                            </div>

                            {/* PHONE */}
                            <div className="col-span-2 text-gray-700 text-sm">
                                <span className={user.phone ? "" : "text-gray-400 italic"}>
                                    {user.phone || "Not Added"}
                                </span>
                            </div>

                            {/* ROLE */}
                            <div className="col-span-1">
                                <span className="capitalize text-sm font-semibold text-gray-700">
                                    {user.role}
                                </span>
                            </div>

                            {/* STATUS */}
                            <div className="col-span-1">
                                <span
                                    className={`text-xs font-bold px-3 py-1 rounded-full ${user.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {user.isActive ? "Active" : "Blocked"}
                                </span>
                            </div>

                            /* ACTIONS */
                            <div className="col-span-2 flex gap-2 justify-center">

                                {user.role !== "admin" ? (
                                    <>
                                        <button
                                            onClick={() =>
                                                handleToggleUser(user._id, user.isActive)
                                            }
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${user.isActive
                                                    ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-700"
                                                    : "bg-green-50 hover:bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {user.isActive ? "Block" : "Activate"}
                                        </button>

                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            className="px-4 py-2 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 transition-all"
                                        >
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-4 py-2 rounded-xl">
                                        Protected Admin
                                    </span>
                                )}

                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ManageUsers;