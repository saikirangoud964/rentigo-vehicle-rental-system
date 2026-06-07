const express = require("express");

const router = express.Router();

const { ownerDashboard } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

router.get("/dashboard", protect, ownerDashboard);

module.exports = router;
