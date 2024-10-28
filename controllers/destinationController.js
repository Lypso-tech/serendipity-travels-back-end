const Destination = require("../models/destination.js");
const ImageStorage = require("../models/ImageStorage");

// Create a new destination
exports.createDestination = async (req, res) => {
  try {
    const {
      name,
      description,
      headline,
      coverImageTitle,
      coverImageDescription,
    } = req.body;

    // Handling file uploads
    const destinationImage = req.files.destinationImage
      ? req.files.destinationImage[0].path
      : null;
    const coverImage = req.files.coverImage
      ? req.files.coverImage[0].path
      : null;
    const backgroundImages = req.files.backgroundImages
      ? req.files.backgroundImages.map((file) => file.path)
      : [];

    if (backgroundImages.length !== 6) {
      return res
        .status(400)
        .json({ error: "Please upload exactly 6 background images." });
    }

    const newDestination = new Destination({
      name,
      description,
      headline,
      coverImageTitle,
      coverImageDescription,
      destinationImage,
      coverImage,
      backgroundImages,
    });

    await newDestination.save();
    res.status(201).json(newDestination);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all destinations
exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find().populate(
      "destinationImage coverImage backgroundImages"
    );
    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single destination by ID
exports.getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id).populate(
      "destinationImage coverImage backgroundImages"
    );
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.status(200).json(destination);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a destination by ID
exports.updateDestination = async (req, res) => {
  try {
    const updatedData = req.body;
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    ).populate("destinationImage coverImage backgroundImages");
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.status(200).json(destination);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a destination by ID
exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};