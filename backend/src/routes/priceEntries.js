const express = require('express');
const mongoose = require('mongoose');
const Item = require('../models/Item');
const Market = require('../models/Market');
const PriceEntry = require('../models/PriceEntry');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Submit a new price entry (Trader only). status and submittedBy are always
// controlled server-side, never trusted from the client.
router.post('/', requireAuth, requireRole('trader'), async (req, res) => {
  try {
    const { item, market, price } = req.body;

    if (!item || !mongoose.isValidObjectId(item)) {
      return res.status(400).json({ error: 'a valid item id is required' });
    }
    if (!market || !mongoose.isValidObjectId(market)) {
      return res.status(400).json({ error: 'a valid market id is required' });
    }
    if (price === undefined || typeof price !== 'number' || Number.isNaN(price) || price < 0) {
      return res.status(400).json({ error: 'price must be a non-negative number' });
    }

    const [itemDoc, marketDoc] = await Promise.all([Item.findById(item), Market.findById(market)]);
    if (!itemDoc) return res.status(400).json({ error: 'item does not exist' });
    if (!marketDoc) return res.status(400).json({ error: 'market does not exist' });

    const entry = await PriceEntry.create({
      item,
      market,
      price,
      submittedBy: req.user.id,
      status: 'pending',
      dateSubmitted: new Date(),
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit price entry' });
  }
});

// Trader's own submissions
router.get('/mine', requireAuth, requireRole('trader'), async (req, res) => {
  try {
    const entries = await PriceEntry.find({ submittedBy: req.user.id })
      .sort({ dateSubmitted: -1 })
      .populate('item', 'name category')
      .populate('market', 'name region');
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load your submissions' });
  }
});

module.exports = router;
