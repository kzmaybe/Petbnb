const express = require('express');
const {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing
} = require('../controllers/listingController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getListings);
router.get('/:id', getListing);
router.post('/', authMiddleware, createListing);
router.put('/:id', authMiddleware, updateListing);
router.delete('/:id', authMiddleware, deleteListing);

module.exports = router;
