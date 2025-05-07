


const express = require('express');
const router = express.Router();
const SharedFavorites = require('../models/SharedFavorites');
const Song = require('../models/song');
const { v4: uuidv4 } = require('uuid');

// POST /api/shared-favorites
// Body: { songs: [songId1, songId2, ...] }
router.post('/', async (req, res) => {
  try {
    const { songs } = req.body;
    if (!songs || !Array.isArray(songs) || songs.length === 0) {
      return res.status(400).json({ error: 'No songs provided' });
    }
    const shareId = uuidv4();
    await SharedFavorites.create({ shareId, songs });
    res.json({ shareId });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/shared-favorites/:shareId
router.get('/:shareId', async (req, res) => {
  try {
    const { shareId } = req.params;
    const shared = await SharedFavorites.findOne({ shareId }).populate('songs');
    if (!shared) return res.status(404).json({ error: 'Not found' });
    res.json({ songs: shared.songs });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
