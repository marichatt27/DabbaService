const express = require("express");
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getMe);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;