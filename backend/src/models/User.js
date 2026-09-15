const mongoose = require('mongoose');

// Shared collection for Trader and Admin: identical email/password + JWT auth
// logic for both roles, differentiated only by `role` at request time.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ['trader', 'admin'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
