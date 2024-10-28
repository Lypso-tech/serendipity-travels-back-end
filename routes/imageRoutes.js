// apiRoutes.js
const express = require("express");
const multer = require("multer");
const imageController = require("../controllers/imageController");
const destinationController = require("../controllers/destinationController");

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

const upload = multer({ storage });

// ImageStorage routes
router.post("/images", upload.single("file"), imageController.uploadImage); // Upload a new image
router.get("/images", imageController.getAllImages); // Get all images
router.get("/images/:id", imageController.getImageById); // Get a specific image by ID
router.put("/images/:id", imageController.updateImage); // Update an image's info by ID
router.delete("/images/:id", imageController.deleteImage); // Delete an image by ID

// Destination routes
router.post(
  "/destinations",
  upload.fields([
    { name: "destinationImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
    { name: "backgroundImages", maxCount: 6 },
  ]),
  async (req, res, next) => {
    try {
      await destinationController.createDestination(req, res);
    } catch (error) {
      console.error("Error creating destination:", error);
      res.status(500).json({ error: error.message });
    }
  }
); // Create a new destination

router.get("/destinations", destinationController.getAllDestinations); // Get all destinations
router.get("/destinations/:id", destinationController.getDestinationById); // Get a specific destination by ID
router.put("/destinations/:id", destinationController.updateDestination); // Update a destination by ID
router.delete("/destinations/:id", destinationController.deleteDestination); // Delete a destination by ID

module.exports = router;
