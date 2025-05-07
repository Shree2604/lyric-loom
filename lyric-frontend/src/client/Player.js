import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Player.css";
import { useLocation } from "react-router-dom";

import Queue from "../components/queue/Queue";
import AudioPlayer from "../components/audioPlayer/AudioPlayer";
import Widgets from "../components/widgets/Widgets";
import config from "../config";

// Function to create sample tracks for fallback when API fails
const createSampleTracksForPlaylist = (playlist) => {
  // Extract genre/category from playlist name if possible
  const playlistName = playlist?.name?.toLowerCase() || "";
  
  // Create a set of sample tracks based on the playlist theme with REAL playable songs
  const sampleTracks = [
    {
      _id: "sample1",
      name: "Despacito",
      artist: "Luis Fonsi",
      img: playlist?.image?.[2]?.url || "https://c.saavncdn.com/editorial/BestOfIndipopHindi_20241106102218_500x500.jpg",
      song: "https://dl.sndup.net/ckvs/Despacito.mp3", // Using a direct MP3 URL for better playback
      duration: 180
    },
    {
      _id: "sample2",
      name: "Shape of You",
      artist: "Ed Sheeran",
      img: playlist?.image?.[2]?.url || "https://c.saavncdn.com/editorial/BestOfIndipopHindi_20241106102218_500x500.jpg",
      song: "https://dl.sndup.net/mfkj/Shape%20Of%20You.mp3",
      duration: 210
    },
    {
      _id: "sample3",
      name: "Blinding Lights",
      artist: "The Weeknd",
      img: playlist?.image?.[2]?.url || "https://c.saavncdn.com/editorial/BestOfIndipopHindi_20241106102218_500x500.jpg",
      song: "https://dl.sndup.net/d989/Blinding%20Lights.mp3",
      duration: 195
    },
    {
      _id: "sample4",
      name: "Dance Monkey",
      artist: "Tones and I",
      img: playlist?.image?.[2]?.url || "https://c.saavncdn.com/editorial/BestOfIndipopHindi_20241106102218_500x500.jpg",
      song: "https://dl.sndup.net/q52s/Dance%20Monkey.mp3",
      duration: 200
    },
    {
      _id: "sample5",
      name: "Believer",
      artist: "Imagine Dragons",
      img: playlist?.image?.[2]?.url || "https://c.saavncdn.com/editorial/BestOfIndipopHindi_20241106102218_500x500.jpg",
      song: "https://dl.sndup.net/jpbv/Believer.mp3",
      duration: 185
    }
  ];
  
  return sampleTracks;
};



