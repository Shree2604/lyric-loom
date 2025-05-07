import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import './ArtistNews.css';

// Helper to get artist identity (mock, replace with real auth in production)
export const getArtistInfo = () => {
  const artistId = localStorage.getItem("artistId") || "artist123";
  const artistName = localStorage.getItem("artistName") || null;
  const artistUsername = localStorage.getItem("artistUsername") || null;
  const artistEmail = localStorage.getItem("artistEmail") || null;
  const displayName = artistName || artistUsername || artistEmail || artistId;
  return {
    artistId,
    artistName: displayName,
    artistUsername,
    artistEmail
  };
};

const fetchNews = async () => {
  const { artistId, artistEmail } = getArtistInfo();
  const all = JSON.parse(localStorage.getItem("allArtistNews")) || [];
  return all.filter(n => n.artistId === artistId && n.artistEmail === artistEmail);
};

const submitNews = async (title, content) => {
  const { artistId, artistName, artistUsername, artistEmail } = getArtistInfo();
  let all = JSON.parse(localStorage.getItem("allArtistNews")) || [];
  const newsId = uuidv4();
  const date = new Date().toLocaleDateString();
  const newNews = { newsId, artistId, artistName, artistUsername, artistEmail, title, content, status: "pending", date };
  all.push(newNews);
  localStorage.setItem("allArtistNews", JSON.stringify(all));
  return newNews;
};

export default function ArtistNews() {
  const [newsList, setNewsList] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchNews().then(setNewsList);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    await submitNews(title, content);
    setTitle("");
    setContent("");
    setSubmitted(true);
    fetchNews().then(setNewsList);
  };

  return (
    <div className="artist-news-form-bg">
      <div className="artist-news-form-container">
        <h2 className="artist-news-title">Submit Artist News</h2>
        <form onSubmit={handleSubmit} className="artist-news-form">
          <input
            type="text"
            placeholder="News Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="artist-news-input"
          />
          <textarea
            placeholder="Write your news here..."
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            className="artist-news-textarea"
          />
          <button type="submit" className="artist-news-submit-btn">Submit News</button>
        </form>
        {submitted && <div className="news-submit-msg">News submitted for admin approval!</div>}
        <h3 className="artist-news-submitted-title">Your Submitted News</h3>
        <ul className="artist-news-list">
          {newsList.map(n => (
            <li key={n.newsId} className="artist-news-item">
              <b>{n.title}</b> - <span>{n.status}</span><br/>
              <span className="artist-news-content">{n.content}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
