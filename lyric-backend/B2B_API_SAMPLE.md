# B2B API Usage Guide

Welcome, business partners! This guide explains how to securely and efficiently consume the Lyric Project REST API for B2B integrations.

---

## 🤝 What is B2B API Access?
B2B API access allows your business systems to interact directly with our platform — automate user management, song ingestion, artist bio submission, and more.

---

## 🔒 Authentication
- Most endpoints require an `x-auth-token` (JWT) for secure access.
- Obtain a token by logging in via `/api/login`.
- Example:
  ```sh
  curl -X POST -H "Content-Type: application/json" -d '{"email":"admin@email.com","password":"yourpass"}' https://popular-mite-shree2604-bfb782a1.koyeb.app/api/login
  # Response: { "authToken": "..." }
  ```
- Use this token in the `x-auth-token` header for all subsequent requests.

---

## 📘 Main Endpoints & Examples

### 1. Get All Users
```sh
curl -H "x-auth-token: <TOKEN>" https://popular-mite-shree2604-bfb782a1.koyeb.app/api/users
```
**Response:**
```json
[
  {"_id": "abc123", "name": "Artist1", "email": "a@b.com"},
  ...
]
```

### 2. Register a New User
```sh
curl -X POST -H "Content-Type: application/json" -d '{"name":"BizUser","email":"biz@email.com","password":"pass"}' https://popular-mite-shree2604-bfb782a1.koyeb.app/api/users
```

### 3. Submit an Artist Bio
```sh
curl -X POST -H "Content-Type: application/json" -d '{"artistId":"abc123","bio":"My new bio"}' https://popular-mite-shree2604-bfb782a1.koyeb.app/api/bio
```

### 4. Get All Songs
```sh
curl https://popular-mite-shree2604-bfb782a1.koyeb.app/api/songs
```

### 5. Get Song by ID
```sh
curl https://popular-mite-shree2604-bfb782a1.koyeb.app/api/songs/<SONG_ID>
```

---

## 📨 Example Error Handling
If something goes wrong, you'll get a clear JSON error:
```json
{
  "error": "Invalid token"
}
```

---

## 🛠️ Onboarding Steps
1. Request API access and receive your credentials.
2. Authenticate using `/api/login` to get your token.
3. Use the token for all subsequent API calls.
4. Refer to [README_API.md](./README_API.md) and [Swagger UI](https://popular-mite-shree2604-bfb782a1.koyeb.app/api-docs) for full docs and schemas.
5. Test with Postman or cURL before integrating into production systems.

---

## 📖 Full API Documentation
- **Swagger UI:** [https://popular-mite-shree2604-bfb782a1.koyeb.app/api-docs](https://popular-mite-shree2604-bfb782a1.koyeb.app/api-docs)
- **README:** [README_API.md](./README_API.md)

---

## 💡 Best Practices
- Use HTTPS in production
- Handle errors gracefully
- Secure your tokens
- Use the latest API docs for integration
- Contact us for support or partnership

---

## 🏠 B2C vs B2B
- **B2C:** Your React frontend uses Axios/fetch to consume the same APIs.
- **B2B:** External businesses use cURL/Postman/SDKs to integrate with the API.

---

## 📬 Contact for API Support
For questions or onboarding, email: your@email.com

---

Happy integrating!

For more endpoints and details, see the [Swagger UI](https://popular-mite-shree2604-bfb782a1.koyeb.app/api-docs).
