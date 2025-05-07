import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./Collab.css";


const fetchApprovedNews = async () => {
  const all = JSON.parse(localStorage.getItem("allArtistNews")) || [];
  return all.filter(n => n.status === "approved");
};

export default function Collab() {
  const navigate = useNavigate();
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [premiumCode, setPremiumCode] = useState('');
  const [newsList, setNewsList] = useState([]);
  const [selectedDate, setSelectedDate] = useState('All');

  // Check for existing access on component mount
  useEffect(() => {
    const hasAccess = localStorage.getItem('collabAccess') === 'true';
    setIsPremiumUnlocked(hasAccess);
    if (hasAccess) {
      fetchApprovedNews().then(setNewsList);
    }
  }, []);

  // Premium code validation
  const handlePremiumCodeSubmit = (e) => {
    e.preventDefault();
    const storedCode = localStorage.getItem('premiumCode');
    if (premiumCode.trim() === storedCode) {
      localStorage.setItem('collabAccess', 'true');
      setIsPremiumUnlocked(true);
      fetchApprovedNews().then(setNewsList);
    } else {
      alert('Invalid Premium Code');
      setPremiumCode('');
    }
  };

  // If not unlocked, show premium code overlay
  if (!isPremiumUnlocked) {
    return (
      <div className="locked-page">
        <div className="locked-content">
          <h2>🔒 Daily Artists & Songs Updates</h2>
          <p>This page requires a Premium Code to access</p>
          <form onSubmit={handlePremiumCodeSubmit}>
            <input 
              type="text" 
              placeholder="Enter Premium Code"
              value={premiumCode}
              onChange={(e) => setPremiumCode(e.target.value)}
              required 
            />
            <button type="submit">Unlock Page</button>
          </form>
          <div className="hint-text">
            <p>💡 Hint: Get your Premium Code from the Subscription page</p>
          </div>
          <button 
            className="back-button" 
            onClick={() => navigate('/subscribe')}
          >
            Get Premium Access
          </button>
        </div>
      </div>
    );
  }

  // Collect unique dates from newsList for filter
  const uniqueDates = Array.from(new Set(newsList.map(n => n.date))).sort((a, b) => new Date(b) - new Date(a));

  // Filter newsList by selectedDate
  const filteredNews = selectedDate === 'All' ? newsList : newsList.filter(n => n.date === selectedDate);

  // Group filtered news by artist
  const newsByArtist = {};
  filteredNews.forEach(n => {
    if (!newsByArtist[n.artistId]) newsByArtist[n.artistId] = [];
    newsByArtist[n.artistId].push(n);
  });

  return (
    <div className="collab-bg">
      <div className="collab-container">
        <h2 className="collab-heading">Artist News Board</h2>
        {newsList.length > 0 && (
          <div className="news-filter-row">
            <label htmlFor="news-date-filter" className="news-filter-label">Filter by Date:</label>
            <select
              id="news-date-filter"
              className="news-date-filter"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
            >
              <option value="All">All Dates</option>
              {uniqueDates.map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </div>
        )}
        {Object.keys(newsByArtist).length === 0 ? (
          <div className="artist-news-empty">No news available for the selected date.</div>
        ) : (
          Object.entries(newsByArtist).map(([artistId, newsArr]) => (
            <div key={artistId} className="artist-news-block">
              <div className="artist-news-header">
                <span className="artist-news-artist">{newsArr[0].artistUsername || newsArr[0].artistEmail || newsArr[0].artistName || artistId}</span>
              </div>
              <div className="artist-news-list">
                {newsArr.map(news => (
                  <div key={news.newsId} className={`artist-news-card${news.important ? ' important-news' : ''}`}>
                    {news.image && (
                      <img 
                        src={news.image} 
                        alt="news" 
                        className="artist-news-img"
                      />
                    )}
                    <div className="artist-news-title">{news.title}</div>
                    <div className="artist-news-content">{news.content}</div>
                    <div className="artist-news-date">{news.date}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
