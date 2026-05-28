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

        <div className="p-6 min-h-screen bg-orange-50">

            {/* PAGE TITLE */}
            <div className="mb-8">

                <h1 className="text-4xl font-extrabold text-gray-800">
                    Manage Meals
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage all meals across providers
                </p>

            </div>

            {/* TOP STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* TOTAL */}
                <div className="bg-white border border-orange-100 rounded-3xl p-6 shadow-md hover:shadow-lg transition">

                    <p className="text-gray-500 text-sm">
                        Total Meals
                    </p>

                    <h2 className="text-3xl font-extrabold text-gray-800 mt-2">
                        {meals.length}
                    </h2>

                </div>

                {/* ACTIVE */}
                <div className="bg-white border border-green-100 rounded-3xl p-6 shadow-md hover:shadow-lg transition">

                    <p className="text-gray-500 text-sm">
                        Active Meals
                    </p>

                    <h2 className="text-3xl font-extrabold text-green-600 mt-2">
                        {meals.length}
                    </h2>

                </div>

                {/* OUT OF STOCK / HIDDEN */}
                <div className="bg-white border border-red-100 rounded-3xl p-6 shadow-md hover:shadow-lg transition">

                    <p className="text-gray-500 text-sm">
                        Out of Stock / Hidden
                    </p>

                    <h2 className="text-3xl font-extrabold text-red-600 mt-2">
                        0
                    </h2>

                </div>

            </div>

            {/* SEARCH + FILTER */}
            <div className="bg-white rounded-3xl p-5 shadow-md mb-8 flex flex-col md:flex-row gap-4">

                {/* SEARCH */}
                <input
                    type="text"
                    placeholder="Search meals..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                />

                {/* FILTER */}
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-200 rounded-2xl px-4 py-3 outline-none"
                >
                    <option value="all">All Categories</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                </select>

            </div>

            {/* MEALS TABLE */}
            <div className="bg-white rounded-3xl shadow-md overflow-hidden">

                {/* TABLE HEADER */}
                <div className="grid grid-cols-12 gap-4 px-6 py-5 bg-orange-50 border-b text-sm font-bold text-gray-600">

                    <div className="col-span-4">
                        Meal Info
                    </div>

                    <div className="col-span-2">
                        Provider
                    </div>

                    <div className="col-span-1">
                        Category
                    </div>

                    <div className="col-span-1">
                        Price
                    </div>

                    <div className="col-span-2">
                        Status
                    </div>

                    <div className="col-span-2 border-l border-gray-200 pl-4">
                        Actions
                    </div>

                </div>

                {/* TABLE BODY */}
                {filteredMeals.length > 0 ? (

                    filteredMeals.map((meal) => (

                        <div
                            key={meal._id}
                            className="grid grid-cols-12 gap-4 px-6 py-5 items-center border-b hover:bg-orange-50 transition"
                        >

                            {/* MEAL INFO */}
                            <div className="col-span-4">

                                <h3 className="font-bold text-gray-800 text-lg">
                                    {meal.title}
                                </h3>

                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {meal.description}
                                </p>

                            </div>

                            {/* PROVIDER */}
                            <div className="col-span-2">

                                <p className="font-medium text-gray-700">
                                    {meal.provider?.name}
                                </p>

                            </div>

                            {/* CATEGORY */}
                            <div className="col-span-1">

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold

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
                            <div className="col-span-1 font-bold text-orange-600">
                                ₹{meal.price}
                            </div>

                            {/* STATUS */}
                            <div className="col-span-2">

                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    Active
                                </span>

                            </div>

                            {/* ACTIONS */}
                            <div className="col-span-2 border-l border-gray-200 pl-4 flex gap-2">

                                {/* EDIT */}
                                <button
                                    className="px-4 py-2 rounded-xl bg-orange-100 text-orange-700 text-sm font-medium hover:bg-orange-200 transition"
                                >
                                    Edit
                                </button>

                                {/* DELETE */}
                                <button
                                    onClick={() => handleDelete(meal._id)}
                                    className="px-4 py-2 rounded-xl bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200 transition"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    ))

                ) : (

                    <div className="p-10 text-center text-gray-500">

                        No meals found

                    </div>
                )}

            </div>

        </div>
    );
}

export default ManageMeals;