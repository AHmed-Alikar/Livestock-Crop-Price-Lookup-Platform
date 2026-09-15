const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ['Livestock', 'Crop'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
