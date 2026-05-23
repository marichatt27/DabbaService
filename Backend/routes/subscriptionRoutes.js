const express = require("express");
const {
  createSubscription,
  getSubscriptions,
  updateSubscription,
  deleteSubscription,
  toggleSkipDate,
  getKitchenDashboard,
} = require("../controllers/subscriptionController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/kitchen/dashboard", authMiddleware, roleMiddleware("provider", "admin"), getKitchenDashboard);
router.post("/", authMiddleware, roleMiddleware("customer"), createSubscription);
router.get("/", authMiddleware, getSubscriptions);
router.post("/:id/skip", authMiddleware, roleMiddleware("customer", "admin"), toggleSkipDate);
router.put("/:id", authMiddleware, roleMiddleware("provider", "admin"), updateSubscription);
router.delete("/:id", authMiddleware, deleteSubscription);

module.exports = router;