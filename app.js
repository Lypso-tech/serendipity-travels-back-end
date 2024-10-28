const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const imageRoutes = require("./routes/imageRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const travelPackageRouter = require("./routes/travelPackageRouter");

const errorHandler = require("./middleware/errorHandler");
const logger = require("./middleware/logger");

// Load environment variables from .env file
dotenv.config();

const app = express();

// Enable CORS
app.use(cors());

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define API routes
app.use("/api/users", userRoutes);
app.use("/api/files", imageRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/travel", travelPackageRouter);


// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