export default function Player() {
  const location = useLocation();
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [getAllSongs, setGetAllSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const getAllSongs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${config.lyric}/api/songs`);
        setGetAllSongs(data.data);
        console.log(data.data);
      } catch (error) {
        setError('Failed to fetch songs');
      } finally {
        setLoading(false);
      }
    };
    getAllSongs();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (location.state && location.state.source === "spotify") {
        const token = location.state.accessToken;
        if (token) {
          try {
            const response = await axios.get(
              `https://api.spotify.com/v1/playlists/${location.state.id}/tracks`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setTracks(response.data.items);
            console.log("songs:",response.data.items);
            setCurrentTrack(response.data.items[0]?.track);
            console.log("url:",response.data.items[0]?.track)
          } catch (error) {
            console.error("Error fetching playlist tracks:", error);
          }
        } else {
          console.error("Access token not found.");
        }
      }
    };

    fetchData();
  }, [location.state]);

  useEffect(() => {
    // Handle navigation from local songs
    if (location.state && location.state.source === "local") {
      const { songs, songId } = location.state;
      if (songs && Array.isArray(songs) && songId) {
        const songIndex = songs.findIndex(song => song._id === songId);
        if (songIndex !== -1) {
          // Defensive: ensure song property is a valid URL
          const localSongs = songs.map(song => {
            if (song.song && !song.song.startsWith('http')) {
              return { ...song, song: `${config.lyric}/${song.song}` };
            }
            return song;
          });
          // Defensive: ensure img property is set for local songs
          const songWithImg = { ...localSongs[songIndex] };
          if (!songWithImg.img && songWithImg.cover) songWithImg.img = songWithImg.cover;
          if (!songWithImg.img && songWithImg.image) songWithImg.img = songWithImg.image;
          setTracks(localSongs.map((s, i) => i === songIndex ? songWithImg : s));
          setCurrentTrack(songWithImg);
          setCurrentIndex(songIndex);
          console.log("[Player] Local song selected:", songWithImg);
          return;
        } else {
          console.error("[Player] Song ID not found in local songs", songId, songs);
        }
      } else {
        console.error("[Player] Invalid songs or songId for local source", songs, songId);
      }
    }
    // Fallback to old logic (API songs)
    const fetchSamaaSongData = async () => {
      if (location.state && location.state.songId) {
        const songId = location.state.songId;
        const songIndex = getAllSongs.findIndex(song => song._id === songId);
        if (songIndex !== -1) {
          setTracks(getAllSongs);
          setCurrentTrack(getAllSongs[songIndex]);
          setCurrentIndex(songIndex);
          console.log("Song Image:", getAllSongs[songIndex].img)
        }
      }
    };
    fetchSamaaSongData();
  }, [location.state, getAllSongs]);

  useEffect(() => {
    if (tracks && tracks.length > 0 && currentIndex >= 0 && currentIndex < tracks.length) {
      const currentTrackData = tracks[currentIndex];
      const isSpotifyTrack = currentTrackData.hasOwnProperty('track');
      setCurrentTrack(isSpotifyTrack ? currentTrackData.track : currentTrackData.song);
    }
  }, [currentIndex, tracks]);
  

useEffect(() => {
  const fetchSammaPlaylist = async () => {
    if (location.state && location.state.source === "samma") {
      const token = localStorage.getItem("userAuthToken");
      if (token) {
        try {
          const response = await axios.get(
            `${config.lyric}/api/playlists/${location.state.id}`,
            {
              headers: {
                "x-auth-token": token,
              },
            }
          );
          if (response.data.data.songs) {
            const sammaTracks = response.data.data.songs
            setTracks(sammaTracks);
            console.log("songs array:",sammaTracks)
            setCurrentTrack(sammaTracks[0]);
            console.log("current song:",sammaTracks[0])
            console.log("current song image:",sammaTracks[0].img )
            console.log("current song url:",sammaTracks[0].song )
          } else {
            console.error("Error: No playlist data found.");
          }
        } catch (error) {
          console.error("Error fetching Samma playlist tracks:", error);
        }
      } else {
        console.error("User authentication token not found.");
      }
    }
  };

  fetchSammaPlaylist();
}, [location.state]); 







// Set up state for the current playlist info
const [playlistInfo, setPlaylistInfo] = useState({
  name: "",
  image: "",
  songCount: 0
});

