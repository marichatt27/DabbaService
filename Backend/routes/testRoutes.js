const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Protected Route
router.get(
  "/protected",
  authMiddleware,
  (req, res) => {

    res.json({
      message: "Protected route accessed",
      user: req.user,
    });

  }
);

module.exports = router;