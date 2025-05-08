/**
 * @swagger
 * tags:
 *   name: Songs
 *   description: Song management
 */

const router = require("express").Router();
const mongoose = require("mongoose");
const { Song, validate } = require("../models/song");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const artist = require("../middleware/artist")
const path = require("path");
const validateObjectId = require("../middleware/validateObjectId");
const multer = require("multer");

// Configure Multer for file uploads (store files in "uploads" folder)
// const upload = multer({ dest: "uploads/" });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files to 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Save file with the original name
  },
});

const upload = multer({ storage: storage });



// Update song status (approve/reject)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).send({ message: "Invalid status" });
    }
    const update = { status };
    if (status === 'rejected') {
      update.rejectionReason = rejectionReason || '';
    } else {
      update.rejectionReason = '';
    }
    const song = await Song.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!song) {
      return res.status(404).send({ message: "Song not found" });
    }
    res.send({ data: song, message: `Song ${status}` });
  } catch (error) {
    console.error("Error updating song status:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


// Bulk approve/reject songs
router.patch("/bulk-status", async (req, res) => {
  try {
    const { songIds, status, rejectionReason } = req.body;
    if (!Array.isArray(songIds) || songIds.length === 0) {
      return res.status(400).send({ message: "No song IDs provided" });
    }
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).send({ message: "Invalid status" });
    }
    const update = { status };
    if (status === 'rejected') {
      update.rejectionReason = rejectionReason || '';
    } else {
      update.rejectionReason = '';
    }
    const result = await Song.updateMany({ _id: { $in: songIds } }, update);
    res.send({ message: `Bulk status update complete`, result });
  } catch (error) {
    console.error("Error in bulk status update:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post(
  "/",
  [upload.fields([{ name: "song" }, { name: "img" }])],
  async (req, res) => {
    try {
      const songFile = req.files["song"][0];
      const imgFile = req.files["img"][0];

      // Always use the name from the JWT
      const songData = {
        name: req.body.name,
        artist: req.user.name, // <-- FIXED: use authenticated artist's name
        song: songFile.path,
        img: imgFile.path,
        status: req.body.status || 'pending'
      };

      const { error } = validate(songData);
      if (error)
        return res.status(400).send({ message: error.details[0].message });

      const song = new Song(songData);
      await song.save();
      res.status(201).send({ data: song, message: "Song created successfully" });
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
);

router.post(
  "/artist",
  [upload.fields([{ name: "song" }, { name: "img" }])],
  async (req, res) => {
    try {
      const songFile = req.files["song"][0]; // Access uploaded song file
      const imgFile = req.files["img"][0]; // Access uploaded image file

      // Create the song object with file paths and other data
      const songData = {
        name: req.body.name,
        artist: req.body.artist,
        song: songFile.path, // Store file path in database
        img: imgFile.path, // Store file path in database
      };

      const { error } = validate(songData); // Validate input
      if (error)
        return res.status(400).send({ message: error.details[0].message });

      const song = new Song(songData); // Save to DB
      await song.save();
      res
        .status(201)
        .send({ data: song, message: "Song created successfully" });
    } catch (error) {
      console.error("Error creating song:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
);

// Get all songs
/**
 * @swagger
 * /api/songs:
 *   get:
 *     summary: Get all songs
 *     tags: [Songs]
 *     parameters:
 *       - in: query
 *         name: status
 *         type: string
 *         enum:
 *           - pending
 *           - approved
 *           - rejected
 *     responses:
 *       200:
 *         description: List of songs
 */
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const songs = await Song.find(filter).lean();
    const songsWithStringIds = songs.map(song => ({
      ...song,
      _id: song._id.toString()
    }));
    res.status(200).send({ data: songsWithStringIds });
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get all liked songs for current user
/**
 * @swagger
 * /api/songs/user/{userId}/liked:
 *   get:
 *     summary: Get all songs liked by a user
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of liked songs
 *       404:
 *         description: User not found
 */
router.get("/user/:userId/liked", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ message: "Invalid user ID format" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    // Filter out any invalid song IDs
    const validSongIds = user.likedSongs.filter(id => mongoose.Types.ObjectId.isValid(id));
    const likedSongs = await Song.find({ _id: { $in: validSongIds } });
    res.status(200).send({ data: likedSongs });
  } catch (error) {
    console.error("Error fetching liked songs:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


// Get all songs uploaded by the current artist
router.get("/mine", async (req, res) => {
  console.log('Artist /mine route req.user:', req.user);
  try {
    const songs = await Song.find({ artist: req.user.name }).lean();
    const songsWithStringIds = songs.map(song => ({
      ...song,
      _id: song._id.toString()
    }));
    res.status(200).send({ data: songsWithStringIds });
  } catch (error) {
    console.error("Error fetching artist's songs:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get all liked songs for the currently authenticated user
router.get("/user/liked", auth ,async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    // Filter out any invalid song IDs
    const validSongIds = user.likedSongs.filter(id => mongoose.Types.ObjectId.isValid(id));
    const likedSongs = await Song.find({ _id: { $in: validSongIds } });
    res.status(200).send({ data: likedSongs });
  } catch (error) {
    console.error("Error fetching liked songs:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


/**
 * @swagger
 * /api/songs/user-liked/{userId}/{songId}:
 *   get:
 *     summary: Check if the user liked a song
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *       - in: path
 *         name: songId
 *         schema:
 *           type: string
 *         required: true
 *         description: Song ID
 *     responses:
 *       200:
 *         description: Returns isLiked true/false
 *       400:
 *         description: Invalid user or song ID format
 *       404:
 *         description: Song or user not found
 */
router.get("/user-liked/:userId/:songId", async (req, res) => {
  try {
    const { userId, songId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ message: "Invalid user ID format" });
    }
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).send({ message: "Invalid song ID format" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).send({ message: "Song not found" });
    }
    const isLiked = user.likedSongs.includes(songId);
    res.status(200).send({ isLiked });
  } catch (error) {
    console.error("Error checking song like status:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


router.put("/like/:songId", auth , async (req, res) => {
  try {
    const userId = req.user._id;
    const { songId } = req.params;
    console.log('Like route called with user:', userId, 'song:', songId);

    // Validate user ID and song ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error('Invalid user ID format:', userId);
      return res.status(400).send({ message: "Invalid user ID format" });
    }
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      console.error('Invalid song ID format:', songId);
      return res.status(400).send({ message: "Invalid song ID format" });
    }

    // Find the song
    console.log('Attempting to find song with ID:', songId);
    const song = await Song.findById(songId);
    if (!song) {
      console.error('Song not found with ID:', songId);
      return res.status(404).send({ message: "Song not found" });
    }

    // Find the user
    console.log('Attempting to find user with ID:', userId);
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found with ID:', userId);
      return res.status(404).send({ message: "User not found" });
    }

    // Defensive: Ensure likedSongs is an array
    if (!Array.isArray(user.likedSongs)) user.likedSongs = [];

    // Convert song ID to string for comparison
    const songIdStr = song._id.toString();
    const index = user.likedSongs.findIndex(id => id.toString() === songIdStr);
    if (index === -1) {
      // Like the song
      user.likedSongs.push(songIdStr);
      console.log('Added song to likes:', songIdStr);
    } else {
      // Unlike the song
      user.likedSongs.splice(index, 1);
      console.log('Removed song from likes:', songIdStr);
    }

    await user.save();
    const response = { message: "Song like status updated", isLiked: index === -1, likedSongs: user.likedSongs };
    res.status(200).send(response);
  } catch (error) {
    console.error("Error updating song like:", error);
    res.status(500).send({ message: "Internal Server Error", error: error.message });
  }
});

// Check if user has liked a song
/**
 * @swagger
 * /api/songs/check-like/{id}:
 *   get:
 *     summary: Check if the current user has liked a song
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Song ID
 *     responses:
 *       200:
 *         description: Returns isLiked true/false
 *       400:
 *         description: Invalid song ID format
 *       404:
 *         description: Song or user not found
 */
router.get("/check-like/:id", async (req, res) => {
  try {
    // First validate the song ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({ message: "Invalid song ID format" });
    }

    const { userId } = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ message: "Invalid user ID format" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).send({ message: "Song not found" });
    }

    const songId = req.params.id;
    const isLiked = user.likedSongs.includes(songId);

    res.status(200).send({ isLiked });
  } catch (error) {
    console.error("Error checking song like status:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get all liked songs for current user
/**
 * @swagger
 * /api/songs/user/{userId}/liked:
 *   get:
 *     summary: Get all songs liked by a user
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of liked songs
 *       404:
 *         description: User not found
 */
router.get("/user/:userId/liked", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ message: "Invalid user ID format" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Filter out any invalid song IDs
    const validSongIds = user.likedSongs.filter(id => mongoose.Types.ObjectId.isValid(id));
    const likedSongs = await Song.find({ _id: { $in: validSongIds } });

    res.status(200).send({ data: likedSongs });
  } catch (error) {
    console.error("Error fetching liked songs:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/songs/{id}:
 *   put:
 *     summary: Update a song by ID
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Song ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               artist:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Updated song successfully
 *       404:
 *         description: Song not found
 */
// Update song
router.put("/:id", [validateObjectId], async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!song) {
      return res.status(404).send({ message: "Song not found" });
    }
    res.send({ data: song, message: "Updated song successfully" });
  } catch (error) {
    console.error("Error updating song:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/songs/{id}:
 *   delete:
 *     summary: Delete a song by ID
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Song ID
 *     responses:
 *       200:
 *         description: Song deleted successfully
 */
// Delete song by ID
router.delete("/:id", [validateObjectId], async (req, res) => {
  await Song.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "Song deleted successfully" });
});

/**
 * @swagger
 * /api/songs/{id}:
 *   get:
 *     summary: Get a song by ID
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Song ID
 *     responses:
 *       200:
 *         description: Song data
 *       404:
 *         description: Song not found
 */
// Get song by ID (MUST BE LAST)
router.get("/:id", [validateObjectId], async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).send({ message: "Song not found" });
    }
    res.status(200).send({ data: song });
  } catch (error) {
    console.error("Error fetching song:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});





/**
 * @swagger
 * /api/songs:
 *   post:
 *     summary: Create song with file upload (audio + image)
 *     tags: [Songs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               song:
 *                 type: string
 *                 format: binary
 *               img:
 *                 type: string
 *                 format: binary
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       201:
 *         description: Song created successfully
 */

/**
 * @swagger
 * /api/songs/artist:
 *   post:
 *     summary: Create song as artist (file upload)
 *     tags: [Songs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               artist:
 *                 type: string
 *               song:
 *                 type: string
 *                 format: binary
 *               img:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Song created successfully
 */

/**
 * @swagger
 * /api/songs:
 *   get:
 *     summary: Get all songs
 *     tags: [Songs]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter songs by status
 *     responses:
 *       200:
 *         description: List of songs
 */
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const songs = await Song.find(filter).lean();
    const songsWithStringIds = songs.map(song => ({
      ...song,
      _id: song._id.toString()
    }));
    res.status(200).send({ data: songsWithStringIds });
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


/**
 * @swagger
 * /api/songs/user/{userId}/liked:
 *   get:
 *     summary: Get all songs liked by a user
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of liked songs
 *       404:
 *         description: User not found
 */
router.get("/user/:userId/liked", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ message: "Invalid user ID format" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    // Filter out any invalid song IDs
    const validSongIds = user.likedSongs.filter(id => mongoose.Types.ObjectId.isValid(id));
    const likedSongs = await Song.find({ _id: { $in: validSongIds } });
    res.status(200).send({ data: likedSongs });
  } catch (error) {
    console.error("Error fetching liked songs:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


router.get("/mine", async (req, res) => {
  console.log('Artist /mine route req.user:', req.user);
  try {
    const songs = await Song.find({ artist: req.user.name }).lean();
    const songsWithStringIds = songs.map(song => ({
      ...song,
      _id: song._id.toString()
    }));
    res.status(200).send({ data: songsWithStringIds });
  } catch (error) {
    console.error("Error fetching artist's songs:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


router.get('/test', (req, res) => {
  res.send('Songs route is working');
});

// --- B2B API: Get all songs for partners (API key protected) ---
const apiKeyAuth = require('../middleware/apiKeyAuth');

router.get('/b2b/all', apiKeyAuth, async (req, res) => {
  try {
    console.log("B2B ALL route hit"); // Debug log to verify route is hit
    const songs = await Song.find({});
    res.json(songs);
  } catch (err) {
    console.error("B2B ALL route error:", err);
    res.status(500).json({ message: 'Failed to fetch songs.' });
  }
});

module.exports = router;
