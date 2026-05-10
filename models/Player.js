const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  psid: { type: String, required: true, unique: true },
  balance: { type: Number, default: 500 },
  lastWork: { type: Date, default: 0 },
  inventory: [String]
});

module.exports = mongoose.model('Player', playerSchema);