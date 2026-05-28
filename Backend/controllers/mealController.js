const Meal = require("../models/Meal");

const createMeal = async (req, res) => {
  try {
    const { title, description, price, category, image } = req.body;
    const meal = await Meal.create({
      title,
      description,
      price,
      category,
      image,
      provider: req.user.id,
    });
    res.status(201).json({
      message: "Meal added successfully",
      meal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMeals = async (req, res) => {
  try {
    const meals = await Meal.find().populate("provider", "name email");
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMeal = async (req, res) => {

    try {

        console.log(req.body);

        const updatedMeal = await Meal.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        res.status(200).json({
            message: "Meal updated successfully",
            updatedMeal,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteMeal = async (req, res) => {
  try {
    await Meal.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Meal deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllMealsAdmin = async (req, res) => {

    try {

        const meals = await Meal.find()
            .populate("provider", "businessName");

        res.json(meals);

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });
    }
};

module.exports = {
  createMeal,
  getMeals,
  updateMeal,
  deleteMeal,
  getAllMealsAdmin,
};