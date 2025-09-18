const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const User = require('../models/User');

// CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    const { listingId, startDate, endDate } = req.body;
    const ownerId = req.user.id;

    const listing = await Listing.findByPk(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const booking = await Booking.create({
      listingId,
      ownerId,
      startDate,
      endDate,
      status: 'pending'
    });

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET BOOKINGS FOR OWNER
exports.getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { ownerId: req.user.id },
      include: [Listing, User]
    });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET BOOKINGS FOR SITTER
exports.getSitterBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [{ model: Listing, where: { sitterId: req.user.id } }, User]
    });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE BOOKING STATUS
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, { include: Listing });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.Listing.sitterId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    const { status } = req.body; // approve/reject
    await booking.update({ status });
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
