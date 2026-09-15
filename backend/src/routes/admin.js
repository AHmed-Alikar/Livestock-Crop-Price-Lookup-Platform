const express = require('express');
const mongoose = require('mongoose');
const Item = require('../models/Item');
const Market = require('../models/Market');
const PriceEntry = require('../models/PriceEntry');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth, requireRole('admin'));

// ---- Price entry approval queue ----

router.get('/price-entries', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) {
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'invalid status filter' });
      }
      filter.status = status;
    }
    const entries = await PriceEntry.find(filter)
      .sort({ dateSubmitted: -1 })
      .populate('item', 'name category')
      .populate('market', 'name region')
      .populate('submittedBy', 'name email');
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load price entries' });
  }
});

router.patch('/price-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'invalid price entry id' });
    }
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'status must be "approved" or "rejected"' });
    }

    const entry = await PriceEntry.findByIdAndUpdate(id, { status }, { new: true });
    if (!entry) {
      return res.status(404).json({ error: 'price entry not found' });
    }
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update price entry' });
  }
});

// ---- Item management ----

router.post('/items', async (req, res) => {
  try {
    const { name, category } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: 'name and category are required' });
    }
    if (!['Livestock', 'Crop'].includes(category)) {
      return res.status(400).json({ error: 'category must be "Livestock" or "Crop"' });
    }
    const item = await Item.create({ name, category });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

router.patch('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'invalid item id' });
    }
    const { name, category } = req.body;
    if (category && !['Livestock', 'Crop'].includes(category)) {
      return res.status(400).json({ error: 'category must be "Livestock" or "Crop"' });
    }
    const update = {};
    if (name !== undefined) update.name = name;
    if (category !== undefined) update.category = category;

    const item = await Item.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

router.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'invalid item id' });
    }
    const item = await Item.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ error: 'item not found' });
    // Data-integrity: remove dependent price entries so the platform never
    // shows history rows pointing at a deleted item.
    await PriceEntry.deleteMany({ item: id });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// ---- Market management ----

router.post('/markets', async (req, res) => {
  try {
    const { name, region } = req.body;
    if (!name || !region) {
      return res.status(400).json({ error: 'name and region are required' });
    }
    const market = await Market.create({ name, region });
    res.status(201).json(market);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create market' });
  }
});

router.patch('/markets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'invalid market id' });
    }
    const { name, region } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (region !== undefined) update.region = region;

    const market = await Market.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!market) return res.status(404).json({ error: 'market not found' });
    res.json(market);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update market' });
  }
});

router.delete('/markets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'invalid market id' });
    }
    const market = await Market.findByIdAndDelete(id);
    if (!market) return res.status(404).json({ error: 'market not found' });
    await PriceEntry.deleteMany({ market: id });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete market' });
  }
});

module.exports = router;
