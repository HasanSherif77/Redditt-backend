const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  communityName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  communityDescription: {
    type: String,
    required: true,
    trim: true
  },
  communityMembersCount: {
    type: Number,
    default: 1
  },
  communityIcon: {
    type: String,
    default: ''
  },
  communityBanner: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Community', communitySchema);

