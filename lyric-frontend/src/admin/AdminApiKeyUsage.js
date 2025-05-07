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
    const fetchPartners = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/partners`);
        setPartners(res.data.data || []);
      } catch (err) {
        console.error("Error fetching partners:", err);
        setError("Failed to load partners.");
      }
    };

    fetchPartners();
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
    if (partnerId) {
      fetchUsage(partnerId);
    } else {
      setUsage([]);
    }
  };

  return (
    <div className="admin-api-key-usage-container">
      <div className="admin-api-key-usage-header">
        <h2>API Key Usage Dashboard</h2>
        <div className="partner-select-container">
          <label htmlFor="partner-select">Select Partner: </label>
          <select id="partner-select" value={selectedPartner} onChange={handleSelect}>
            <option value="">-- Select Partner --</option>
            {partners.length > 0 ? (
              partners.map((partner) => (
                <option key={partner._id} value={partner._id}>
                  {partner.name}
                </option>
              ))
            ) : (
              <option disabled>No partners available</option>
            )}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-message">Loading usage logs...</div>
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
        <div className="no-logs-message">No usage logs for this partner.</div>
      ) : null}
    </div>
  );
};

export default AdminApiKeyUsage;
