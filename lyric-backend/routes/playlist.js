const express = require('express');
const axios = require('axios');
const getRedisClient = require('../utilis/redisClient');
const router = express.Router();

// GET /api/playlists?category=Pop
router.get('/', async (req, res) => {
  const category = req.query.category || 'top playlists';
  const cacheKey = `playlists:${category}`;
  const redisClient = await getRedisClient();

  try {
    // Try to get cached data
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({ source: 'cache', data: JSON.parse(cached) });
    }

    // If not cached, fetch from external API
    const response = await axios.get('https://saavn.dev/api/search/playlists', {
      params: { query: category },
    });
    if (response.data.success) {
      const playlists = response.data.data.results.map(playlist => ({
        id: playlist.id,
        name: playlist.name,
        images: playlist.image ? [{ url: playlist.image[2].url }] : [],
        tracks: {
          total: playlist.songCount,
          songs: playlist.songs ? playlist.songs.map(song => ({
            id: song.id,
            title: song.title,
            url: song.playUrl,
          })) : []
        },
      }));
      // Cache for 6 hours
      await redisClient.set(cacheKey, JSON.stringify(playlists), { EX: 21600 });
      return res.json({ source: 'api', data: playlists });
    } else {
      return res.status(502).json({ message: 'Failed to fetch playlists from external API.' });
    }
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
