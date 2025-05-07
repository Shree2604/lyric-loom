import React, { useEffect, useState } from "react";

// Helper to get all news
const fetchAllNews = async () => {
  return JSON.parse(localStorage.getItem("allArtistNews")) || [];
};

export default function AllArtistNews() {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    fetchAllNews().then(setNewsList);
  }, []);

  return (
    <div className="all-artist-news-bg">
      <div className="all-artist-news-container">
        <h2>All Artist News (Admin/Debug)</h2>
        {newsList.length === 0 ? (
          <div>No news submitted yet.</div>
        ) : (
          <ul>
            {newsList.map(n => (
              <li key={n.newsId} style={{marginBottom:16, background:'#f3e5f5', padding:14, borderRadius:8}}>
                <b>{n.title}</b> <span style={{color:'#999', fontSize:13}}>({n.status})</span><br/>
                {n.image && (
                  <img src={n.image} alt="news" style={{maxWidth:'100%', maxHeight:120, borderRadius:6, margin:'8px 0', boxShadow:'0 1px 6px #b8005a22'}} />
                )}
                <span style={{fontSize:13}}>{n.content}</span><br/>
                <span style={{fontSize:12, color:'#666'}}>By: {n.artistName || n.artistUsername || n.artistEmail || n.artistId} | {n.date}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
