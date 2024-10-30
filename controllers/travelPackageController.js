const TravelPackage = require("../models/travelPackage");
const ImageStorage = require("../models/ImageStorage");

// Create Travel Package
exports.createTravelPackage = async (req, res) => {
  const { title, description, price } = req.body;

  try {
    // Store images and get their paths
    const images = req.files.map((file) => file.path); // Assuming images are uploaded using a middleware like multer

    const travelPackage = new TravelPackage({
      title,
      description,
      price,
      images,
    });
    await travelPackage.save();
    res.status(201).json(travelPackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Travel Packages with only approved comments and votes
exports.getAllTravelPackages = async (req, res) => {
  try {
    const packages = await TravelPackage.find();
    const response = packages.map((pkg) => ({
      ...pkg.toObject(),
      comments: pkg.comments.filter((comment) => comment.approved),
      votes: pkg.votes.filter((vote) => vote.approved),
      averageRating: pkg.averageRating,
    }));
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Travel Package by ID with only approved comments and votes
exports.getTravelPackageById = async (req, res) => {
  const { id } = req.params;
  try {
    const travelPackage = await TravelPackage.findById(id);
    if (!travelPackage) {
      return res.status(404).json({ message: "Package not found" });
    }
    const response = {
      ...travelPackage.toObject(),
      comments: travelPackage.comments.filter((comment) => comment.approved),
      votes: travelPackage.votes.filter((vote) => vote.approved),
      averageRating: travelPackage.averageRating,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Travel Package
exports.updateTravelPackage = async (req, res) => {
  const { id } = req.params;
  const { title, description, price } = req.body;
  let images = req.body.images || [];

  try {
    // Add newly uploaded images to the array
    if (req.files) {
      const newImagePaths = req.files.map((file) => file.path);
      images = [...images, ...newImagePaths];
    }

    // Update travel package
    const updatedTravelPackage = await TravelPackage.findByIdAndUpdate(
      id,
      { title, description, price, images },
      { new: true }
    );

    if (!updatedTravelPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json(updatedTravelPackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Travel Package
exports.deleteTravelPackage = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTravelPackage = await TravelPackage.findByIdAndDelete(id);
    if (!deletedTravelPackage) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get all packages with comments and votes
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await TravelPackage.find().populate(
      "comments.userId votes.userId"
    );
    res.status(200).json(packages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching packages", error: err });
  }
};

// Add a comment to a travel package
exports.addComment = async (req, res) => {
  const { id } = req.params;
  const { userId, commentText } = req.body;
  try {
    const travelPackage = await TravelPackage.findById(id);
    travelPackage.comments.push({ userId, commentText });
    await travelPackage.save();
    res.status(201).json({ message: "Comment added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding comment", error: err });
  }
};

// Add a vote to a travel package
exports.addVote = async (req, res) => {
  const { id } = req.params;
  const { userId, stars } = req.body;
  try {
    const travelPackage = await TravelPackage.findById(id);
    travelPackage.votes.push({ userId, stars });
    await travelPackage.save();
    res.status(201).json({ message: "Vote added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding vote", error: err });
  }
};

// Approve a comment
exports.approveComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const travelPackage = await TravelPackage.findOneAndUpdate(
      { "comments._id": commentId },
      { $set: { "comments.$.approved": true } },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Comment approved successfully", travelPackage });
  } catch (err) {
    res.status(500).json({ message: "Error approving comment", error: err });
  }
};

// Approve a vote
exports.approveVote = async (req, res) => {
  const { voteId } = req.params;
  try {
    const travelPackage = await TravelPackage.findOneAndUpdate(
      { "votes._id": voteId },
      { $set: { "votes.$.approved": true } },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Vote approved successfully", travelPackage });
  } catch (err) {
    res.status(500).json({ message: "Error approving vote", error: err });
  }
};

