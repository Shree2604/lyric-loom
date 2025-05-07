import React, { useEffect, useState } from "react";
import axios from "axios";
import './AdminPartnersList.css';
import './AdminApiKeyUsage.css';

const AdminApiKeyUsage = () => {
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch all partners for dropdown
    axios.get("/api/partners")
      .then(res => setPartners(res.data.data || []))
      .catch(err => {
        console.error("Error fetching partners:", err);
        setPartners([]);
        setError("Failed to load partners.");
      });
  }, []);

  const fetchUsage = async (partnerId) => {
    setLoading(true);
    setError("");
    setUsage([]);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/partners/usage/${partnerId}`);
      setUsage(res.data.data || []);
    } catch (err) {
      console.error("Error fetching usage:", err);
      setError("Failed to fetch usage logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (e) => {
    const partnerId = e.target.value;
    setSelectedPartner(partnerId);
    if (partnerId) fetchUsage(partnerId);
    else setUsage([]);
  };

  return (
    <div className="admin-api-key-usage-container">
      <div className="admin-api-key-usage-header">
        <h2>API Key Usage Dashboard</h2>
        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="partner-select">Select Partner: </label>
          <select id="partner-select" value={selectedPartner} onChange={handleSelect}>
            <option value="">-- Select Partner --</option>
            {partners?.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading usage logs...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : usage.length > 0 ? (
        <table className="admin-api-usage-table">
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>API Key</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {usage.map((log, idx) => (
              <tr key={idx}>
                <td>{log.endpoint}</td>
                <td><code>{log.apiKey}</code></td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : selectedPartner ? (
        <div>No usage logs for this partner.</div>
      ) : null}
    </div>
  );
};

export default AdminApiKeyUsage;
