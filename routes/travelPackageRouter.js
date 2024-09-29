const express = require('express');
const travelPackageController = require('../controllers/travelPackageController');
const router = express.Router();

// CRUD routes
router.post('/packages', travelPackageController.createTravelPackage);
router.get('/packages', travelPackageController.getAllTravelPackages);
router.get('/packages/:id', travelPackageController.getTravelPackageById);
router.put('/packages/:id', travelPackageController.updateTravelPackage);
router.delete('/packages/:id', travelPackageController.deleteTravelPackage);

// Comment and Vote routes
router.post('/packages/:id/comment', travelPackageController.addComment);
router.post('/packages/:id/vote', travelPackageController.addVote);

module.exports = router;
