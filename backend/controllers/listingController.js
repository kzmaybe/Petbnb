const Listing = require('../models/Listing');
const User = require('../models/User');

// CREATE LISTING
exports.createListing = async (req, res) => {
  try {
    if (req.user.role !== 'sitter') {
      return res.status(403).json({ message: 'Only sitters can create listings' });
    }

    const { title, description, price, location } = req.body;

    if (!title || !description || !price || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const listing = await Listing.create({
      title,
      description,
      price,
      location,
      sitterId: req.user.id
    });

    const listingWithHost = await Listing.findByPk(listing.id, { include: User });
    res.json(listingWithHost);
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

exports.getMyListings = async (req, res) => {
  try {
    if (req.user.role !== 'sitter') {
      return res.status(403).json({ message: 'Only sitters can access their listings' });
    }

    const listings = await Listing.findAll({
      where: { sitterId: req.user.id },
      include: User
    });

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
    if (req.user.role !== 'sitter' || listing.sitterId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

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
    if (req.user.role !== 'sitter' || listing.sitterId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await listing.destroy();
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
