const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');

/**
 * @route   POST /api/booking
 * @desc    Create a new booking
 */
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create booking',
      details: error.message,
    });
  }
});

/**
 * @route   GET /api/booking
 * @desc    Get all bookings
 */
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings',
      details: error.message,
    });
  }
});

/**
 * @route   GET /api/booking/:id
 * @desc    Get booking by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching booking',
      details: error.message,
    });
  }
});

/**
 * @route   PUT /api/booking/:id
 * @desc    Update booking by ID
 */
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error updating booking',
      details: error.message,
    });
  }
});

/**
 * @route   DELETE /api/booking/:id
 * @desc    Delete booking by ID
 */
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error deleting booking',
      details: error.message,
    });
  }
});

module.exports = router;
