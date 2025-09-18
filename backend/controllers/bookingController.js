const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const User = require('../models/User');

// CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    const { listingId, startDate, endDate } = req.body;
    const ownerId = req.user.id;

    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Only pet owners can request bookings' });
    }

    if (!listingId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Listing, start date and end date are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf()) || start >= end) {
      return res.status(400).json({ message: 'Please provide a valid date range' });
    }

    const listing = await Listing.findByPk(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.sitterId === ownerId) {
      return res.status(400).json({ message: 'You cannot book your own listing' });
    }

    const booking = await Booking.create({
      listingId,
      ownerId,
      startDate,
      endDate,
      status: 'pending'
    });

    const bookingWithRelations = await Booking.findByPk(booking.id, {
      include: [
        { model: Listing, include: [{ model: User, attributes: ['id', 'name', 'email'] }] },
        { model: User, attributes: ['id', 'name', 'email'] }
      ]
    });

    res.json(bookingWithRelations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET BOOKINGS FOR OWNER
exports.getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Only pet owners can view these bookings' });
    }

    const bookings = await Booking.findAll({
      where: { ownerId: req.user.id },
      order: [['startDate', 'DESC']],
      include: [
        { model: Listing, include: [{ model: User, attributes: ['id', 'name', 'email'] }] },
        { model: User, attributes: ['id', 'name', 'email'] }
      ]
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
    if (req.user.role !== 'sitter') {
      return res.status(403).json({ message: 'Only sitters can view these bookings' });
    }

    const bookings = await Booking.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: Listing, where: { sitterId: req.user.id }, include: [{ model: User, attributes: ['id', 'name', 'email'] }] },
        { model: User, attributes: ['id', 'name', 'email'] }
      ]
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
    if (req.user.role !== 'sitter' || booking.Listing.sitterId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { status } = req.body; // approve/reject
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await booking.update({ status });
    const updatedBooking = await Booking.findByPk(booking.id, {
      include: [
        { model: Listing, include: [{ model: User, attributes: ['id', 'name', 'email'] }] },
        { model: User, attributes: ['id', 'name', 'email'] }
      ]
    });
    res.json(updatedBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
