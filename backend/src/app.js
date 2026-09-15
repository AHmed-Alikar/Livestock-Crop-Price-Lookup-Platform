const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');
const priceEntryRoutes = require('./routes/priceEntries');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/price-entries', priceEntryRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
