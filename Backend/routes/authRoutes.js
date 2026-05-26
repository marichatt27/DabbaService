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


// GET ALL USERS
router.get("/admin/users", authMiddleware, async (req, res) => {

  try {

    const users = await User.find({
      role: "customer",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});


// BLOCK / ACTIVATE USER
router.put("/admin/users/:id", authMiddleware, async (req, res) => {

  try {

    const { isActive } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        isActive,
      },
      {
        new: true,
      }
    ).select("-password");

    res.status(200).json(updatedUser);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});


// DELETE USER
router.delete("/admin/users/:id", authMiddleware, async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    // PREVENT ADMIN DELETE
    if (user.role === "admin") {

      return res.status(403).json({
        message: "Admin accounts cannot be deleted",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});

// FIX OLD USERS WITHOUT isActive
router.get("/admin/fix-users", async (req, res) => {

  try {

    await User.updateMany(
      {
        isActive: { $exists: false },
      },
      {
        $set: {
          isActive: true,
        },
      }
    );

    res.status(200).json({
      message: "Users updated successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;