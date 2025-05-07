import React, { useEffect, useState } from "react";

function getApprovedConnections(userId) {
  const requests = JSON.parse(localStorage.getItem("connectRequests")) || [];
  return requests.filter(r => (r.userId === userId || r.artistId === userId) && r.status === "artist_approved" && r.userConfirmed);
}

function getMessages(userId, artistId) {
  const key = `chat_${userId}_${artistId}`;
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveMessage(userId, artistId, msg) {
  const key = `chat_${userId}_${artistId}`;
  const messages = JSON.parse(localStorage.getItem(key)) || [];
  messages.push(msg);
  localStorage.setItem(key, JSON.stringify(messages));
}

export default function ChatWithArtist({ chatArtist }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [connections, setConnections] = React.useState([]);
  const [selectedArtist, setSelectedArtist] = React.useState(chatArtist || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const update = () => {
      setConnections(getApprovedConnections(user?.userId || user?.email || user?.username));
    };
    update();
    window.addEventListener("storage", update);
    const interval = setInterval(update, 2000);
    return () => {
      window.removeEventListener("storage", update);
      clearInterval(interval);
    };
  }, [user]);

  useEffect(() => {
    if (selectedArtist && user) {
      setMessages(getMessages(user.userId || user.email || user.username, selectedArtist.artistId || selectedArtist.userId));
    }
  }, [selectedArtist, user]);

  const handleSend = () => {
    if (!input.trim() || !selectedArtist) return;
    const userId = user.userId || user.email || user.username;
    const targetId = selectedArtist.artistId || selectedArtist.userId;
    const msg = {
      from: userId,
      to: targetId,
      text: input,
      sentAt: new Date().toISOString()
    };
    saveMessage(userId, targetId, msg);
    setMessages(msgs => [...msgs, msg]);
    setInput("");
  };

  return (
    <div style={{ display: 'flex', height: 420, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #eee', overflow: 'hidden' }}>
      <div style={{ width: 220, borderRight: '1px solid #eee', background: '#fafafa', padding: 0 }}>
        <h4 style={{ margin: 0, padding: 16, background: '#232526', color: '#fff', borderRadius: '12px 0 0 0' }}>Chats</h4>
        {connections.length === 0 ? <div style={{ padding: 16 }}>No approved connections yet.</div> : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {connections.map(a => (
              <li key={a.artistId || a.userId}>
                <button
                  style={{
                    width: '100%', background: selectedArtist && (selectedArtist.artistId === a.artistId || selectedArtist.userId === a.userId) ? '#b8005a' : 'transparent', color: selectedArtist && (selectedArtist.artistId === a.artistId || selectedArtist.userId === a.userId) ? '#fff' : '#232526', border: 'none', padding: '12px 8px', textAlign: 'left', cursor: 'pointer', fontWeight: 600
                  }}
                  onClick={() => setSelectedArtist(a)}
                >
                  {a.artistName || a.userName || a.artistUsername || a.artistEmail || a.artistId || a.userId}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: 18, overflowY: 'auto', background: '#fff' }}>
          {selectedArtist ? (
            <>
              <div style={{ fontWeight: 700, marginBottom: 10, color: '#b8005a' }}>Chat with {selectedArtist.artistName || selectedArtist.userName || selectedArtist.artistUsername || selectedArtist.artistEmail || selectedArtist.artistId || selectedArtist.userId}</div>
              <div>
                {messages.length === 0 ? <div style={{ color: '#aaa' }}>No messages yet.</div> : (
                  messages.map((m, idx) => (
                    <div key={idx} style={{ margin: '8px 0', textAlign: m.from === (user.userId || user.email || user.username) ? 'right' : 'left' }}>
                      <span style={{ background: m.from === (user.userId || user.email || user.username) ? '#b8005a' : '#eee', color: m.from === (user.userId || user.email || user.username) ? '#fff' : '#232526', padding: '6px 12px', borderRadius: 14, display: 'inline-block', maxWidth: '70%' }}>
                        {m.text}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : <div style={{ color: '#aaa' }}>Select an artist to start chatting.</div>}
        </div>
        {selectedArtist && (
          <div style={{ padding: 12, borderTop: '1px solid #eee', background: '#fafafa', display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              style={{ flex: 1, borderRadius: 8, border: '1px solid #ddd', padding: 8 }}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            />
            <button onClick={handleSend} style={{ background: '#b8005a', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}
