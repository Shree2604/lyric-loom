import React, { useState } from "react";

export default function ConnectNoteModal({ open, onClose, onSend, artistName }) {
  const [note, setNote] = useState("");
  if (!open) return null;
  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.32)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 2px 16px #ccc', maxWidth: 380 }}>
        <h3 style={{ marginBottom: 18 }}>Send Connect Request to {artistName}</h3>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Add a note (optional)"
          style={{ width: '100%', minHeight: 60, marginBottom: 16, borderRadius: 8, border: '1px solid #eee', padding: 8 }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button onClick={() => { onSend(note); setNote(""); }} style={{ background: '#b8005a', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}>Send</button>
          <button onClick={onClose} style={{ background: '#eee', color: '#232526', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
