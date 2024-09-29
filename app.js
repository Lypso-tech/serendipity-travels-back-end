const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const imageRoutes = require('./routes/imageRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const travelPackageRouter = require('./routes/travelPackageRouter');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const path = require('path'); 

dotenv.config();
const app = express();
app.use(express.json());
app.use(logger);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((error) => console.error('MongoDB connection error:', error));

app.use('/api/users', userRoutes);
app.use('/api/files', imageRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/travel', travelPackageRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
