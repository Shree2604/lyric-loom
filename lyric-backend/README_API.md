# Lyric Project API Documentation

Welcome to the Lyric Project API! This API is designed for both B2B (external partners) and B2C (your frontend app) use cases. It exposes RESTful endpoints for user, song, and artist bio management, and is fully documented using the OpenAPI/Swagger standard.

---

## 🚀 Project Overview
- **Purpose:** Provide a robust, secure, and well-documented API for managing users, songs, and artist bios for the Lyric platform.
- **Audience:** B2C (your React frontend) and B2B (external partners, integrations).

---

## 🏁 Getting Started
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the backend server:**
   ```sh
   node Server.js
   ```
3. **Access API documentation:**
   - Open [https://popular-mite-shree2604-bfb782a1.koyeb.app/api-docs](https://popular-mite-shree2604-bfb782a1.koyeb.app/api-docs) in your browser for Swagger UI (interactive docs).

---

## 🔒 Authentication
- Most endpoints require an `x-auth-token` header (JWT) for authentication.
- Obtain a token by logging in via `/api/login`.
- Example:
  ```sh
  curl -H "x-auth-token: <TOKEN>" https://popular-mite-shree2604-bfb782a1.koyeb.app/api/users
  ```

---

## 📚 REST Endpoints Overview

### Users
| Method | Path           | Description                |
|--------|----------------|----------------------------|
| GET    | /api/users     | Get all users              |
| POST   | /api/users     | Register a new user        |
| GET    | /api/users/:id | Get user by ID             |

### Songs
| Method | Path           | Description                |
|--------|----------------|----------------------------|
| GET    | /api/songs     | Get all songs              |
| POST   | /api/songs     | Add a new song             |
| GET    | /api/songs/:id | Get song by ID             |

### Artist Bios
| Method | Path        | Description                 |
|--------|-------------|-----------------------------|
| GET    | /api/bio    | Get all artist bios         |
| POST   | /api/bio    | Submit a new artist bio     |

### Auth
| Method | Path         | Description                 |
|--------|--------------|-----------------------------|
| POST   | /api/login   | Login and get JWT token     |

---

## 📝 Example Requests & Responses

### Register User
```sh
curl -X POST -H "Content-Type: application/json" -d '{"name":"Test","email":"test@email.com","password":"pass"}' https://popular-mite-shree2604-bfb782a1.koyeb.app/api/users
```

### Get All Users (Authenticated)
```sh
curl -H "x-auth-token: <TOKEN>" https://popular-mite-shree2604-bfb782a1.koyeb.app/api/users
```

### Submit Artist Bio
```sh
curl -X POST -H "Content-Type: application/json" -d '{"artistId":"abc123","bio":"My new bio"}' https://popular-mite-shree2604-bfb782a1.koyeb.app/api/bio
```

---

## 🏢 B2B Usage (External Partners)
- See [B2B_API_SAMPLE.md](./B2B_API_SAMPLE.md) for detailed cURL and Postman examples.
- All endpoints are documented in Swagger UI for easy onboarding.
- Share your API key/token securely with partners.

## 🏠 B2C Usage (Frontend)
- Use Axios or fetch to call endpoints from your React app:
```js
axios.get('/api/users', { headers: { 'x-auth-token': token } })
```

---

## 📖 API Documentation (Swagger/OpenAPI)
- **Interactive docs:** [https://popular-mite-shree2604-bfb782a1.koyeb.app/api-docs](https://popular-mite-shree2604-bfb782a1.koyeb.app/api-docs)
- **Standards:** OpenAPI 3.0, RESTful conventions, clear request/response schemas.
- **How to add docs:**
  - Add JSDoc-style Swagger comments to your route files (see `routes/bio.js`, `routes/users.js`, `routes/songs.js`).
  - Restart the backend to update docs.

---

## ⚠️ Error Handling Example
All errors are returned as JSON with a message and status code:
```json
{
  "error": "User not found"
}
```

---

## 🔮 GraphQL Support (Optional)
Want to add GraphQL? Use Apollo Server and document your schema with descriptions. See [Apollo Docs](https://www.apollographql.com/docs/) for best practices.

---

## 📬 Contact
For API access, partnership, or support, contact: your@email.com

---

## 📎 Related Files
- [B2B_API_SAMPLE.md](./B2B_API_SAMPLE.md) — Partner usage examples

---

## ✅ Best Practices
- Always use HTTPS in production
- Secure your tokens
- Use the Swagger UI to test endpoints before integration
- Keep your API docs up to date!
