/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Missing or invalid credentials
 *       401:
 *         description: Invalid Email or Password
 *       429:
 *         description: Too many login attempts. Please try again later.
 *       500:
 *         description: Internal Server Error
 */
const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const getRedisClient = require("../utilis/redisClient");

// Rate limiting middleware for login/signup using Redis
const RATE_LIMIT = 3; // Max 5 attempts
const WINDOW = 60; // 1 minute window

async function rateLimit(req, res, next) {
  const ip = req.ip;
  const key = `rate:login:${ip}`;
  const redis = await getRedisClient();
  try {
    let count = await redis.get(key);
    if (count && parseInt(count) >= RATE_LIMIT) {
      console.log(`[RATE LIMIT] BLOCKED IP ${ip} - too many attempts (cache hit)`);
      return res.status(429).send({ message: "Too many login attempts. Please try again later." });
    }
    await redis.multi()
      .incr(key)
      .expire(key, WINDOW)
      .exec();
    if (count) {
      console.log(`[RATE LIMIT] IP ${ip} - attempt ${parseInt(count) + 1} (cache hit)`);
    } else {
      console.log(`[RATE LIMIT] IP ${ip} - first attempt (cache miss)`);
    }
    next();
  } catch (err) {
    console.error("[RATE LIMIT] Redis error:", err);
    // Fail open if Redis fails
    next();
  }
}

// POST route for user login
router.post("/", rateLimit, async (req, res) => {
  try {
    // Check if both email and password are provided
    if (req.body.email && req.body.password) {
      const { error } = validateLogin(req.body); // Validate the request body
      if (error)
        return res.status(400).send({ message: error.details[0].message });

      // Find user by email
      let user = await User.findOne({ email: req.body.email });
      if (!user)
        return res.status(400).send({ message: "Invalid Email or Password" });

      // Check if password is valid
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword)
        return res.status(401).send({ message: "Invalid Email or Password" });

      // Check if the user is verified 
      if (!user.verified) {
        return res
          .status(400)
          .send({ message: "Please verify your account before logging in." });
      }

      // Generate an authentication token for the user
      const authToken = user.generateAuthToken();

      // Return user data and token upon successful login
      return res
        .status(200)
        .send({ data: user, authToken, message: "Logged in successfully" });
    } else {
      return res
        .status(400)
        .send({ message: "Email and password are required" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

// Validate function for validating email and password input
const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = router;
