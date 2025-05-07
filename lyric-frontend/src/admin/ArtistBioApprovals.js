import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";

// Mock API for pending bios
const fetchPendingBios = async () => {
  // Simulate: fetch all bios with status 'pending' from localStorage
  const all = JSON.parse(localStorage.getItem("allArtistBios")) || [];
  // Filter by unique artistId+artistEmail to prevent duplicates
  const unique = {};
  all.forEach(bio => {
    if (bio.status === "pending") {
      const key = `${bio.artistId}_${bio.artistEmail}`;
      unique[key] = bio;
    }
  });
  return Object.values(unique);
};
const approveBio = async (artistId, artistEmail) => {
  let all = JSON.parse(localStorage.getItem("allArtistBios")) || [];
  all = all.map(bio => (bio.artistId === artistId && bio.artistEmail === artistEmail) ? { ...bio, status: "approved" } : bio);
  localStorage.setItem("allArtistBios", JSON.stringify(all));
};
const rejectBio = async (artistId, artistEmail) => {
  let all = JSON.parse(localStorage.getItem("allArtistBios")) || [];
  all = all.map(bio => (bio.artistId === artistId && bio.artistEmail === artistEmail) ? { ...bio, status: "rejected" } : bio);
  localStorage.setItem("allArtistBios", JSON.stringify(all));
};
const bulkApprove = async (artistKeys) => {
  let all = JSON.parse(localStorage.getItem("allArtistBios")) || [];
  all = all.map(bio => artistKeys.includes(`${bio.artistId}_${bio.artistEmail}`) ? { ...bio, status: "approved" } : bio);
  localStorage.setItem("allArtistBios", JSON.stringify(all));
};
const bulkReject = async (artistKeys) => {
  let all = JSON.parse(localStorage.getItem("allArtistBios")) || [];
  all = all.map(bio => artistKeys.includes(`${bio.artistId}_${bio.artistEmail}`) ? { ...bio, status: "rejected" } : bio);
  localStorage.setItem("allArtistBios", JSON.stringify(all));
};

export default function ArtistBioApprovals() {
  const [pending, setPending] = useState([]);
  const [refresh, setRefresh] = useState(false);
  // selected will store keys of the form artistId_artistEmail
  const [selected, setSelected] = useState([]);
  const [artistNames, setArtistNames] = useState({});

  useEffect(() => {
    fetchPendingBios().then(setPending);
    // Fetch all users to map artistId to artist name (use user's name from database)
    const fetchArtistNames = async () => {
      try {
        const authToken = localStorage.getItem('adminAuthToken');
        const { data } = await axios.get(`process.env.REACT_APP_API_BASE_URL/api/users`, {
          headers: { 'x-auth-token': authToken }
        });
        const map = {};
        data.data.forEach(user => {
          if (user.isArtist && user._id && user.name) {
            map[user._id] = user.name;
          }
        });
        setArtistNames(map);
      } catch (e) {
        setArtistNames({});
      }
    };
    fetchArtistNames();
  }, [refresh]);

  const handleApprove = async (artistId, artistEmail) => {
    await approveBio(artistId, artistEmail);
    setRefresh(r => !r);
  };
  const handleReject = async (artistId, artistEmail) => {
    await rejectBio(artistId, artistEmail);
    setRefresh(r => !r);
  };
  const handleSelect = (artistId, artistEmail) => {
    const key = `${artistId}_${artistEmail}`;
    setSelected(sel => sel.includes(key) ? sel.filter(id => id !== key) : [...sel, key]);
  };
  const handleBulkApprove = async () => {
    await bulkApprove(selected);
    setSelected([]);
    setRefresh(r => !r);
  };
  const handleBulkReject = async () => {
    await bulkReject(selected);
    setSelected([]);
    setRefresh(r => !r);
  };


  const mappingEmpty = Object.keys(artistNames).length === 0;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px #eee", padding: 32 }}>
      <h2>Pending Artist Bios</h2>
      {mappingEmpty && (
        <div style={{ color: 'red', marginBottom: 16 }}>
          Warning: No artist names loaded from the database. Check your API or authentication token.
        </div>
      )}
      {pending.length === 0 ? <div>No bios pending approval.</div> : (
        <>
          <div style={{ marginBottom: 16 }}>
            <button onClick={handleBulkApprove} disabled={selected.length === 0} style={{ marginRight: 12, background: '#4caf50', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: selected.length === 0 ? 'not-allowed' : 'pointer' }}>Bulk Approve</button>
            <button onClick={handleBulkReject} disabled={selected.length === 0} style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: selected.length === 0 ? 'not-allowed' : 'pointer' }}>Bulk Reject</button>
          </div>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {pending.map(bio => {
              const key = `${bio.artistId}_${bio.artistEmail}`;
              const displayName = artistNames[bio.artistId];
              return (
                <li key={key} style={{ marginBottom: 24, borderBottom: "1px solid #eee", paddingBottom: 12, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <input type="checkbox" checked={selected.includes(key)} onChange={() => handleSelect(bio.artistId, bio.artistEmail)} style={{ marginTop: 6 }} />
                  <div style={{ flex: 1 }}>
                    <strong>Artist:</strong> {displayName || bio.artistName || bio.artistUsername || bio.artistEmail || bio.artistId}<br/>
                    <strong>Bio:</strong> {bio.bio}
                    <div style={{ marginTop: 8 }}>
                      <button onClick={() => handleApprove(bio.artistId, bio.artistEmail)} style={{ background: "#4caf50", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", marginRight: 12, cursor: "pointer" }}>Approve</button>
                      <button onClick={() => handleReject(bio.artistId, bio.artistEmail)} style={{ background: "#e53935", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", cursor: "pointer" }}>Reject</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
