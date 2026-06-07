const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");
const { getUsersCount } = require("../controllers/adminController");

router.get("/users-count", protect, admin, getUsersCount);

module.exports = router;
