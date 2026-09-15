const express = require('express');
const mongoose = require('mongoose');
const Item = require('../models/Item');
const Market = require('../models/Market');
const PriceEntry = require('../models/PriceEntry');

const router = express.Router();

router.get('/items', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) {
      if (!['Livestock', 'Crop'].includes(category)) {
        return res.status(400).json({ error: 'category must be "Livestock" or "Crop"' });
      }
      filter.category = category;
    }
    const items = await Item.find(filter).sort({ name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load items' });
  }
});

router.get('/markets', async (req, res) => {
  try {
    const markets = await Market.find().sort({ name: 1 });
    res.json(markets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load markets' });
  }
});

// Current approved prices across all markets for one item
router.get('/prices', async (req, res) => {
  try {
    const { item } = req.query;
    if (!item || !mongoose.isValidObjectId(item)) {
      return res.status(400).json({ error: 'a valid item id is required' });
    }

    const entries = await PriceEntry.find({ item, status: 'approved' })
      .sort({ dateSubmitted: -1 })
      .populate('market', 'name region')
      .lean();

    // Reduce to the most recent approved entry per market
    const latestByMarket = new Map();
    for (const entry of entries) {
      const marketId = entry.market._id.toString();
      if (!latestByMarket.has(marketId)) {
        latestByMarket.set(marketId, entry);
      }
    }

    res.json(Array.from(latestByMarket.values()));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load current prices' });
  }
});

// Approved price history for one item+market pair
router.get('/prices/history', async (req, res) => {
  try {
    const { item, market } = req.query;
    if (!item || !mongoose.isValidObjectId(item) || !market || !mongoose.isValidObjectId(market)) {
      return res.status(400).json({ error: 'a valid item id and market id are required' });
    }

    const entries = await PriceEntry.find({ item, market, status: 'approved' })
      .sort({ dateSubmitted: 1 })
      .select('price dateSubmitted')
      .lean();

    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load price history' });
  }
});

module.exports = router;
