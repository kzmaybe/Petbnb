const Listing = require('../models/Listing');
const User = require('../models/User');

// CREATE LISTING
exports.createListing = async (req, res) => {
  try {
    const { title, description, price, location } = req.body;
    const userId = req.user.id;

    const listing = await Listing.create({
      title,
      description,
      price,
      location,
      sitterId: userId
    });

    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ALL LISTINGS
exports.getListings = async (req, res) => {
  try {
    const listings = await Listing.findAll({ include: User });
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET SINGLE LISTING
exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id, { include: User });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE LISTING
exports.updateListing = async (req, res) => {
  try {
    const { title, description, price, location } = req.body;
    const listing = await Listing.findByPk(req.params.id);

    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.sitterId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    await listing.update({ title, description, price, location });
    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE LISTING
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.sitterId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    await listing.destroy();
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
