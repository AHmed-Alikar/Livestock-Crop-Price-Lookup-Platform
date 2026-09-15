const mongoose = require('mongoose');

const priceEntrySchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    market: { type: mongoose.Schema.Types.ObjectId, ref: 'Market', required: true },
    price: { type: Number, required: true, min: 0 },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, required: true, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    // Semantically correct field for price-history ordering (domain date),
    // kept separate from `createdAt` even though they usually match.
    dateSubmitted: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

priceEntrySchema.index({ item: 1, market: 1, status: 1, dateSubmitted: 1 });

module.exports = mongoose.model('PriceEntry', priceEntrySchema);
