const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: String,
  city: String,
  seating:Number,
  cuisineType: String,
  avgCost: Number,
  amenities: [String],
  image: String,  
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Restaurants", restaurantSchema);
