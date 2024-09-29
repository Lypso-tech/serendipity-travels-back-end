const ImageStorage = require('../models/ImageStorage');

exports.uploadImage = async (req, res) => {
    try {
        const imagePath = req.file.path;
        const newImage = new ImageStorage({ imagePath });
        await newImage.save();
        res.status(201).json(newImage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllImages = async (req, res) => {
    try {
        const images = await ImageStorage.find();
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getImageById = async (req, res) => {
    try {
        const image = await ImageStorage.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.status(200).json(image);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateImage = async (req, res) => {
    try {
        const image = await ImageStorage.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.status(200).json(image);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const image = await ImageStorage.findByIdAndDelete(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
