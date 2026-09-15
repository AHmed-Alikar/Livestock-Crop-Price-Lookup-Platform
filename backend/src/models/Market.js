const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Market', marketSchema);
