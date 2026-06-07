const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const User = require("../models/User");

/*
========================================
DATE FORMATTER
========================================
*/
const formatDate = (date) => {
  return date ? new Date(date).toLocaleDateString("en-IN") : "N/A";
};

/*
========================================
BREVO API EMAIL SERVICE
========================================
*/
const sendBrevoEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.BREVO_API_KEY || !process.env.SMTP_FROM) {
      throw new Error("BREVO_API_KEY or SMTP_FROM missing");
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "RentiGo",
          email: process.env.SMTP_FROM,
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        htmlContent: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("BREVO EMAIL ERROR:", data);
      return;
    }

    console.log("BREVO EMAIL SENT:", subject, data);
  } catch (error) {
    console.log("BREVO EMAIL ERROR:", error.message);
  }
};
/*
========================================
SEND BOOKING CREATED EMAIL
========================================
*/
const sendBookingEmail = async (user, vehicle, booking) => {
  await sendBrevoEmail({
    to: user.email,
    subject: "Booking Created - RentiGo",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Booking Created Successfully 🚗</h2>

        <p>Hello <strong>${user.name}</strong>,</p>

        <p>Your booking has been created successfully and is waiting for admin approval.</p>

        <h3>Booking Details</h3>

        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Vehicle:</strong> ${vehicle.name}</p>
        <p><strong>Brand:</strong> ${vehicle.brand || "N/A"}</p>
        <p><strong>Pickup Date:</strong> ${formatDate(booking.startDate)}</p>
        <p><strong>Return Date:</strong> ${formatDate(booking.endDate)}</p>
        <p><strong>Total Price:</strong> ₹${booking.totalPrice}</p>
        <p><strong>Payment Status:</strong> ${booking.paymentStatus || "Pending"}</p>
        <p><strong>Payment ID:</strong> ${booking.paymentId || "N/A"}</p>
        <p><strong>Status:</strong> ${booking.status}</p>

        <br />

        <p>Thank you for choosing <strong>RentiGo</strong>.</p>
      </div>
    `,
  });
};
/*
========================================
SEND ADMIN BOOKING EMAIL
========================================
*/
const sendAdminBookingEmail = async (user, vehicle, booking) => {
  await sendBrevoEmail({
    to: process.env.ADMIN_EMAIL,
    subject: "🚗 New Booking Request - RentiGo",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Booking Request</h2>

        <p><strong>User:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>

        <hr/>

        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Vehicle:</strong> ${vehicle.name}</p>
        <p><strong>Brand:</strong> ${vehicle.brand}</p>

        <p><strong>Pickup Date:</strong>
        ${formatDate(booking.startDate)}</p>

        <p><strong>Return Date:</strong>
        ${formatDate(booking.endDate)}</p>

        <p><strong>Total Price:</strong>
        ₹${booking.totalPrice}</p>

        <p><strong>Status:</strong>
        ${booking.status}</p>
      </div>
    `,
  });
};
/*
========================================
SEND PAYMENT SUCCESS EMAIL
========================================
*/
const sendPaymentSuccessEmail = async (user, vehicle, booking) => {
  if (booking.paymentStatus !== "Paid") return;

  await sendBrevoEmail({
    to: user.email,
    subject: "Payment Successful - RentiGo",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Payment Successful 💳</h2>

        <p>Hello <strong>${user.name}</strong>,</p>

        <p>Your payment has been received successfully.</p>

        <h3>Payment Details</h3>

        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Vehicle:</strong> ${vehicle.name}</p>
        <p><strong>Amount Paid:</strong> ₹${booking.amountPaid || booking.totalPrice}</p>
        <p><strong>Payment ID:</strong> ${booking.paymentId || "N/A"}</p>
        <p><strong>Payment Status:</strong> ${booking.paymentStatus}</p>

        <br />

        <p>Thank you for choosing <strong>RentiGo</strong>.</p>
      </div>
    `,
  });
};
/*
========================================
SEND ADMIN PAYMENT EMAIL
========================================
*/
const sendAdminPaymentEmail = async (user, vehicle, booking) => {
  if (booking.paymentStatus !== "Paid") return;

  await sendBrevoEmail({
    to: process.env.ADMIN_EMAIL,
    subject: "💳 Payment Received - RentiGo",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Payment Received</h2>

        <p><strong>User:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>

        <hr/>

        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Vehicle:</strong> ${vehicle.name}</p>

        <p><strong>Amount Paid:</strong>
        ₹${booking.amountPaid || booking.totalPrice}</p>

        <p><strong>Payment ID:</strong>
        ${booking.paymentId || "N/A"}</p>
      </div>
    `,
  });
};

