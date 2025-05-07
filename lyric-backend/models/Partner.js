const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  apiKey: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  allowedEndpoints: { type: [String], default: [] },
});

const Partner = mongoose.model('Partner', partnerSchema);

module.exports = Partner;
