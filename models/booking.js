const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  eventType: String,
  eventDate: String,
  startTime: String,
  endTime: String,
  hallBooking: String,
  hallName: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);
