const express = require("express");
const travelPackageController = require("../controllers/travelPackageController");
const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Travel Package CRUD Operations
router.post(
  "/packages",
  upload.array("images"),
  travelPackageController.createTravelPackage
);
router.get("/packages", travelPackageController.getAllTravelPackages);
router.get("/packages/:id", travelPackageController.getTravelPackageById);
router.put(
  "/packages/:id",
  upload.array("images"),
  travelPackageController.updateTravelPackage
);
router.delete("/packages/:id", travelPackageController.deleteTravelPackage);

// Comments and Votes Operations
router.post("/:id/comments", travelPackageController.addComment);
router.post("/:id/votes", travelPackageController.addVote);
router.patch(
  "/comments/:commentId/approve",
  travelPackageController.approveComment
);
router.patch("/votes/:voteId/approve", travelPackageController.approveVote);

module.exports = router;
