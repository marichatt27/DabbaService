import { useEffect, useState } from "react";
import api from "../services/api";

function ManageProviders() {
    const [providers, setProviders] = useState([]);
    const [filteredProviders, setFilteredProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    // FETCH PROVIDERS
    const fetchProviders = async () => {
        try {
            const res = await api.get("/auth/admin/providers");

            setProviders(res.data);
            setFilteredProviders(res.data);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProviders();
    }, []);

    // SEARCH + FILTER
    useEffect(() => {
        let updated = [...providers];

        if (search.trim()) {
            updated = updated.filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.email.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (filter === "active") {
            updated = updated.filter((p) => p.isActive);
        }

        if (filter === "blocked") {
            updated = updated.filter((p) => !p.isActive);
        }

        setFilteredProviders(updated);

    }, [search, filter, providers]);

    // TOGGLE PROVIDER STATUS
    const handleToggleProvider = async (id, isActive) => {
        try {
            await api.put(`/auth/admin/providers/${id}`, {
                isActive: !isActive,
            });

            fetchProviders();
        } catch (err) {
            console.log(err);
            alert("Failed to update provider.");
        }
    };

    // DELETE PROVIDER
    const handleDeleteProvider = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this provider?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/auth/admin/providers/${id}`);
            fetchProviders();
        } catch (err) {
            console.log(err);
            alert("Failed to delete provider.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            {/* HEADER */}
            <div className="mb-10">
                <h1 className="text-5xl font-extrabold text-gray-800">
                    Manage Providers
                </h1>

                <p className="text-gray-500 mt-3 text-lg">
                    Control dabba providers and their meal services.
                </p>
            </div>
            {/* TOP STATS CARDS */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

    {/* TOTAL */}
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition relative overflow-hidden">

        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500 text-sm">Total Providers</p>
                <h2 className="text-4xl font-extrabold text-gray-900 mt-2">
                    {providers.length}
                </h2>
                <p className="text-gray-400 text-sm mt-1">Registered providers</p>
            </div>

            <div className="text-3xl bg-blue-50 text-blue-600 px-3 py-2 rounded-2xl">
                👥
            </div>
        </div>

    </div>

    {/* ACTIVE */}
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-green-100 hover:shadow-md transition relative overflow-hidden">

        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500 text-sm">Active Providers</p>
                <h2 className="text-4xl font-extrabold text-green-600 mt-2">
                    {providers.filter(p => p.isActive).length}
                </h2>
                <p className="text-gray-400 text-sm mt-1">Active accounts</p>
            </div>

            <div className="text-3xl bg-green-50 text-green-600 px-3 py-2 rounded-2xl">
                ✅
            </div>
        </div>

    </div>

    {/* BLOCKED */}
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-red-100 hover:shadow-md transition relative overflow-hidden">

        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500 text-sm">Blocked Providers</p>
                <h2 className="text-4xl font-extrabold text-red-600 mt-2">
                    {providers.filter(p => !p.isActive).length}
                </h2>
                <p className="text-gray-400 text-sm mt-1">Blocked accounts</p>
            </div>

            <div className="text-3xl bg-red-50 text-red-600 px-3 py-2 rounded-2xl">
                🚫
            </div>
        </div>

    </div>

</div>

            {/* SEARCH + FILTER */}
            <div className="bg-white border border-orange-100 rounded-3xl p-5 mb-8 shadow-md shadow-orange-500/5 flex flex-col md:flex-row gap-4 justify-between">

                <input
                    type="text"
                    placeholder="Search providers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-96 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none"
                >
                    <option value="all">All Providers</option>
                    <option value="active">Active Providers</option>
                    <option value="blocked">Blocked Providers</option>
                </select>
            </div>

            {/* TABLE */}
            <div className="bg-white border border-orange-100 rounded-3xl overflow-hidden shadow-md shadow-orange-500/5">

                {/* HEADER */}
                <div className="grid grid-cols-12 gap-4 px-6 py-5 bg-orange-50 border-b border-orange-100 text-sm font-extrabold text-gray-700 uppercase tracking-wider">

                    <div className="col-span-3">Provider</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2">Phone</div>
                    <div className="col-span-2">Location</div>
                    <div className="col-span-2 text-center">Actions</div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                    </div>

                ) : filteredProviders.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">📭</div>
                        <h3 className="text-2xl font-bold text-gray-700">
                            No Providers Found
                        </h3>
                        <p className="text-gray-400 mt-2">
                            No matching providers available.
                        </p>
                    </div>

                ) : (

                    filteredProviders.map((provider) => (
                        <div
                            key={provider._id}
                            className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-orange-50 items-center hover:bg-orange-50/40 transition-all"
                        >

                            {/* PROVIDER */}
                            <div className="col-span-3">
                                <h3 className="font-bold text-gray-800">
                                    {provider.name}
                                </h3>
                            </div>

                            {/* EMAIL */}
                            <div className="col-span-3 text-gray-500 text-sm">
                                {provider.email}
                            </div>

                            {/* PHONE */}
                            <div className="col-span-2 text-sm">
                                <span className={provider.phone ? "text-gray-700" : "text-gray-400 italic"}>
                                    {provider.phone || "Not Added"}
                                </span>
                            </div>

                            {/* LOCATION */}
                            <div className="col-span-2 text-sm text-gray-600">
                                {provider.location || "Unknown"}
                            </div>

                            {/* ACTIONS */}
                            <div className="col-span-2 flex gap-2 justify-center border-l border-gray-300 pl-3">

                                {/* STATUS BADGE */}
                                <span
                                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                                        provider.isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {provider.isActive ? "Active" : "Blocked"}
                                </span>

                                {/* TOGGLE */}
                                <button
                                    onClick={() =>
                                        handleToggleProvider(
                                            provider._id,
                                            provider.isActive
                                        )
                                    }
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        provider.isActive
                                            ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-700"
                                            : "bg-green-50 hover:bg-green-100 text-green-700"
                                    }`}
                                >
                                    {provider.isActive ? "Block" : "Activate"}
                                </button>

                                {/* DELETE */}
                                <button
                                    onClick={() =>
                                        handleDeleteProvider(provider._id)
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

export default ManageProviders;