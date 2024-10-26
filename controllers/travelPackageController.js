const TravelPackage = require("../models/travelPackage");
const ImageStorage = require("../models/ImageStorage");

exports.createTravelPackage = async (req, res) => {
  const { title, description, price, images } = req.body;

  try {
    let foundImages = [];

    const fetchImages = async () => {
      foundImages = await Promise.all(
        images.map(async (image) => {
          return await ImageStorage.find({
            _id: { $in: image },
          });
        })
      );
    };
    await fetchImages();

    const travelPackage = new TravelPackage({
      title,
      description,
      price,
      images,
    });

    await travelPackage.save();
    const data = {
      title,
      description,
      price,
      foundImages,
    };
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllTravelPackages = async (req, res) => {
  try {
    const packages = await TravelPackage.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTravelPackageById = async (req, res) => {
  const { id } = req.params;
  try {
    const travelPackage = await TravelPackage.findById(id);
    if (!travelPackage) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.status(200).json(travelPackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTravelPackage = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, images } = req.body;

  try {
    const travelPackage = await TravelPackage.findById(id);
    if (!travelPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    travelPackage.title = title;
    travelPackage.description = description;
    travelPackage.price = price;
    travelPackage.images = images;

    await travelPackage.save();
    res.status(200).json(travelPackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTravelPackage = async (req, res) => {
  const { id } = req.params;
  try {
    await TravelPackage.findByIdAndDelete(id);
    res.status(204).json({ message: "Package deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addComment = async (req, res) => {
  const { id } = req.params;
  const { userId, commentText } = req.body;

  try {
    const travelPackage = await TravelPackage.findById(id);
    if (!travelPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    travelPackage.comments.push({ userId, commentText });
    await travelPackage.save();

    res.status(201).json(travelPackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addVote = async (req, res) => {
  const { id } = req.params;
  const { userId, stars } = req.body;

  try {
    const travelPackage = await TravelPackage.findById(id);
    if (!travelPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    travelPackage.votes.push({ userId, stars });
    await travelPackage.save();

    res.status(201).json({
      message: "Vote added successfully",
      averageRating: travelPackage.averageRating,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
