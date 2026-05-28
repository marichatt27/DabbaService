const express = require("express");
const {
  createMeal,
  getMeals,
  updateMeal,
  deleteMeal,
  getAllMealsAdmin,
} = require("../controllers/mealController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getMeals);
router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware("admin"),
  getAllMealsAdmin
);
router.post("/", authMiddleware, roleMiddleware("provider", "admin"), createMeal);
router.put("/:id", authMiddleware, roleMiddleware("provider", "admin"), updateMeal);
router.delete("/:id", authMiddleware, roleMiddleware("provider", "admin"), deleteMeal);

module.exports = router;