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

// Image routes
router.post("/images", upload.single("file"), imageController.uploadImage);
router.get("/images", imageController.getAllImages);
router.get("/images/:id", imageController.getImageById);
router.put("/images/:id", imageController.updateImage);
router.delete("/images/:id", imageController.deleteImage);

// Destination routes
router.post(
  "/destinations",
  upload.fields([
    { name: "destinationImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
    { name: "backgroundImages", maxCount: 6 },
  ]),
  async (req, res) => {
    try {
      await destinationController.createDestination(req, res);
    } catch (error) {
      console.error("Error creating destination:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

router.get("/destinations", destinationController.getAllDestinations);
router.get("/destinations/:id", destinationController.getDestinationById);
router.put(
  "/destinations/:id",
  upload.fields([
    { name: "destinationImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
    { name: "backgroundImages", maxCount: 6 },
  ]),
  async (req, res) => {
    try {
      await destinationController.updateDestination(req, res);
    } catch (error) {
      console.error("Error updating destination:", error);
      res.status(500).json({ error: error.message });
    }
  }
);
router.delete("/destinations/:id", destinationController.deleteDestination);

module.exports = router;
