const express= require("express");
const contact = require('./models/contact');
const router=express.Router();
const user=require('./router/user')




// POST - Save a new contact message
router.post("/addinfo", async (req, res) => {
  const { name, phone, email, message } = req.body;

  if (!name || !phone || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newContact = new contact({ name, phone, email, message });
    await newContact.save();
    res.status(201).json({ message: "Message saved successfully", contact: newContact });
  } catch (error) {
    console.error("Contact POST Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Fetch all contact messages
router.get("/userinfo", async (req, res) => {
  try {
    const messages = await contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Contact GET Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


