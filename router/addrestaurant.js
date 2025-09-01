const express = require("express");
const Restaurant = require("../models/addrestaurant");
const multer = require("multer");
const router = express.Router();

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ===============================
// @route   POST /api/restaurants/add
// @desc    Add new restaurant
// ===============================
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, city, seating, cuisineType, avgCost, amenities } = req.body;

    const parsedSeating = seating && !isNaN(seating) ? Number(seating) : 0;
    const parsedCost = avgCost && !isNaN(avgCost) ? Number(avgCost) : 0;

    const imageBase64 = req.file
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      : null;

    const newRestaurant = new Restaurant({
      name,
      city,
      seating: parsedSeating,
      cuisineType,
      avgCost: parsedCost,
      amenities: amenities ? (Array.isArray(amenities) ? amenities : [amenities]) : [],
      image: imageBase64,
    });

    await newRestaurant.save();
    res.status(201).json({ message: "Restaurant added", restaurant: newRestaurant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===============================
// @route   GET /api/restaurants/view
// @desc    Get all restaurants
// ===============================
router.get("/view", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ===============================
// @route   PUT /api/restaurants/:id
// @desc    Update restaurant
// ===============================
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, city, seating, cuisineType, avgCost, amenities } = req.body;

    const parsedSeating = seating && !isNaN(seating) ? Number(seating) : 0;
    const parsedCost = avgCost && !isNaN(avgCost) ? Number(avgCost) : 0;

    const updatedData = {
      name,
      city,
      seating: parsedSeating,
      cuisineType,
      avgCost: parsedCost,
      amenities: amenities ? (Array.isArray(amenities) ? amenities : [amenities]) : [],
    };

    if (req.file) {
      updatedData.image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!updatedRestaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json({ message: "Restaurant updated", restaurant: updatedRestaurant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===============================
// @route   DELETE /api/restaurants/:id
// @desc    Delete restaurant
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deletedRestaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.json({ message: "Restaurant deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
