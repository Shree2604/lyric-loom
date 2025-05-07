import React, { useState, useEffect } from "react";

// Helper to get all news
const fetchAllNews = async () => {
  return JSON.parse(localStorage.getItem("allArtistNews")) || [];
};

const updateNewsStatus = async (newsId, status) => {
  let all = JSON.parse(localStorage.getItem("allArtistNews")) || [];
  const idx = all.findIndex(n => n.newsId === newsId);
  if (idx !== -1) {
    all[idx].status = status;
    localStorage.setItem("allArtistNews", JSON.stringify(all));
  }
  return all;
};

export default function ArtistNewsApproval() {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    fetchAllNews().then(setNewsList);
  }, []);

  const handleApprove = async (newsId) => {
    await updateNewsStatus(newsId, "approved");
    fetchAllNews().then(setNewsList);
  };

  const handleReject = async (newsId) => {
    await updateNewsStatus(newsId, "rejected");
    fetchAllNews().then(setNewsList);
  };

  return (
    <div className="artist-news-approval-bg">
      <div className="artist-news-approval-container">
        <h2>Artist News Approval (Admin)</h2>
        {newsList.length === 0 ? (
          <div>No news submitted yet.</div>
        ) : (
          <ul>
            {newsList.map(n => (
              <li key={n.newsId} style={{marginBottom:16, background:'#f9f9f9', padding:14, borderRadius:8}}>
                <b>{n.title}</b> <span style={{color:'#999', fontSize:13}}>({n.status})</span><br/>
                <span style={{fontSize:13}}>{n.content}</span><br/>
                <span style={{fontSize:12, color:'#666'}}>By: {n.artistName || n.artistUsername || n.artistEmail || n.artistId} | {n.date}</span><br/>
                {n.status === 'pending' && (
                  <>
                    <button onClick={() => handleApprove(n.newsId)} style={{marginRight:8, background:'#4caf50', color:'#fff', border:'none', borderRadius:4, padding:'4px 10px', cursor:'pointer'}}>Approve</button>
                    <button onClick={() => handleReject(n.newsId)} style={{background:'#e53935', color:'#fff', border:'none', borderRadius:4, padding:'4px 10px', cursor:'pointer'}}>Reject</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
