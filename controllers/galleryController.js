const Gallery = require('../models/Gallery');
const ImageStorage = require('../models/ImageStorage');

exports.createGallery = async (req, res) => {
    const { title, images } = req.body;

    try {
        let foundImages = [];

        const fetchImages = async () => {
            foundImages = await Promise.all(images.map(async (image) => {
                return await ImageStorage.find({
                    _id: { $in: image }
                });
            }));
        };
        await fetchImages();

        if (foundImages.length !== images.length) {
            return res.status(400).json({
                message: 'One or more image IDs are invalid or do not exist.'
            });
        }

        const gallery = new Gallery({
            title,
            images,
        });

        await gallery.save();

        const data = {
            title,
            foundImages, 
        }
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get all galleries
exports.getGalleries = async (req, res) => {
    try {
        const galleries = await Gallery.find().populate('images');
        res.status(200).json(galleries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a gallery by ID
exports.getGalleryById = async (req, res) => {
    const { id } = req.params;
    try {
        const gallery = await Gallery.findById(id).populate('images');
        if (!gallery) {
            return res.status(404).json({ message: 'Gallery not found' });
        }
        res.status(200).json(gallery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a gallery by ID
exports.updateGallery = async (req, res) => {
    const { id } = req.params;
    const { title, images } = req.body;

    try {
        const gallery = await Gallery.findByIdAndUpdate(id, { title, images }, { new: true });
        if (!gallery) {
            return res.status(404).json({ message: 'Gallery not found' });
        }
        res.status(200).json(gallery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a gallery by ID
exports.deleteGallery = async (req, res) => {
    const { id } = req.params;
    try {
        const gallery = await Gallery.findByIdAndDelete(id);
        if (!gallery) {
            return res.status(404).json({ message: 'Gallery not found' });
        }
        res.status(200).json({ message: 'Gallery deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
