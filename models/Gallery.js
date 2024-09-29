const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const gallerySchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    images: [{
        type: String,
        ref: 'ImageStorage',
    }],
    title: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
