const mongoose = require('mongoose');
const apiKeyUsageLogSchema = new mongoose.Schema({
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
  apiKey: { type: String },
  endpoint: String,
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ApiKeyUsageLog', apiKeyUsageLogSchema);
