const mongoose = require("mongoose");
const Joi = require("joi");

const ObjectId = mongoose.Schema.Types.ObjectId;

const playListSchema = new mongoose.Schema({
	name: { type: String, required: true },
	user: { type: ObjectId, ref: "user", required: true },
	desc: { type: String },
	songs: { type: Array, default: [null] },
	img: { type: String },
});

playListSchema.index({ user: 1 }); // For fast lookup by user
playListSchema.index({ name: 1 }); // For playlist name search
playListSchema.index({ songs: 1 }); // For efficient song queries in playlists

const validate = (playList) => {
	const schema = Joi.object({
		name: Joi.string().required().allow(""),
		user: Joi.string().required(),
		desc: Joi.string().allow(""),
		songs: Joi.array().items(Joi.string()),
		img: Joi.string().allow(""),
	});
	return schema.validate(playList);
};

const PlayList = mongoose.model("playList", playListSchema);

module.exports = { PlayList, validate };
