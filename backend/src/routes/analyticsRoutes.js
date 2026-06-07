const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");
const { getAdminAnalytics } = require("../controllers/analyticsController");

router.get("/admin", protect, admin, getAdminAnalytics);

module.exports = router;
