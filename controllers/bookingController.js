const Booking = require("../models/Booking");
const TravelPackage = require("../models/travelPackage");

// Create a booking (already provided)
exports.createBooking = async (req, res) => {
  try {
    const { userId, travelPackageId, startDate, duration, seats } = req.body;
    const travelPackage = await TravelPackage.findById(travelPackageId);
    if (!travelPackage)
      return res.status(404).json({ error: "Travel package not found" });

    const totalPrice = travelPackage.price * seats;
    const booking = new Booking({
      userId,
      travelPackageId,
      startDate,
      duration,
      seats,
      totalPrice,
    });

    await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch a specific booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "travelPackageId userId"
    );
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch all bookings (for admin or user-specific bookings)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("travelPackageId userId");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update a booking's details (e.g., update seats or start date)
exports.updateBooking = async (req, res) => {
  try {
    const { startDate, duration, seats, status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Update booking fields if provided
    if (startDate) booking.startDate = startDate;
    if (duration) booking.duration = duration;
    if (seats) booking.seats = seats;
    if (status) booking.status = status;

    await booking.save();
    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    await booking.remove();
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
