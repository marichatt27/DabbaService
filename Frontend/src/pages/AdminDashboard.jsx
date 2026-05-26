import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProviders: 0,
        totalAdmins: 0,
    });

    useEffect(() => {

        const fetchStats = async () => {

            try {

                const res = await api.get("/auth/admin/stats");

                setStats(res.data);
                console.log(res.data);

            } catch (err) {

                console.log(err);
            }
        };

        fetchStats();

    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            {/* HEADER */}
            <div className="mb-10">
                <h1 className="text-5xl font-extrabold text-gray-800">
                    Dashboard
                </h1>

                <p className="text-gray-500 mt-3 text-lg">
                    Control and monitor your Dabba Service platform.
                </p>
            </div>

            {/* TOP STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* USERS */}
                <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-md shadow-orange-500/5 hover:shadow-orange-500/10 transition-all">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-4xl">👥</span>

                        <span className="bg-blue-100 text-blue-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                            Users
                        </span>
                    </div>

                    <h2 className="text-4xl font-black text-gray-800">
                        {stats.totalUsers}
                    </h2>

                    <p className="text-gray-400 mt-2 text-sm">
                        Registered customers
                    </p>
                </div>

                {/* PROVIDERS */}
                <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-md shadow-orange-500/5 hover:shadow-orange-500/10 transition-all">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-4xl">👨‍🍳</span>

                        <span className="bg-orange-100 text-orange-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                            Providers
                        </span>
                    </div>

                    <h2 className="text-4xl font-black text-gray-800">
                        {stats.totalProviders}
                    </h2>

                    <p className="text-gray-400 mt-2 text-sm">
                        Active kitchen partners
                    </p>
                </div>

                {/* ADMINS */}
                <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-md shadow-orange-500/5 hover:shadow-orange-500/10 transition-all">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-4xl">🛡️</span>

                        <span className="bg-purple-100 text-purple-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                            Admins
                        </span>
                    </div>

                    <h2 className="text-4xl font-black text-gray-800">
                        {stats.totalAdmins}
                    </h2>

                    <p className="text-gray-400 mt-2 text-sm">
                        Platform administrators
                    </p>
                </div>

                {/* PLATFORM */}
                <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-6 shadow-xl shadow-orange-500/10 text-white">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-4xl">📦</span>

                        <span className="bg-white/20 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                            Platform
                        </span>
                    </div>

                    <h2 className="text-4xl font-black">
                        {stats.totalUsers + stats.totalProviders + stats.totalAdmins}
                    </h2>

                    <p className="text-sm opacity-90 mt-2">
                        Total registered accounts
                    </p>
                </div>
            </div>

            {/* MANAGEMENT */}
            <div>

                <h2 className="text-3xl font-extrabold text-gray-800 mb-8">
                    Management Controls
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                    {/* USERS */}
                    <Link
                        to="/manage-users"
                        className="bg-white border border-orange-100 rounded-3xl p-8 shadow-md shadow-orange-500/5 hover:-translate-y-1 hover:shadow-orange-500/10 transition-all"
                    >
                        <div className="text-5xl mb-5">👥</div>

                        <h3 className="text-2xl font-extrabold text-gray-800 mb-3">
                            Manage Users
                        </h3>

                        <p className="text-gray-500 leading-relaxed">
                            View all users, monitor accounts and manage platform activity.
                        </p>

                        <div className="mt-6 text-orange-600 font-bold">
                            Open Panel →
                        </div>
                    </Link>

                    {/* PROVIDERS */}
                    <Link
                        to="/manage-providers"
                        className="bg-white border border-orange-100 rounded-3xl p-8 shadow-md shadow-orange-500/5 hover:-translate-y-1 hover:shadow-orange-500/10 transition-all"
                    >
                        <div className="text-5xl mb-5">👨‍🍳</div>

                        <h3 className="text-2xl font-extrabold text-gray-800 mb-3">
                            Manage Providers
                        </h3>

                        <p className="text-gray-500 leading-relaxed">
                            Review kitchen providers and manage their permissions.
                        </p>

                        <div className="mt-6 text-orange-600 font-bold">
                            Open Panel →
                        </div>
                    </Link>

                    {/* MEALS */}
                    <Link
                        to="/manage-meals"
                        className="bg-white border border-orange-100 rounded-3xl p-8 shadow-md shadow-orange-500/5 hover:-translate-y-1 hover:shadow-orange-500/10 transition-all"
                    >
                        <div className="text-5xl mb-5">🍱</div>

                        <h3 className="text-2xl font-extrabold text-gray-800 mb-3">
                            Manage Meals
                        </h3>

                        <p className="text-gray-500 leading-relaxed">
                            Edit meals, remove listings and control menu visibility.
                        </p>

                        <div className="mt-6 text-orange-600 font-bold">
                            Open Panel →
                        </div>
                    </Link>
                    {/* MANAGE SUBSCRIPTIONS */}
                    <Link
                        to="/manage-subscriptions"
                        className="bg-white border border-orange-100 rounded-3xl p-8 shadow-md shadow-orange-500/5 hover:-translate-y-1 hover:shadow-orange-500/10 transition-all"
                    >
                        <div className="text-5xl mb-5">📦</div>

                        <h3 className="text-2xl font-extrabold text-gray-800 mb-3">
                            Manage Subscriptions
                        </h3>

                        <p className="text-gray-500 leading-relaxed">
                            View all customer plans, monitor active subscriptions and control delivery statuses.
                        </p>

                        <div className="mt-6 text-orange-600 font-bold">
                            Open Panel →
                        </div>
                    </Link>

                </div>
            </div>
            {/* PLATFORM STATUS */}
            <div className="mt-12 bg-white border border-orange-100 rounded-3xl p-8 shadow-md shadow-orange-500/5">

                <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">📊</span>

                    <h2 className="text-3xl font-extrabold text-gray-800">
                        Platform Status
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* DAILY USERS */}
                    <div className="bg-orange-50 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                            Total Customers
                        </h3>

                        <p className="text-4xl font-black text-orange-600">
                            {stats.totalUsers}
                        </p>
                    </div>

                    {/* PROVIDERS */}
                    <div className="bg-green-50 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                            Active Kitchens
                        </h3>

                        <p className="text-4xl font-black text-green-600">
                            {stats.totalProviders}
                        </p>
                    </div>

                    {/* ADMINS */}
                    <div className="bg-blue-50 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                            Platform Admins
                        </h3>

                        <p className="text-4xl font-black text-blue-600">
                            {stats.totalAdmins}
                        </p>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default AdminDashboard;