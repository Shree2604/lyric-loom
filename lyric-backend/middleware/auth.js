const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
dotenv = require("dotenv").config();

module.exports = (req, res, next) => {
	const token = req.header("x-auth-token");
	if (!token) {
		return res.status(401).send({ message: "Access denied, no token provided." });
	}

	try {
		const validToken = jwt.verify(token, process.env.JWT_SECRET);
		
		// Validate that _id is a valid MongoDB ObjectId
		if (!validToken._id || !mongoose.Types.ObjectId.isValid(validToken._id)) {
			return res.status(400).send({ message: "Invalid user ID in token" });
		}

		req.user = {
			...validToken,
			_id: validToken._id // Already converted to string in token generation
		};
		next();
	} catch (err) {
		return res.status(401).send({ message: "Invalid token" });
	}
};
