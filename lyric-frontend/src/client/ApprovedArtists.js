import React, { useEffect, useState } from "react";

// Mock API to fetch approved bios
const fetchApprovedBios = async () => {
  const all = JSON.parse(localStorage.getItem("allArtistBios")) || [];
  return all.filter(b => b.status === "approved");
};

export default function ApprovedArtists({ onConnect }) {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetchApprovedBios().then(setArtists);
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h2 style={{ color: '#b8005a', marginBottom: 24 }}>Connect with Artists</h2>
      {artists.length === 0 ? (
        <div>No approved artists available yet.</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {artists.map(a => (
            <div key={a.artistId} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #eee', padding: 24, width: 260 }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: '#b8005a', marginBottom: 8 }}>{a.artistName || a.artistUsername || a.artistEmail || a.artistId}</div>
              <div style={{ color: '#3a1c71', fontSize: 16, marginBottom: 12 }}>{a.bio}</div>
              <button onClick={() => onConnect(a)} style={{ background: '#b8005a', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
                Connect
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
