const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const User = require("../models/User");

exports.getAdminAnalytics = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("vehicle", "name brand type");

    const usersCount = await User.countDocuments();
    const vehiclesCount = await Vehicle.countDocuments();
    const bookingsCount = bookings.length;

    const paidBookings = bookings.filter(
      (booking) => booking.paymentStatus === "Paid",
    );

    const totalRevenue = paidBookings.reduce((sum, booking) => {
      return sum + Number(booking.amountPaid || booking.totalPrice || 0);
    }, 0);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthBookings = bookings.filter((booking) => {
      const date = new Date(booking.createdAt);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });

    const previousMonthBookings = bookings.filter((booking) => {
      const date = new Date(booking.createdAt);

      const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);

      return (
        date.getMonth() === prevMonthDate.getMonth() &&
        date.getFullYear() === prevMonthDate.getFullYear()
      );
    });

    const currentMonthRevenue = currentMonthBookings
      .filter((booking) => booking.paymentStatus === "Paid")
      .reduce((sum, booking) => {
        return sum + Number(booking.amountPaid || booking.totalPrice || 0);
      }, 0);

    const previousMonthRevenue = previousMonthBookings
      .filter((booking) => booking.paymentStatus === "Paid")
      .reduce((sum, booking) => {
        return sum + Number(booking.amountPaid || booking.totalPrice || 0);
      }, 0);

    const bookingGrowth =
      previousMonthBookings.length === 0
        ? currentMonthBookings.length > 0
          ? 100
          : 0
        : (
            ((currentMonthBookings.length - previousMonthBookings.length) /
              previousMonthBookings.length) *
            100
          ).toFixed(2);

    const revenueGrowth =
      previousMonthRevenue === 0
        ? currentMonthRevenue > 0
          ? 100
          : 0
        : (
            ((currentMonthRevenue - previousMonthRevenue) /
              previousMonthRevenue) *
            100
          ).toFixed(2);

    const monthlyRevenueMap = {};

    paidBookings.forEach((booking) => {
      const date = new Date(booking.createdAt);

      const month = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      monthlyRevenueMap[month] =
        (monthlyRevenueMap[month] || 0) +
        Number(booking.amountPaid || booking.totalPrice || 0);
    });

    const monthlyRevenue = Object.keys(monthlyRevenueMap).map((month) => ({
      month,
      revenue: monthlyRevenueMap[month],
    }));

    const vehicleBookingMap = {};

    bookings.forEach((booking) => {
      if (!booking.vehicle) return;

      const vehicleId = booking.vehicle._id.toString();

      if (!vehicleBookingMap[vehicleId]) {
        vehicleBookingMap[vehicleId] = {
          vehicleName: booking.vehicle.name,
          brand: booking.vehicle.brand,
          type: booking.vehicle.type,
          bookings: 0,
        };
      }

      vehicleBookingMap[vehicleId].bookings += 1;
    });

    const topVehicles = Object.values(vehicleBookingMap)
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);

    const userBookingMap = {};

    bookings.forEach((booking) => {
      if (!booking.user) return;

      const userId = booking.user._id.toString();

      if (!userBookingMap[userId]) {
        userBookingMap[userId] = {
          userName: booking.user.name,
          email: booking.user.email,
          bookings: 0,
          revenue: 0,
        };
      }

      userBookingMap[userId].bookings += 1;

      if (booking.paymentStatus === "Paid") {
        userBookingMap[userId].revenue += Number(
          booking.amountPaid || booking.totalPrice || 0,
        );
      }
    });

    const topCustomers = Object.values(userBookingMap)
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5);

    const mostBookedVehicle = topVehicles[0] || null;
    const mostActiveUser = topCustomers[0] || null;

    res.status(200).json({
      success: true,
      usersCount,
      vehiclesCount,
      bookingsCount,
      totalRevenue,
      paidBookingsCount: paidBookings.length,
      currentMonthBookings: currentMonthBookings.length,
      previousMonthBookings: previousMonthBookings.length,
      currentMonthRevenue,
      previousMonthRevenue,
      bookingGrowth,
      revenueGrowth,
      mostBookedVehicle,
      mostActiveUser,
      monthlyRevenue,
      topVehicles,
      topCustomers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
