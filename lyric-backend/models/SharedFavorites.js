const mongoose = require('mongoose');

const SharedFavoritesSchema = new mongoose.Schema({
  shareId: { type: String, required: true, unique: true },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'song', // changed from 'Song' to match model name
    required: true
  }],
  createdAt: { type: Date, default: Date.now, expires: '7d' } // auto-delete after 7 days
});

module.exports = mongoose.model('SharedFavorites', SharedFavoritesSchema);
