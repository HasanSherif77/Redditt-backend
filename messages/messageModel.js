

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 1000
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/* Update updatedAt on save */
messageSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

/* Indexes for better query performance */
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, createdAt: -1 });
messageSchema.index({ read: 1 });

module.exports = mongoose.model('Message', messageSchema);