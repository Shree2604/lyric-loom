import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";

// Fetch all bios (approved, pending, rejected) from localStorage
const fetchAllBios = async () => {
  return JSON.parse(localStorage.getItem("allArtistBios")) || [];
};


export default function AllArtistBios() {
  const [bios, setBios] = useState([]);
  const [artistNames, setArtistNames] = useState({});

  useEffect(() => {
    fetchAllBios().then(setBios);
    // Fetch all users to map artistId to artist name (use user's name from database)
    const fetchArtistNames = async () => {
      try {
        const authToken = localStorage.getItem('adminAuthToken');
        const { data } = await axios.get(`${config.lyric}/api/users`, {
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
  }, []);

  // Debug logs
  console.log('artistNames mapping:', artistNames);
  console.log('bios:', bios);

  // Check for mapping issues
  const mappingEmpty = Object.keys(artistNames).length === 0;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px #eee", padding: 32 }}>
      <h2>All Artist Bios</h2>
      {mappingEmpty && (
        <div style={{ color: 'red', marginBottom: 16 }}>
          Warning: No artist names loaded from the database. Check your API or authentication token.
        </div>
      )}
      {bios.filter(bio => bio.status === 'approved').length === 0 ? (
        <div>No approved artist bios found.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fcb69f55" }}>
              <th style={{ padding: 10, border: '1px solid #eee' }}>Artist</th>
              <th style={{ padding: 10, border: '1px solid #eee' }}>Bio</th>
              <th style={{ padding: 10, border: '1px solid #eee' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bios.filter(bio => bio.status === 'approved').map(bio => {
              const displayName = artistNames[bio.artistId];
              return (
                <tr key={bio.artistId}>
                  <td style={{ padding: 10, border: '1px solid #eee', color: displayName ? undefined : 'red' }}>
                    {displayName || bio.artistName || bio.artistUsername || bio.artistEmail || `ArtistId not found: ${bio.artistId}`}
                  </td>
                  <td style={{ padding: 10, border: '1px solid #eee' }}>{bio.bio}</td>
                  <td style={{ padding: 10, border: '1px solid #eee', textTransform: 'capitalize' }}>{bio.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
