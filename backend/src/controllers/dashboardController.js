const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");

exports.ownerDashboard = async (req, res) => {
  try {
    const ownerId = req.user?.id || req.user?._id;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - owner not found",
      });
    }

    // Owner vehicles
    const vehicles = await Vehicle.find({ owner: ownerId });

    const vehicleIds = vehicles.map((v) => v._id);

    const totalVehicles = vehicles.length;

    if (!vehicleIds.length) {
      return res.status(200).json({
        success: true,
        totalVehicles: 0,
        totalBookings: 0,
        activeBookings: 0,
        totalRevenue: 0,
      });
    }

    // Total bookings
    const totalBookings = await Booking.countDocuments({
      vehicle: { $in: vehicleIds },
    });

    // Active bookings
    const activeBookings = await Booking.countDocuments({
      vehicle: { $in: vehicleIds },
      status: "approved",
    });

    // Revenue
    const revenue = await Booking.aggregate([
      {
        $match: {
          vehicle: { $in: vehicleIds },
          status: "approved",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const totalRevenue = revenue[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      totalVehicles,
      totalBookings,
      activeBookings,
      totalRevenue,
    });
  } catch (error) {
    console.error("Owner Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};
