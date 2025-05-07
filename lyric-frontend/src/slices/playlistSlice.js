import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk for fetching playlists by category
export const fetchPlaylistsByCategory = createAsyncThunk(
  "playlists/fetchByCategory",
  async (category = "top playlists", { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://saavn.dev/api/search/playlists",
        {
          params: { query: category },
        }
      );
      if (response.data.success) {
        return response.data.data.results.map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
          images: playlist.image ? [{ url: playlist.image[2].url }] : [],
          tracks: { 
            total: playlist.songCount,
            songs: playlist.songs ? playlist.songs.map(song => ({
              id: song.id,
              title: song.title,
              url: song.playUrl,  // Ensure this is the correct property for song URL
            })) : []
          },
        }));
      } else {
        return rejectWithValue(`Failed to fetch ${category} playlists.`);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Thunk for fetching trending playlists
export const fetchTrendingPlaylists = createAsyncThunk(
  "playlists/fetchTrending",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://saavn.dev/api/search/playlists",
        {
          params: { query: "trending playlists" },
        }
      );
      if (response.data.success) {
        return response.data.data.results.map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
          images: playlist.image ? [{ url: playlist.image[2].url }] : [],
          tracks: { 
            total: playlist.songCount,
            songs: playlist.songs ? playlist.songs.map(song => ({
              id: song.id,
              title: song.title,
              url: song.playUrl,  // Ensure this is the correct property for song URL
            })) : []
          },
        }));
      } else {
        return rejectWithValue("Failed to fetch trending playlists.");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Playlist slice
const playlistSlice = createSlice({
  name: "playlists",
  initialState: {
    loading: false,
    error: "",
    playlists: [],
    trendingPlaylists: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch by Category
      .addCase(fetchPlaylistsByCategory.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchPlaylistsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = action.payload;
      })
      .addCase(fetchPlaylistsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Trending
      .addCase(fetchTrendingPlaylists.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchTrendingPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.trendingPlaylists = action.payload;
      })
      .addCase(fetchTrendingPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default playlistSlice.reducer;
