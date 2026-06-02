import { useEffect, useState } from "react";
import api from "../services/api";

function ManageSubscriptions() {

    const [subscriptions, setSubscriptions] = useState([]);
    const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    // FETCH SUBSCRIPTIONS
    const fetchSubscriptions = async () => {

        try {

            // REPLACE WITH YOUR API
            const res = await api.get("/subscriptions");
            console.log(res.data);
            setSubscriptions(res.data);
            setFilteredSubscriptions(res.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    // SEARCH + FILTER
    useEffect(() => {

        let updatedSubscriptions = [...subscriptions];

        // SEARCH
        if (search.trim()) {

            updatedSubscriptions = updatedSubscriptions.filter((sub) =>
                sub.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
                sub.plan?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // FILTER
        if (filter !== "all") {

            updatedSubscriptions = updatedSubscriptions.filter(
                (sub) => sub.status === filter
            );
        }

        setFilteredSubscriptions(updatedSubscriptions);

    }, [search, filter, subscriptions]);

    // DELETE SUBSCRIPTION
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this subscription?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/subscriptions/${id}`);

            fetchSubscriptions();

        } catch (err) {

            console.log(err);
            alert("Failed to delete subscription.");
        }
    };

    // TOGGLE STATUS
    const toggleSubscriptionStatus = async (id, currentStatus) => {

        try {

            const newStatus =
                currentStatus === "Active"
                    ? "Paused"
                    : "Active";

            await api.put(`/subscriptions/${id}`, {
                status: newStatus,
            });

            fetchSubscriptions();

        } catch (err) {

            console.log(err);
            alert("Failed to update subscription status.");
        }
    };

    return (

        <div className="max-w-7xl mx-auto px-4 py-8">

            {/* HEADER */}
            <div className="mb-10">

                <h1 className="text-5xl font-extrabold text-gray-800">
                    Manage Subscriptions
                </h1>

                <p className="text-gray-500 mt-3 text-lg">
                    Control all subscriptions and user plans.
                </p>

            </div>

            {/* TOP STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* TOTAL */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition relative overflow-hidden">

                    <div className="flex justify-between items-start">

                        <div>

                            <p className="text-gray-500 text-sm">
                                Total Subscriptions
                            </p>

                            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">
                                {subscriptions.length}
                            </h2>

                            <p className="text-gray-400 text-sm mt-1">
                                Total active plans
                            </p>

                        </div>

                        <div className="text-3xl bg-orange-50 text-orange-600 px-3 py-2 rounded-2xl">
                            📦
                        </div>

                    </div>

                </div>

                {/* ACTIVE */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-green-100 hover:shadow-md transition relative overflow-hidden">

                    <div className="flex justify-between items-start">

                        <div>

                            <p className="text-gray-500 text-sm">
                                Active Plans
                            </p>

                            <h2 className="text-4xl font-extrabold text-green-600 mt-2">
                                {
                                    subscriptions.filter(
                                        (sub) => (sub.status || "Active") === "Active"
                                    ).length
                                }
                            </h2>

                            <p className="text-gray-400 text-sm mt-1">
                                Currently active
                            </p>

                        </div>

                        <div className="text-3xl bg-green-50 text-green-600 px-3 py-2 rounded-2xl">
                            ✅
                        </div>

                    </div>

                </div>

                {/* BLOCKED */}
                <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-6 shadow-xl shadow-orange-500/10 text-white">

                    <div className="flex justify-between items-start">

                        <div>

                            <p className="text-white text-sm">
                                Blocked Plans
                            </p>

                            <h2 className="text-4xl font-extrabold text-white mt-2">
                                {
                                    subscriptions.filter(
                                        (sub) => (sub.status || "Active") === "Blocked"
                                    ).length
                                }
                            </h2>

                            <p className="text-white text-sm mt-1">
                                Currently unavailable
                            </p>

                        </div>

                        <div className="text-3xl bg-red-50 text-red-600 px-3 py-2 rounded-2xl">
                            🚫
                        </div>

                    </div>

                </div>

            </div>

            {/* SEARCH + FILTER */}
            <div className="bg-white border border-orange-100 rounded-3xl p-5 mb-8 shadow-md shadow-orange-500/5 flex flex-col md:flex-row gap-4 justify-between">

                {/* SEARCH */}
                <input
                    type="text"
                    placeholder="Search subscriptions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-96 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />

                {/* FILTER */}
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none"
                >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
<option value="Cancelled">Cancelled</option>
<option value="Delivered">Delivered</option>
                </select>

            </div>

            {/* TABLE */}
            <div className="bg-white border border-orange-100 rounded-3xl overflow-hidden shadow-md shadow-orange-500/5">

                {/* HEADER */}
                <div className="grid grid-cols-12 gap-4 px-6 py-5 bg-orange-50 border-b border-orange-100 text-sm font-extrabold text-gray-700 uppercase tracking-wider">

                    <div className="col-span-3">
                        User
                    </div>

                    <div className="col-span-2">
                        Provider
                    </div>

                    <div className="col-span-2">
                        Plan
                    </div>

                    <div className="col-span-2">
                        Amount
                    </div>

                    <div className="col-span-1">
                        Status
                    </div>

                    <div className="col-span-2 text-center">
                        Actions
                    </div>

                </div>

                {/* LOADING */}
                {loading ? (

                    <div className="flex justify-center items-center py-20">

                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>

                    </div>

                ) : filteredSubscriptions.length === 0 ? (

                    <div className="text-center py-20">

                        <div className="text-5xl mb-4">
                            📭
                        </div>

                        <h3 className="text-2xl font-bold text-gray-700">
                            No Subscriptions Found
                        </h3>

                        <p className="text-gray-400 mt-2">
                            No subscriptions available right now.
                        </p>

                    </div>

                ) : (

                    filteredSubscriptions.map((sub) => (

                        <div
                            key={sub._id}
                            className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-orange-50 items-center hover:bg-orange-50/40 transition-all"
                        >

                            {/* USER */}
                            <div className="col-span-3">

                                <h3 className="font-bold text-gray-800">
                                    {sub.user?.name || "Unknown User"}
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    {sub.user?.email}
                                </p>

                            </div>

                            {/* PROVIDER */}
                            <div className="col-span-2 text-sm text-gray-600">

                                {sub.meal?.provider?.name || "Unknown"}
                            </div>

                            {/* PLAN */}
                            <div className="col-span-2">

                                <p className="font-semibold text-gray-700">
                                    {sub.meal?.title}
                                </p>

                                <p className="text-sm text-gray-400">
                                    {sub.duration || "Monthly"}
                                </p>

                            </div>

                            {/* AMOUNT */}
                            <div className="col-span-2 font-bold text-orange-600">

                                ₹{sub.meal?.price || 0}

                            </div>

                            {/* STATUS */}
                            <div className="col-span-1">

                                <span
                                    className={`text-xs font-bold px-3 py-1 rounded-full

                                    ${(sub.status || "Active") === "Active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {sub.status || "Active"}
                                </span>

                            </div>

                            {/* ACTIONS */}
                            <div className="col-span-2 flex gap-2 justify-center border-l border-gray-300 pl-3">

                                {/* STATUS TOGGLE */}
                                <button
                                    onClick={() =>
                                        toggleSubscriptionStatus(
                                            sub._id,
                                            sub.status || "Active"
                                        )
                                    }
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all

                                    ${(sub.status || "Active") === "Active"
                                            ? "bg-green-100 hover:bg-green-200 text-green-700"
                                            : "bg-red-100 hover:bg-red-200 text-red-700"
                                        }`}
                                >
                                    {sub.status || "Active"}
                                </button>

                                {/* DELETE */}
                                <button
                                    onClick={() =>
                                        handleDelete(sub._id)
                                    }
                                    className="px-4 py-2 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 transition-all"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    ))
                )}

            </div>

        </div>
    );
}

export default ManageSubscriptions;