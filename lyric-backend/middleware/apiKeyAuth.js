const mongoose = require('mongoose');
const Partner = require('../models/Partner');
const ApiKeyUsageLog = require('../models/ApiKeyUsageLog');

// Logs each API key usage with timestamp and endpoint
const logApiKeyUsage = async (partner, req) => {
  await ApiKeyUsageLog.create({
    partner: partner._id,
    apiKey: partner.apiKey,
    endpoint: req.originalUrl,
    timestamp: new Date()
  });
};

module.exports = async function(req, res, next) {
  const apiKey = req.header('x-api-key');
  if (!apiKey) return res.status(401).json({ message: 'API key required' });

  const partner = await Partner.findOne({ apiKey, enabled: true });
  if (!partner) return res.status(401).json({ message: 'Invalid API key' });

  req.partner = partner; // Optionally attach partner info to req
  await logApiKeyUsage(partner, req);
  next();
};
