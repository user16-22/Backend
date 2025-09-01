const express= require("express");
const details = require('../models/users');
const router = express.Router();
const bcrypt= require("bcrypt");


 
// Register API
router.post('/register', async (request, response) => {
    request.body.password =await bcrypt.hash(request.body.password,10);
 
    const { name, email, password, mobilenumber } = request.body;
 
    if (!name || !email || !password || !mobilenumber) {
        return response.status(400).json({ message: "All fields are required" });
    }
 
    try {
        // check if user already exists
        const existingUser = await details.findOne({ email });
        if (existingUser) {
            return response.status(409).json({ message: "Email already registered" });
        }
 
        // create and save user
        const newUser = new details({
            name,
            email,
            password,
            mobilenumber
        });
 
        await newUser.save();
 
        response.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Register Error:", error);
        response.status(500).json({ message: "Server error" });
    }
});
 
// Login API
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
 
    try {
        const user = await details.findOne({ email });
 
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
 
        res.status(200).json({ message: "Login successful", token: user.id });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
 
/* ---------------- NEW CRUD APIs ---------------- */
 
// Get all users
router.get("/users", async (req, res) => {
    try {
        const users = await details.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
 
// Get single user by ID
router.get("/users/:id", async (req, res) => {
    try {
        const user = await details.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
 
// Edit (Update) user
router.put("/users/:id", async (req, res) => {
    try {
        const { name, email, password, mobilenumber } = req.body;
        let updateData = { name, email, mobilenumber };
 
        // If password is being updated, hash it again
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
 
        const updatedUser = await details.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
 
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
 
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
 
// Delete user
router.delete("/users/:id", async (req, res) => {
    try {
        const deletedUser = await details.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully",  });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
 
// Search users by keyword (name, email, or mobilenumber)
router.get("/search", async (req, res) => {
  try {
    const { keyword } = req.query;  // e.g., /api/user/search?keyword=john
    let query = {};
 
    if (keyword) {
      const regex = new RegExp(keyword, "i"); // case-insensitive search
      query.$or = [
        { name: regex },
        { mobilenumber: regex },
        { email: regex },
      ];
    }
 
    const users = await details.find(query).limit(50); // limit for performance
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
 
module.exports = router;