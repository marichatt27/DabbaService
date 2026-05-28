import { useEffect, useState } from "react";
import api from "../services/api";

function ManageMeals() {

    const [meals, setMeals] = useState([]);
    const [filteredMeals, setFilteredMeals] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    // FETCH MEALS
    useEffect(() => {
        fetchMeals();
    }, []);

    const fetchMeals = async () => {

        try {

            const res = await api.get("/meals/admin/all");

            setMeals(res.data);
            setFilteredMeals(res.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
        }
    };

    // SEARCH + FILTER
    useEffect(() => {

        let updatedMeals = meals;

        // SEARCH
        if (search) {

            updatedMeals = updatedMeals.filter((meal) =>
                meal.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        // FILTER
        if (filter !== "all") {

            updatedMeals = updatedMeals.filter(
                (meal) => meal.category === filter
            );
        }

        setFilteredMeals(updatedMeals);

    }, [search, filter, meals]);

    // DELETE MEAL
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this meal?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/meals/${id}`);

            fetchMeals();

        } catch (err) {

            console.log(err);
        }
    };

    // LOADING
    if (loading) {

        return (
            <div className="p-6 text-lg font-semibold">
                Loading meals...
            </div>
        );
    }

    return (

        <div className="max-w-7xl mx-auto px-4 py-8">

            {/* HEADER */}
            <div className="mb-10">

                <h1 className="text-5xl font-extrabold text-gray-800">
                    Manage Meals
                </h1>

                <p className="text-gray-500 mt-3 text-lg">
                    Control all meals added by providers.
                </p>

            </div>

            {/* TOP STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* TOTAL */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition relative overflow-hidden">

                    <div className="flex justify-between items-start">

                        <div>
                            <p className="text-gray-500 text-sm">
                                Total Meals
                            </p>

                            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">
                                {meals.length}
                            </h2>

                            <p className="text-gray-400 text-sm mt-1">
                                Meals available
                            </p>
                        </div>

                        <div className="text-3xl bg-orange-50 text-orange-600 px-3 py-2 rounded-2xl">
                            🍱
                        </div>

                    </div>

                </div>

                {/* ACTIVE */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-green-100 hover:shadow-md transition relative overflow-hidden">

                    <div className="flex justify-between items-start">

                        <div>
                            <p className="text-gray-500 text-sm">
                                Active Meals
                            </p>

                            <h2 className="text-4xl font-extrabold text-green-600 mt-2">
                                {meals.length}
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

                {/* HIDDEN */}
                <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-6 shadow-xl shadow-orange-500/10 text-white">

                    <div className="flex justify-between items-start">

                        <div>
                            <p className="text-white text-sm">
                                Hidden Meals
                            </p>

                            <h2 className="text-4xl font-extrabold text-white mt-2">
                                0
                            </h2>

                            <p className="text-white text-sm mt-1">
                                Hidden / unavailable
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
                    placeholder="Search meals..."
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
                    <option value="all">All Categories</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                </select>

            </div>

            {/* TABLE */}
            <div className="bg-white border border-orange-100 rounded-3xl overflow-hidden shadow-md shadow-orange-500/5">

                {/* HEADER */}
                <div className="grid grid-cols-12 gap-4 px-6 py-5 bg-orange-50 border-b border-orange-100 text-sm font-extrabold text-gray-700 uppercase tracking-wider">

                    <div className="col-span-4">
                        Meal Info
                    </div>

                    <div className="col-span-2">
                        Provider
                    </div>

                    <div className="col-span-2">
                        Category
                    </div>

                    <div className="col-span-2">
                        Price
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

                ) : filteredMeals.length === 0 ? (

                    <div className="text-center py-20">

                        <div className="text-5xl mb-4">
                            🍽️
                        </div>

                        <h3 className="text-2xl font-bold text-gray-700">
                            No Meals Found
                        </h3>

                        <p className="text-gray-400 mt-2">
                            No meals available right now.
                        </p>

                    </div>

                ) : (

                    filteredMeals.map((meal) => (

                        <div
                            key={meal._id}
                            className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-orange-50 items-center hover:bg-orange-50/40 transition-all"
                        >

                            {/* MEAL INFO */}
                            <div className="col-span-4">

                                <h3 className="font-bold text-gray-800">
                                    {meal.title}
                                </h3>

                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {meal.description}
                                </p>

                            </div>

                            {/* PROVIDER */}
                            <div className="col-span-2 text-sm text-gray-600">

                                {meal.provider?.name || "Unknown"}

                            </div>

                            {/* CATEGORY */}
                            <div className="col-span-2">

                                <span
                                    className={`text-xs font-bold px-3 py-1 rounded-full

                                    ${meal.category === "Breakfast"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : meal.category === "Lunch"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-purple-100 text-purple-700"
                                        }`}
                                >
                                    {meal.category}
                                </span>

                            </div>

                            {/* PRICE */}
                            <div className="col-span-2 font-bold text-orange-600">

                                ₹{meal.price}

                            </div>

                            {/* ACTIONS */}
                            <div className="col-span-2 flex gap-2 justify-center border-l border-gray-300 pl-3">

                                {/* STATUS */}
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">
                                    Active
                                </span>

                                {/* DELETE */}
                                <button
                                    onClick={() =>
                                        handleDeleteMeal(meal._id)
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

export default ManageMeals;