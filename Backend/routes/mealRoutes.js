const express = require("express");
const {
  createMeal,
  getMeals,
  updateMeal,
  deleteMeal,
} = require("../controllers/mealController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getMeals);
router.post("/", authMiddleware, roleMiddleware("provider", "admin"), createMeal);
router.put("/:id", authMiddleware, roleMiddleware("provider", "admin"), updateMeal);
router.delete("/:id", authMiddleware, roleMiddleware("provider", "admin"), deleteMeal);

module.exports = router;