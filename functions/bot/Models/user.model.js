const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  chatId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  studentIDNumber: {
    type: String,
    required: true,
    unique: true
  },
  studentIDImage: {
    type: String,
    required: true,
    unique: true
  },
  yearOfStudy: {
    type: String,
    required: true
  }
}, { timestamps: true });

const User = mongoose.model('user', studentSchema);

module.exports = User;