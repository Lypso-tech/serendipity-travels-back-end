const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Comment Schema
const commentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    commentText: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Vote Schema
const voteSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    stars: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1-5 stars
    createdAt: { type: Date, default: Date.now },
});

// Travel Package Schema
const travelPackageSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String, ref: 'ImageStorage' }], // Array of Image IDs
    comments: [commentSchema], // Embedded Comments
    votes: [voteSchema], // Embedded Votes
    createdAt: { type: Date, default: Date.now },
});

// Calculate average rating (stars)
travelPackageSchema.virtual('averageRating').get(function () {
    if (this.votes.length === 0) return 0;
    const totalStars = this.votes.reduce((sum, vote) => sum + vote.stars, 0);
    return totalStars / this.votes.length;
});

const TravelPackage = mongoose.model('TravelPackage', travelPackageSchema);
module.exports = TravelPackage;
