import React, { useEffect, useState } from "react";
import axios from "axios";
import './AdminPartnersList.css';

const AdminPartnersList = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchPartners = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/partners`);
      setPartners(res.data.data || []);
    } catch (err) {
      setError("Failed to fetch partners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this partner?")) return;
    setDeletingId(id);
    setError("");
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/partners/${id}`);
      setPartners(partners.filter((p) => p._id !== id));
    } catch (err) {
      setError("Failed to delete partner.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-partners-list-container">
      <h2>Issued API Keys</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <table className="admin-partners-table">
          <thead>
            <tr>
              <th>Partner Name</th>
              <th>API Key</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  No partners found.
                </td>
              </tr>
            ) : (
              partners.map((partner) => (
                <tr key={partner._id}>
                  <td>{partner.name}</td>
                  <td><code>{partner.apiKey}</code></td>
                  <td>{partner.enabled ? "Enabled" : "Disabled"}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(partner._id)}
                      disabled={deletingId === partner._id}
                      className="delete-btn"
                    >
                      {deletingId === partner._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPartnersList;
