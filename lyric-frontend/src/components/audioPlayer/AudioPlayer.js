import React, { useState, useRef, useEffect } from "react";
import Controls from "./controls";
import ProgressCircle from "./progressCircle";
import WaveAnimation from "./waveAnimation";
import "./audioPlayer.css";
import { useLocation } from "react-router-dom";

export default function NewAudioPlayer({ currentIndex, setCurrentIndex, total, image }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [shuffledIndexes, setShuffledIndexes] = useState([]);

  const audioRef = useRef(new Audio());
  const intervalRef = useRef();
  const isReady = useRef(false);

  const location = useLocation();
  const songUrl = location.state?.songUrl || `http://localhost:5000/${location.state?.song}`;

  useEffect(() => {
    const setAudioSource = () => {
      const currentSong = total[currentIndex];
      console.log("[AudioPlayer] currentSong:", currentSong);

      // Try all possible downloadUrl qualities
      let audioUrl = "";
      if (currentSong?.downloadUrl && Array.isArray(currentSong.downloadUrl)) {
        // Find the first valid URL in the array (highest quality last)
        for (let i = currentSong.downloadUrl.length - 1; i >= 0; i--) {
          if (currentSong.downloadUrl[i]?.url) {
            audioUrl = currentSong.downloadUrl[i].url;
            break;
          }
        }
      }
      if (!audioUrl && currentSong?.lyricApiUrl) {
        audioUrl = currentSong.lyricApiUrl;
      }
      if (!audioUrl && currentSong?.song) {
        audioUrl = currentSong.song;
      }
      if (!audioUrl) {
        audioUrl = songUrl;
      }

      audioRef.current.src = audioUrl;

      if (!audioUrl) {
        console.error("No valid audio source found for the current track.", currentSong);
      }
    };


    setAudioSource();

    const onCanPlayThrough = () => {
      isReady.current = true;
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error(
            "Error: play() request was interrupted by pause()",
            error
          );
        });
        startTimer();
      }
    };

    const onError = (error) => {
      console.error(
        "Error: Failed to load because no supported source was found.",
        error
      );
    };

    audioRef.current.addEventListener("canplaythrough", onCanPlayThrough);
    audioRef.current.addEventListener("error", onError);

    return () => {
      clearInterval(intervalRef.current);
      audioRef.current.pause();
      audioRef.current.removeEventListener("canplaythrough", onCanPlayThrough);
      audioRef.current.removeEventListener("error", onError);
    };
  }, [currentIndex, total, isPlaying]);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        handleNext();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, 1000);
  };

  const handleNext = () => {
    if (isShuffle) {
      const nextIndex =
        shuffledIndexes[(shuffledIndexes.indexOf(currentIndex) + 1) % total.length];
      setCurrentIndex(nextIndex);
    } else {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % total.length);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? total.length - 1 : prevIndex - 1
    );
  };

  const togglePlay = () => {
    if (audioRef.current.paused && isReady.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error: play() failed:", error);
      });
    } else {
      audioRef.current.pause();
    }
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      startTimer();
    } else {
      clearInterval(intervalRef.current);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isReady.current) {
      togglePlay();
    } else {
      isReady.current = true;
    }
  }, [currentIndex]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const formatDuration = (duration) => {
    if (isNaN(duration) || duration === 0) return "0:00";

    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const { duration } = audioRef.current;
  const currentPercentage = duration ? (trackProgress / duration) * 100 : 0;

  let circleImage = image;
  if (!circleImage) {
    if (total[currentIndex]?.img) {
      circleImage = total[currentIndex]?.img;
    } else if (total[currentIndex]?.image && total[currentIndex]?.image.length > 2) {
      circleImage = total[currentIndex]?.image[2]?.url;
    } else {
      circleImage = "/frontendapp/samaa/public/default_image_url.png";
    }
  }

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    if (!isShuffle) {
      // Create shuffled indexes when shuffle is activated
      const indexes = total.map((_, index) => index);
      for (let i = indexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
      }
      setShuffledIndexes(indexes);
      console.log("Shuffled indexes: ", indexes);
    }
  };

  useEffect(() => {
    const handleAudioEnd = () => {
      if (isRepeat) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((error) => {
          console.error("Error: play() failed:", error);
        });
      }
    };

    audioRef.current.addEventListener("ended", handleAudioEnd);

    return () => {
      audioRef.current.removeEventListener("ended", handleAudioEnd);
    };
  }, [isRepeat]);

  return (
    <div className="player-body flex">
      <div className="player-left-body">
        <ProgressCircle
          percentage={currentPercentage}
          isPlaying={isPlaying}
          image={circleImage}
          size={300}
          color="#83e5f2"
        />
      </div>
      <div className="player-right-body flex">
        <p className="song-title">{total[currentIndex]?.name}</p>
        <WaveAnimation isPlaying={isPlaying} />
        <div className="player-right-bottom flex">
          <div className="song-duration flex">
            <p className="duration">{formatTime(Math.round(trackProgress))}</p>
            <input
              type="range"
              min="0"
              max={duration}
              value={trackProgress}
              onChange={(e) => {
                setTrackProgress(parseFloat(e.target.value));
                audioRef.current.currentTime = parseFloat(e.target.value);
              }}
              className="seek-bar"
            />
            <p className="duration">{formatDuration(duration)}</p>
          </div>
          <Controls
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        </div>
      </div>
    </div>
  );
}
