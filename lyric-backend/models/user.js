const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const moment = require('moment-timezone');
dotenv = require("dotenv").config();

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	gender: { type: String, required: true },
	likedSongs: { type: [String], default: [] },
	playlists: { type: [String], default: [] },
	isAdmin: { type: Boolean, default: false },
	isArtist: { type: Boolean, default: false },
	createdAt: { type: String, default: () => moment().tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss A') },
	verified: { type: Boolean, default: false },
});

userSchema.index({ email: 1 }); // For fast user lookup by email
userSchema.index({ name: 1 }); // For user search by name
userSchema.index({ isArtist: 1 }); // For artist filtering
userSchema.index({ isArtist: 1, isAdmin: 1, verified: 1 }); // Compound for admin/artist/verified queries
userSchema.index({ likedSongs: 1 }); // For finding users by liked song
userSchema.index({ createdAt: -1 }); // For sorting/filtering by creation date

userSchema.methods.generateAuthToken = function () {
	if (!process.env.JWT_SECRET) {
		throw new Error("JWT_SECRET is not defined in environment variables.");
	}
	// Convert ObjectId to string to ensure it's properly serialized
	const token = jwt.sign(
		{ 
			_id: this._id.toString(),
			name: this.name,
			email: this.email,
			isAdmin: this.isAdmin,
			isArtist: this.isArtist
		},
		process.env.JWT_SECRET,
		{ expiresIn: "7d" }
	);
	return token;
};
//this is a method to generate token for user

const validate = (user) => {
	const schema = Joi.object({
		name: Joi.string().min(4).max(20).required(),
		email: Joi.string().email().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).required(),
		password: passwordComplexity().required(),
		gender: Joi.string().valid("male", "female", "non-binary").required(),
	});
	return schema.validate(user);
};

const User = mongoose.model("user", userSchema);

module.exports = { User, validate };
