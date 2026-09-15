require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const Item = require('../models/Item');
const Market = require('../models/Market');
const User = require('../models/User');
const PriceEntry = require('../models/PriceEntry');

const ADMIN_EMAIL = 'admin@pricelookup.test';
const ADMIN_PASSWORD = 'Admin@12345';
const TRADER1_EMAIL = 'trader1@pricelookup.test';
const TRADER2_EMAIL = 'trader2@pricelookup.test';
const TRADER_PASSWORD = 'Trader@12345';

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function seed() {
  await connectDB(process.env.MONGO_URI);
  console.log('Connected to MongoDB, clearing existing collections...');

  await Promise.all([
    Item.deleteMany({}),
    Market.deleteMany({}),
    User.deleteMany({}),
    PriceEntry.deleteMany({}),
  ]);

  const items = await Item.insertMany([
    { name: 'Goat', category: 'Livestock' },
    { name: 'Camel', category: 'Livestock' },
    { name: 'Cattle', category: 'Livestock' },
    { name: 'Sheep', category: 'Livestock' },
    { name: 'Maize', category: 'Crop' },
    { name: 'Sorghum', category: 'Crop' },
  ]);

  const markets = await Market.insertMany([
    { name: 'Bakara Market', region: 'Mogadishu' },
    { name: 'Hargeisa Livestock Market', region: 'Hargeisa' },
    { name: 'Kismayo Market', region: 'Kismayo' },
    { name: 'Baidoa Market', region: 'Baidoa' },
  ]);

  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const trader1Hash = await bcrypt.hash(TRADER_PASSWORD, 10);
  const trader2Hash = await bcrypt.hash(TRADER_PASSWORD, 10);

  const admin = await User.create({
    name: 'Platform Admin',
    email: ADMIN_EMAIL,
    passwordHash: adminHash,
    role: 'admin',
  });

  const trader1 = await User.create({
    name: 'Amina Trader',
    email: TRADER1_EMAIL,
    passwordHash: trader1Hash,
    role: 'trader',
  });

  const trader2 = await User.create({
    name: 'Farah Trader',
    email: TRADER2_EMAIL,
    passwordHash: trader2Hash,
    role: 'trader',
  });

  const traders = [trader1, trader2];
  const basePrices = {
    Goat: 80,
    Camel: 450,
    Cattle: 350,
    Sheep: 70,
    Maize: 25,
    Sorghum: 20,
  };

  const approvedEntries = [];
  let dayOffset = 28;
  for (const item of items) {
    for (const market of markets) {
      // 2-3 historical points per item+market pair, spread over ~4 weeks
      const points = 2 + (approvedEntries.length % 2);
      for (let i = 0; i < points; i++) {
        const drift = (Math.random() - 0.5) * basePrices[item.name] * 0.15;
        approvedEntries.push({
          item: item._id,
          market: market._id,
          price: Math.round((basePrices[item.name] + drift) * 100) / 100,
          submittedBy: traders[approvedEntries.length % traders.length]._id,
          status: 'approved',
          dateSubmitted: daysAgo(dayOffset - i * 3),
        });
      }
    }
    dayOffset -= 2;
  }
  // Trim/pad to land in the 15-20 range requested by the spec while keeping variety
  const approvedSlice = approvedEntries.slice(0, 18);
  await PriceEntry.insertMany(approvedSlice);

  const pendingEntries = [
    {
      item: items[0]._id,
      market: markets[0]._id,
      price: 85,
      submittedBy: trader1._id,
      status: 'pending',
      dateSubmitted: daysAgo(1),
    },
    {
      item: items[4]._id,
      market: markets[2]._id,
      price: 27,
      submittedBy: trader2._id,
      status: 'pending',
      dateSubmitted: daysAgo(0),
    },
  ];
  await PriceEntry.insertMany(pendingEntries);

  const rejectedEntries = [
    {
      item: items[2]._id,
      market: markets[3]._id,
      price: 900,
      submittedBy: trader1._id,
      status: 'rejected',
      dateSubmitted: daysAgo(5),
    },
  ];
  await PriceEntry.insertMany(rejectedEntries);

  console.log('Seed complete:');
  console.log(`  Items: ${items.length}`);
  console.log(`  Markets: ${markets.length}`);
  console.log(`  Users: 1 admin, ${traders.length} traders`);
  console.log(`  PriceEntries: ${approvedSlice.length} approved, ${pendingEntries.length} pending, ${rejectedEntries.length} rejected`);

  await require('mongoose').disconnect();
}

seed()
  .then(() => {
    console.log('Done.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
