# B2B API Partner Guide

Welcome, business partners! This guide explains how to securely and efficiently consume the Lyric Project REST API for B2B integrations.

---

## 🔒 Authentication with API Key
- Every B2B request must include your API key in the `x-api-key` header.
- Example:
  ```sh
  curl -H "x-api-key: <YOUR_API_KEY>" https://popular-mite-shree2604-bfb782a1.koyeb.app/api-docs/songs/b2b/all
  ```
- If your key is missing or invalid, you'll get a 401 Unauthorized error.

---

## 📘 Example: Fetch All Songs
```sh
curl -H "x-api-key: <YOUR_API_KEY>" https://popular-mite-shree2604-bfb782a1.koyeb.app/api-docs/songs/b2b/all
```
**Response:**
```json
[
  {"_id": "abc123", "title": "Song1", ...},
  ...
]
```

---

## 📊 Usage Tracking
- Each API request is logged for security and usage statistics.
- Contact support if you need access to your usage logs or want usage limits.

---

## ❓ Need Help?
- Contact our support team for more sample requests or integration guidance.
