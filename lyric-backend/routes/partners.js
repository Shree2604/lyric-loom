/**
 * @swagger
 * tags:
 *   name: Partners
 *   description: B2B partner management and API key usage
 */
/**
 * @swagger
 * /api/partners:
 *   post:
 *     summary: Add a new B2B partner
 *     tags: [Partners]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Partner added successfully
 *       400:
 *         description: Partner name required or already exists
 *       500:
 *         description: Failed to add partner
 *   get:
 *     summary: List all partners
 *     tags: [Partners]
 *     responses:
 *       200:
 *         description: List of partners
 *       500:
 *         description: Failed to fetch partners
 */
/**
 * @swagger
 * /api/partners/usage/{partnerId}:
 *   get:
 *     summary: Get API usage stats for a partner
 *     tags: [Partners]
 *     parameters:
 *       - in: path
 *         name: partnerId
 *         schema:
 *           type: string
 *         required: true
 *         description: Partner ID
 *     responses:
 *       200:
 *         description: Usage logs for partner
 *       500:
 *         description: Failed to fetch usage logs
 */
/**
 * @swagger
 * /api/partners/{id}:
 *   delete:
 *     summary: Delete a partner by ID
 *     tags: [Partners]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Partner ID
 *     responses:
 *       200:
 *         description: Partner deleted
 *       404:
 *         description: Partner not found
 *       500:
 *         description: Failed to delete partner
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const crypto = require('crypto');


// Partner schema (for demo; ideally move to models/Partner.js)
const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  apiKey: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  allowedEndpoints: { type: [String], default: [] },
});
const Partner = mongoose.models.Partner || mongoose.model('Partner', partnerSchema);

// POST /api/partners
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Partner name is required.' });

  try {
    const apiKey = crypto.randomBytes(32).toString('hex');
    const partner = new Partner({ name, apiKey });
    await partner.save();
    res.json({ apiKey });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Partner already exists.' });
    } else {
      res.status(500).json({ message: 'Failed to add partner.' });
    }
  }
});

// GET /api/partners - List all partners (no Redis caching)
router.get('/', async (req, res) => {
  try {
    const partners = await Partner.find({}, { name: 1, apiKey: 1, enabled: 1, _id: 1 });
    res.json({ data: partners, cached: false });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch partners.' });
  }
});

// GET /api/partners/usage/:partnerId - Get API usage stats for a partner (no Redis caching)
const ApiKeyUsageLog = require('../models/ApiKeyUsageLog');
router.get('/usage/:partnerId', async (req, res) => {
  try {
    const logs = await ApiKeyUsageLog.find({ partner: req.params.partnerId })
      .sort({ timestamp: -1 })
      .select('endpoint timestamp apiKey');
    res.json({ data: logs, cached: false });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch usage logs.' });
  }
});

// DELETE /api/partners/:id - Delete a partner by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await Partner.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Partner not found.' });
    res.json({ message: 'Partner deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete partner.' });
  }
});

module.exports = router;
