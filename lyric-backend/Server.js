const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Swagger Docs
require('./swagger')(app);

// Middleware
mongoose.set("strictQuery", true);
app.use(cors({
  origin: [
    'https://lyric-loom-fveq.vercel.app/mainhome',
    'http://localhost:3000', // (optional) allow local dev frontend too
  ],
  credentials: true
}));
app.use(express.json());

const sendTicketRouter = require("./sendTicket");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/songs");
// Remove unused routes
// const playListRoutes = require("./routes/playLists");
const searchRoutes = require("./routes/search");
const sharedFavoritesRoutes = require("./routes/sharedFavorites");
// const bioRoutes = require("./routes/bio");
const partnersRoute = require('./routes/partners');

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use(sendTicketRouter);
app.use("/api/users", userRoutes);
app.use("/api/login", authRoutes);
app.use("/api/songs", songRoutes);
// Remove unused route mounting
// app.use("/api/playlists", playListRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/shared-favorites", sharedFavoritesRoutes);
// app.use("/api/bio", bioRoutes);
app.use('/api/partners', partnersRoute);


// Database connection
const dburl = process.env.DB_URL;
mongoose
  .connect(dburl)
  .then(() => {
    console.log("Connected to DB Successfully");
  })
  .catch((err) => {
    console.error("DB Connection Error:", err.message);
  });



// Test Redis connection on server start
(async () => {
  try {
    const getRedisClient = require("./utilis/redisClient");
    const redisClient = await getRedisClient();
    console.log("Redis connected successfully!");
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
})();

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
