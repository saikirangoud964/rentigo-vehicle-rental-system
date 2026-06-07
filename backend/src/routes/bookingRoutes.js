const express = require("express");

const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  getVehicleBookedDates,
  cancelBooking,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingController");

const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, createBooking);

router.get("/my-bookings", protect, getMyBookings);

router.get("/all", protect, admin, getAllBookings);

// Public route for vehicle availability calendar
router.get("/vehicle/:vehicleId/booked-dates", getVehicleBookedDates);

router.delete("/:id", protect, admin, deleteBooking);

router.get("/:id", protect, getBookingById);

router.put("/cancel/:id", protect, cancelBooking);

router.put("/status/:id", protect, admin, updateBookingStatus);

module.exports = router;
