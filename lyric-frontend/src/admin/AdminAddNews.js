import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import './AdminAddNews.css';

const ADMIN_ID = "ADMIN";
const ADMIN_NAME = "Admin";

const submitAdminNews = (title, content, imageDataUrl) => {
  let all = JSON.parse(localStorage.getItem("allArtistNews")) || [];
  const newsId = uuidv4();
  const date = new Date().toLocaleDateString();
  const newNews = {
    newsId,
    artistId: ADMIN_ID,
    artistName: ADMIN_NAME,
    artistUsername: null,
    artistEmail: null,
    title,
    content,
    image: imageDataUrl || null,
    status: "approved",
    date
  };
  all.push(newNews);
  localStorage.setItem("allArtistNews", JSON.stringify(all));
  return newNews;
};

export default function AdminAddNews({ onNewsAdded }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    submitAdminNews(title, content, image);
    setTitle("");
    setContent("");
    setImage(null);
    setPreview(null);
    setSubmitted(true);
    if (onNewsAdded) onNewsAdded();
  };

  return (
    <div className="admin-add-news-bg">
      <div className="admin-add-news-container">
        <h3 className="admin-add-news-title">Add Admin News</h3>
        <form onSubmit={handleSubmit} className="admin-add-news-form">
          <input
            type="text"
            placeholder="News Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="admin-add-news-input"
          />
          <textarea
            placeholder="Write your news here..."
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            className="admin-add-news-textarea"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="admin-add-news-file"
          />
          {preview && (
            <img src={preview} alt="Preview" className="admin-add-news-img-preview" />
          )}
          <button type="submit" className="admin-add-news-submit-btn">Add News</button>
        </form>
        {submitted && <div className="admin-add-news-msg">News added!</div>}
      </div>
    </div>
  );
}
