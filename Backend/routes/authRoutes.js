const express = require("express");

const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const User = require("../models/User");

const router = express.Router();


// AUTH ROUTES
router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", authMiddleware, getMe);

router.put("/profile", authMiddleware, updateProfile);


// ADMIN STATS ROUTE
router.get("/admin/stats", authMiddleware, async (req, res) => {

  try {

    const totalUsers = await User.countDocuments({
      role: "customer",
    });

    const totalProviders = await User.countDocuments({
      role: "provider",
    });

    const totalAdmins = await User.countDocuments({
      role: "admin",
    });

    res.status(200).json({
      totalUsers,
      totalProviders,
      totalAdmins,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;