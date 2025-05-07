import React, { useState } from "react";
import axios from "axios";
import './AdminAddPartner.css';

const AdminAddPartner = () => {
  const [partnerName, setPartnerName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setApiKey("");
    try {
      const res = await axios.post("/api/partners", { name: partnerName });
      setApiKey(res.data.apiKey);
      setSuccess("Partner added successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add partner. Try a different name."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-add-partner-container">
      <h2>Add B2B Partner</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="partnerName">Partner Name:</label>
        <input
          id="partnerName"
          type="text"
          value={partnerName}
          onChange={(e) => setPartnerName(e.target.value)}
          required
        />
        <button type="submit" disabled={loading || !partnerName}>
          {loading ? "Adding..." : "Add Partner"}
        </button>
      </form>
      {success && (
        <div className="success-message">
          {success}
          {apiKey && (
            <div>
              <strong>API Key:</strong> <code>{apiKey}</code>
            </div>
          )}
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default AdminAddPartner;
