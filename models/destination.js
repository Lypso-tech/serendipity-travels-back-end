const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    destinationImage: {
      type: mongoose.Schema.Types.String,
      ref: "ImageStorage",
    }, 
    description: { type: String, required: true },
    headline: { type: String, required: true },
    coverImage: { type: mongoose.Schema.Types.String, ref: "ImageStorage" }, 
    coverImageTitle: { type: String, required: true },
    coverImageDescription: { type: String, required: true },
    backgroundImages: [
      { type: mongoose.Schema.Types.String, ref: "ImageStorage" },
    ], 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Destination", destinationSchema);
