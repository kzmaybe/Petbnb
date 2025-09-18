const express = require('express');
const {
  createBooking,
  getOwnerBookings,
  getSitterBookings,
  updateBooking
} = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createBooking);
router.get('/owner', authMiddleware, getOwnerBookings);
router.get('/sitter', authMiddleware, getSitterBookings);
router.put('/:id', authMiddleware, updateBooking);

module.exports = router;
