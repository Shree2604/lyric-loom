import { configureStore } from "@reduxjs/toolkit";
import playlistReducer from "./slices/playlistSlice";

const store = configureStore({
  reducer: {
    playlists: playlistReducer,
  },
});

export default store;
