const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Routers
const userRouter = require("./router/user");
const contactRouter = require("./router/contact");
const bookingRouter = require("./router/booking");
const addrestaurantRouter = require("./router/addrestaurant");
const dashboardRouter= require("./router/dashboard");


const app = express();
const PORT = 5000;

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
app.use("/uploads", express.static(uploadPath));

// ---------------- CORS ----------------


const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);



// ---------------- CORS ----------------
app.use(cors(
    {
        origin:true,
        credentials:true
        
    }
));  // ✅ No error // ✅ works with Express 5 // Handle preflight requests


// ---------------- Middleware ----------------
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// ---------------- MongoDB Connection ----------------
mongoose.connect("mongodb://localhost:27017/Eventdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected Successfully"))
.catch((err) => console.error("MongoDB Connection Error:", err));

// ---------------- Routes ----------------
app.use("/api/user", userRouter);
app.use("/api/contact", contactRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/restaurants", addrestaurantRouter);
app.use("/api/dashboard",dashboardRouter);

app.post("/api/test", (req, res) => {
  res.json({ message: "CORS works!" });
});

app.get("/", (req, res) => res.send("Server is running..."));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ---------------- Start Server ----------------
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
