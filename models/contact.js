const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true }); 

module.exports = mongoose.model("Contacts", contactSchema);
