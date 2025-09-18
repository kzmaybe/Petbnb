const express = require('express');
const {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  getMyListings
} = require('../controllers/listingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getListings);
router.post('/', authMiddleware, createListing);
router.get('/me', authMiddleware, getMyListings);
router.get('/:id', getListing);
router.put('/:id', authMiddleware, updateListing);
router.delete('/:id', authMiddleware, deleteListing);

module.exports = router;
