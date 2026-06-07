const express = require("express");

const router = express.Router();

const {
  addVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// PUBLIC ROUTES
router.get("/", getVehicles);

router.get("/:id", getVehicleById);

// PROTECTED ROUTES
router.post("/", protect, upload.single("image"), addVehicle);

router.put("/:id", protect, upload.single("image"), updateVehicle);

router.delete("/:id", protect, deleteVehicle);

module.exports = router;
