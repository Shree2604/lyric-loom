/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Song search
 */
/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search songs by name
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: true
 *         description: Search term (song name)
 *     responses:
 *       200:
 *         description: List of matching songs
 *       401:
 *         description: Unauthorized
 */
const router = require("express").Router();
const { Song } = require("../models/song");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
	const search = req.query.search;
	if (search !== "") {
		const songs = await Song.find({
			name: { $regex: search, $options: "i" },
		}).limit(10);
		const result = { songs };
		res.status(200).send(result);
	} else {
		res.status(200).send({});
	}
});

module.exports = router;
