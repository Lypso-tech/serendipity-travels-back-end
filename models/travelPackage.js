const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const commentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  commentText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
});

const voteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
});

const travelPackageSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  comments: [commentSchema],
  votes: [voteSchema],
  createdAt: { type: Date, default: Date.now },
});

// Virtual to calculate average rating based on approved votes
travelPackageSchema.virtual("averageRating").get(function () {
  const approvedVotes = this.votes.filter((vote) => vote.approved);
  if (approvedVotes.length === 0) return 0;
  const totalStars = approvedVotes.reduce((sum, vote) => sum + vote.stars, 0);
  return totalStars / approvedVotes.length;
});

// Ensure virtuals are included in JSON and Object representations
travelPackageSchema.set("toJSON", { virtuals: true });
travelPackageSchema.set("toObject", { virtuals: true });

const TravelPackage = mongoose.model("TravelPackage", travelPackageSchema);
module.exports = TravelPackage;
