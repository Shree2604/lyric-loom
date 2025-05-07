const mongoose = require("mongoose");
const Joi = require("joi");

const songSchema = new mongoose.Schema({
  name: { type: String, required: true },
  artist: { type: String, required: true },
  song: { type: String, required: true }, 
  img: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  artistEmail: { type: String, required: false },
  rejectionReason: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

songSchema.index({ name: 1 }); // For fast song name search
songSchema.index({ artist: 1 }); // For artist-based queries
songSchema.index({ createdAt: -1 }); // For recent songs

const validate = (song) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    artist: Joi.string().required(),
    song: Joi.string().required(), 
    img: Joi.string().required(), 
    status: Joi.string().valid('pending', 'approved', 'rejected'),
    rejectionReason: Joi.string().optional()

  });
  return schema.validate(song);
};

const Song = mongoose.model("song", songSchema);

module.exports = { Song, validate };