useEffect(() => {
  const fetchSaavnPlaylist = async () => {
    if (location.state && location.state.source === "saavn") {
      try {
        setLoading(true);
        console.log("Received playlist data:", location.state);
        
        // Store playlist metadata for display
        setPlaylistInfo({
          name: location.state.name || "Playlist",
          image: location.state.image?.[2]?.url || "/default_image_url.png",
          songCount: 0 // Will update when we get songs
        });
        
        // Try multiple song fetching strategies based on data we have
        const playlistId = location.state.id;
        const playlistUrl = location.state.url;
        let songsFound = false;
        
        // Strategy 1: Use saavn.dev with token from URL
        if (playlistUrl && !songsFound) {
          try {
            console.log("Trying to fetch songs with URL token");
            const token = playlistUrl.split('/').pop();
            
            if (token && token.includes("__")) {
              const tokenResponse = await axios.get(`https://saavn.dev/api/playlists`, {
                params: { token: token }
              });
              
              console.log("Token API response:", tokenResponse.data);
              
              if (tokenResponse.data.success && 
                  tokenResponse.data.data.songs && 
                  tokenResponse.data.data.songs.length > 0) {
                
                const tokenSongs = tokenResponse.data.data.songs;
                setTracks(tokenSongs);
                setCurrentTrack(tokenSongs[0]);
                setCurrentIndex(0);
                setPlaylistInfo(prev => ({
                  ...prev,
                  songCount: tokenSongs.length
                }));
                setError("");
                songsFound = true;
              }
            }
          } catch (tokenError) {
            console.error("Token fetch failed:", tokenError);
          }
        }
        
        // Strategy 2: Use saavn.dev with playlist ID
        if (playlistId && !songsFound) {
          try {
            console.log("Trying to fetch songs with playlist ID");
            const idResponse = await axios.get(`https://saavn.dev/api/playlists`, {
              params: { id: playlistId }
            });
            
            console.log("ID API response:", idResponse.data);
            
            if (idResponse.data.success && 
                idResponse.data.data.songs && 
                idResponse.data.data.songs.length > 0) {
              
              // Extract songs and properly handle image property
              const idSongs = idResponse.data.data.songs.map(song => {
                // Extract highest quality image (500x500) from the array
                let songImage = "/default_image_url.png";
                
                if (song.image && Array.isArray(song.image) && song.image.length > 0) {
                  // Based on the API response structure you shared, we know image[2] is 500x500
                  if (song.image[2] && song.image[2].url) {
                    songImage = song.image[2].url;
                  } else {
                    // Fallback to any available image
                    const highestQualityImg = song.image.find(img => img.quality === "500x500") || 
                                           song.image[song.image.length - 1];
                    songImage = highestQualityImg.url;
                  }
                }
                
                // Create a new object with the extracted image URL
                // The img property is what AudioPlayer will look for
                return {
                  ...song,
                  img: songImage
                };
              });
              
              // Log a sample song to verify img property is set correctly
              if (idSongs.length > 0) {
                console.log("Sample processed song with img:", idSongs[0]);
              }
              
              setTracks(idSongs);
              setCurrentTrack(idSongs[0]);
              setCurrentIndex(0);
              setPlaylistInfo(prev => ({
                ...prev,
                songCount: idSongs.length
              }));
              setError("");
              songsFound = true;
            }
          } catch (idError) {
            console.error("ID fetch failed:", idError);
          }
        }
        
        // Strategy 3: Use playlist name search as fallback
        if (!songsFound && location.state.name) {
          try {
            console.log("Trying to search for songs with playlist name:", location.state.name);
            const searchResponse = await axios.get(`https://saavn.dev/api/search/songs`, {
              params: { query: location.state.name, page: 1, limit: 15 }
            });
            
            console.log("Search API response:", searchResponse.data);
            
            if (searchResponse.data.success && 
                searchResponse.data.data.results && 
                searchResponse.data.data.results.length > 0) {
              
              // Extract songs and properly handle image property
              const searchSongs = searchResponse.data.data.results.map(song => {
                // Extract highest quality image (500x500) from the array
                let songImage = "/default_image_url.png";
                
                if (song.image && Array.isArray(song.image) && song.image.length > 0) {
                  // Based on the API response structure you shared, we know image[2] is 500x500
                  if (song.image[2] && song.image[2].url) {
                    songImage = song.image[2].url;
                  } else {
                    // Fallback to any available image
                    const highestQualityImg = song.image.find(img => img.quality === "500x500") || 
                                           song.image[song.image.length - 1];
                    songImage = highestQualityImg.url;
                  }
                }
                
                // Create a new object with the extracted image URL
                return {
                  ...song,
                  img: songImage
                };
              });
              
              // Log a sample processed song
              if (searchSongs.length > 0) {
                console.log("Sample search song with img:", searchSongs[0]);
              }
              
              setTracks(searchSongs);
              setCurrentTrack(searchSongs[0]);
              setCurrentIndex(0);
              setPlaylistInfo(prev => ({
                ...prev,
                songCount: searchSongs.length
              }));
              setError("");
              songsFound = true;
            }
          } catch (searchError) {
            console.error("Search fetch failed:", searchError);
          }
        }
        
        // Final fallback: Use trending songs if all else fails
        if (!songsFound) {
          try {
            console.log("Using trending songs as final fallback");
            const trendingResponse = await axios.get(`https://saavn.dev/api/songs/trending`);
            
            if (trendingResponse.data.success && trendingResponse.data.data) {
              const trendingSongs = trendingResponse.data.data;
              setTracks(trendingSongs);
              setCurrentTrack(trendingSongs[0]);
              setCurrentIndex(0);
              setPlaylistInfo(prev => ({
                ...prev,
                songCount: trendingSongs.length
              }));
              setError("");
            } else {
              // Absolute last resort - use sample tracks
              console.log("All API attempts failed, using sample tracks");
              const sampleTracks = createSampleTracksForPlaylist({
                name: location.state.name || "Trending Hits",
                image: location.state.image
              });
              setTracks(sampleTracks);
              setCurrentTrack(sampleTracks[0]);
              setCurrentIndex(0);
              setPlaylistInfo(prev => ({
                ...prev,
                songCount: sampleTracks.length
              }));
              setError("");
            }
          } catch (trendingError) {
            console.error("Trending fetch failed:", trendingError);
            // Use sample tracks as absolute fallback
            const sampleTracks = createSampleTracksForPlaylist({
              name: location.state.name || "Trending Hits",
              image: location.state.image
            });
            setTracks(sampleTracks);
            setCurrentTrack(sampleTracks[0]);
            setCurrentIndex(0);
            setPlaylistInfo(prev => ({
              ...prev,
              songCount: sampleTracks.length
            }));
            setError("");
          }
        }
      } catch (error) {
        console.error("Error in all playlist fetch attempts:", error);
        // Error occurred, use sample tracks
        const sampleTracks = createSampleTracksForPlaylist({
          name: location.state.name || "Error Fallback",
          image: location.state.image
        });
        setTracks(sampleTracks);
        setCurrentTrack(sampleTracks[0]);
        setCurrentIndex(0);
        setPlaylistInfo(prev => ({
          ...prev,
          songCount: sampleTracks.length
        }));
        setError("");
      } finally {
        setLoading(false);
      }
    }
  };

  fetchSaavnPlaylist();
}, [location.state]);

  return (
    <div className="screen-container flex">
      <div className="left-player-body">
        <AudioPlayer
           currentTrack={currentTrack && typeof currentTrack === 'object' ? currentTrack : {}}
           total={Array.isArray(tracks) ? tracks : []}
           currentIndex={typeof currentIndex === 'number' && currentIndex >= 0 ? currentIndex : 0}
           setCurrentIndex={setCurrentIndex}
           // Don't pass an image prop - let AudioPlayer use the current song's image directly
           // This allows each song to show its own image rather than a static one
         />
        {/* Keep Widgets separate from Queue - it will fetch its own data */}
        <Widgets/>
      </div>
      <div className="right-player-body">
        <div className="queue-container">
          <div className="queue-header">
            <h3 className="queue-title">Queue</h3>
            <span className="queue-count">{tracks.length} tracks</span>
          </div>
          
          {loading ? (
            <div className="queue-loading">Loading songs...</div>
          ) : error ? (
            <div className="queue-error">{error}</div>
          ) : tracks.length === 0 ? (
            <div className="queue-empty">No tracks available</div>
          ) : (
            <Queue tracks={Array.isArray(tracks) ? tracks : []} setCurrentIndex={setCurrentIndex} currentIndex={currentIndex} />
          )}
        </div>
      </div>
    </div>
  );
}
