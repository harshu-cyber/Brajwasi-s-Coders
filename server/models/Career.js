const mongoose = require('mongoose');

const CareerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add your email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add your phone number'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Please specify the role you are applying for'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please select job type'],
    enum: ['full-time', 'part-time']
  },
  experience: {
    type: String,
    required: [true, 'Please specify your experience level'],
    trim: true
  },
  resumeLink: {
    type: String,
    required: [true, 'Please provide your resume or portfolio link'],
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'],
    default: 'new'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Career', CareerSchema);
