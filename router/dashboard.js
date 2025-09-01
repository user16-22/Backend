// routes/dashboard.js
const express = require("express");
const router = express.Router();

// ✅ Import models
const Booking = require("../models/booking");
const User = require("../models/users"); // Adjust to your actual file name
const Message = require("../models/contact"); // Assuming messages are stored in contacts
const Restaurant = require("../models/addrestaurant");

// ✅ Dashboard stats route
router.get("/dashboard-stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalMessages = await Message.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments();

    // ✅ Group bookings by eventType
    const eventTypes = await Booking.aggregate([
      { $group: { _id: "$eventType", count: { $sum: 1 } } }
    ]);

    // ✅ Group bookings by eventDate (correct field)
    const bookingsPerDate = await Booking.aggregate([
      { $group: { _id: "$eventDate", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalUsers,
      totalBookings,
      totalMessages,
      totalRestaurants,
      eventTypes,
      bookingsPerDate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

module.exports = router;
