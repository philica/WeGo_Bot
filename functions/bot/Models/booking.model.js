const mongoose = require('mongoose');

// Define the booking schema
const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    passengerCount: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create the booking model
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;