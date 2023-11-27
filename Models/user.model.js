const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
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
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profilePictureURL: {
    type: String // Assuming you store the URL to the picture
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