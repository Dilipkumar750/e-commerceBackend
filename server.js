const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const productRoutes = require("./routes/product");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// API Routes
app.use("/api/products", productRoutes);

// Serve Static Files for React
if (process.env.NODE_ENV === "production") {
  // Serve the static files from the Client app
  app.use(express.static(path.join(__dirname, "client/build")));

  // Serve the static files from the Admin app
  app.use("/admin", express.static(path.join(__dirname, "admin/build")));

  // Serve Client's Home Page
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });

  // Serve Admin Dashboard Page
  app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "admin/build", "index.html"));
  });

  // Catch-all handler to serve React app for all other routes (Client side)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// Port Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
