const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const imageStorage = new mongoose.Schema({ 
    _id: { type: String, default: uuidv4 },
    imagePath: {
        type: String,
        required: true,
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    },
});

const ImageStorage = mongoose.model('ImageStorage', imageStorage);

module.exports = ImageStorage;