/*
========================================
SEND BOOKING STATUS EMAIL
========================================
*/
const sendBookingStatusEmail = async (user, vehicle, booking) => {
  let subject = "Booking Status Updated - RentiGo";
  let statusMessage = "Your booking status has been updated.";

  if (booking.status === "approved") {
    subject = "Booking Approved - RentiGo";
    statusMessage = "Your booking has been approved by the admin.";
  }

  if (booking.status === "rejected") {
    subject = "Booking Rejected - RentiGo";
    statusMessage = "Sorry, your booking has been rejected by the admin.";
  }

  if (booking.status === "completed") {
    subject = "Booking Completed - RentiGo";
    statusMessage = "Your booking has been marked as completed.";
  }

  if (booking.status === "cancelled") {
    subject = "Booking Cancelled - RentiGo";
    statusMessage = "Your booking has been cancelled.";
  }

  await sendBrevoEmail({
    to: user.email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>RentiGo Booking Update 🔔</h2>

        <p>Hello <strong>${user.name}</strong>,</p>

        <p>${statusMessage}</p>

        <h3>Booking Details</h3>

        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Vehicle:</strong> ${vehicle?.name || "N/A"}</p>
        <p><strong>Brand:</strong> ${vehicle?.brand || "N/A"}</p>
        <p><strong>Pickup Date:</strong> ${formatDate(booking.startDate)}</p>
        <p><strong>Return Date:</strong> ${formatDate(booking.endDate)}</p>
        <p><strong>Total Price:</strong> ₹${booking.totalPrice}</p>
        <p><strong>Payment Status:</strong> ${booking.paymentStatus || "Pending"}</p>
        <p><strong>Payment ID:</strong> ${booking.paymentId || "N/A"}</p>
        <p><strong>Booking Status:</strong> ${booking.status}</p>

        <br />

        <p>Thank you for choosing <strong>RentiGo</strong>.</p>
      </div>
    `,
  });
};

/*
========================================
CREATE BOOKING
========================================
*/
exports.createBooking = async (req, res) => {
  try {
    const {
      vehicleId,
      startDate,
      endDate,
      paymentStatus,
      paymentId,
      amountPaid,
    } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    if (!vehicleId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    const existingBooking = await Booking.findOne({
      vehicle: vehicleId,
      status: { $in: ["pending", "approved"] },
      startDate: { $lte: end },
      endDate: { $gte: start },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "Vehicle already booked for selected dates",
      });
    }

    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = totalDays * vehicle.pricePerDay;

    const booking = await Booking.create({
      user: req.user._id,
      vehicle: vehicleId,
      startDate,
      endDate,
      totalPrice,
      status: "pending",
      paymentStatus: paymentStatus || "Pending",
      paymentId: paymentId || "",
      amountPaid: amountPaid || totalPrice,
    });

    const user = await User.findById(req.user._id);

    if (user) {
      // User Emails
      await sendBookingEmail(user, vehicle, booking);
      await sendPaymentSuccessEmail(user, vehicle, booking);

      // Admin Emails
      await sendAdminBookingEmail(user, vehicle, booking);
      await sendAdminPaymentEmail(user, vehicle, booking);
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
GET MY BOOKINGS
========================================
*/
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("vehicle")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
GET ALL BOOKINGS ADMIN
========================================
*/
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("vehicle")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
GET SINGLE BOOKING
========================================
*/
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("vehicle");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
GET VEHICLE BOOKED DATES
========================================
*/
exports.getVehicleBookedDates = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const bookings = await Booking.find({
      vehicle: vehicleId,
      status: { $in: ["pending", "approved"] },
    })
      .select("startDate endDate status")
      .sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      bookedDates: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
CANCEL BOOKING
========================================
*/
exports.cancelBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    booking.status = "cancelled";

    await booking.save();

    booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("vehicle");

    if (booking.user && booking.vehicle) {
      await sendBookingStatusEmail(booking.user, booking.vehicle, booking);
    }

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully and email sent",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
UPDATE BOOKING STATUS
========================================
*/
exports.updateBookingStatus = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const { status } = req.body;

    const allowedStatus = [
      "pending",
      "approved",
      "rejected",
      "completed",
      "cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    booking.status = status;

    await booking.save();

    booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("vehicle");

    if (booking.user && booking.vehicle) {
      await sendBookingStatusEmail(booking.user, booking.vehicle, booking);
    }

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully and email sent`,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
DELETE BOOKING ADMIN
========================================
*/
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
