# Lyric Loom

A full-stack music platform developed under the WBD Course by Team 31.



## Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Features](#features)
- [Directory Structure](#directory-structure)
- [Setup and Installation](#setup-and-installation)
- [API Documentation](#api-documentation)
- [B2B Integration](#b2b-integration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)



## Project Overview
Lyric Loom is a robust music web application designed for both B2C (frontend users) and B2B (external partners) scenarios. It provides a RESTful API for user management, song management, artist bios, and includes advanced features like PDF ticketing and email notifications.



## Architecture
- **Frontend:** React (Redux, MUI, TailwindCSS, Chart.js, Axios, etc.)
- **Backend:** Node.js, Express, MongoDB (Mongoose), Redis, JWT authentication, Swagger/OpenAPI docs.
- **Testing:** Jest, Supertest, HTML coverage reports.
- **Deployment:** Docker Compose, Vercel, Koyeb, or local.



## Features
### User-Facing (B2C)
- User registration, login, and JWT-based authentication.
- Browse, search, and play songs.
- Manage playlists and favorites.
- Artist bios and profiles.
- Purchase concert tickets (with PDF ticket email delivery).

### Partner-Facing (B2B)
- Secure API key authentication for partners.
- Endpoints for song ingestion, user management, and artist bios.
- Usage logging and statistics for partners.
- Detailed integration guides and usage samples.

### Admin/Artist
- Admin and artist dashboards.
- Song uploads, analytics, and profile management.


## Directory Structure
```
lyric-loom/
├── .git/                   # Git version control
├── .github/                # GitHub workflows (CI/CD)
│   └── workflows/
├── README.md               # Project overview (this file)
├── docker-compose.yml      # Multi-service orchestration
├── lyric-backend/          # Backend (Node.js/Express)
│   ├── Server.js           # Main backend entrypoint
│   ├── swagger.js          # Swagger/OpenAPI setup
│   ├── sendTicket.js       # Email ticketing with PDF
│   ├── models/             # Mongoose models (User, Song, etc.)
│   ├── routes/             # API route handlers (users, songs, auth, etc.)
│   ├── middleware/         # Auth, validation, etc.
│   ├── uploads/            # Uploaded files (songs, images)
│   ├── tests/              # Jest/Supertest test suites
│   ├── utils/              # Redis client, helpers
│   ├── B2B_API_SAMPLE.md   # Partner API usage samples
│   ├── B2B_API_PARTNER_GUIDE.md # Partner integration guide
│   ├── README_API.md       # Full API documentation
│   └── ...                 # Other configs and files
├── lyric-frontend/         # Frontend (React)
│   ├── public/             # Static assets, manifest, icons
│   ├── src/                # React source code
│   │   ├── components/     # UI components
│   │   ├── main/           # Main navigation and landing
│   │   ├── client/         # User-facing pages
│   │   ├── admin/          # Admin dashboard
│   │   ├── artist/         # Artist dashboard
│   │   ├── api/            # API utilities
│   │   └── ...             # Other features and logic
│   ├── package.json        # Frontend dependencies
│   └── ...                 # Build, coverage, etc.
```



## Setup and Installation
### Prerequisites
- Node.js (v16+ recommended)
- npm
- Docker & Docker Compose (for containerized deployment)
- MongoDB (local or cloud, if not using Docker)

### Local Development
1. **Clone the repository:**
   ```sh
   git clone https://github.com/Shree2604/lyric-loom.git
   cd lyric-loom
   ```
2. **Backend setup:**
   ```sh
   cd lyric-backend
   npm install
   npm run server         # or: node Server.js
   ```
3. **Frontend setup:**
   ```sh
   cd ../lyric-frontend
   npm install
   npm start
   ```
4. **Orchestrated with Docker Compose:**
   ```sh
   docker-compose up --build
   ```
   - This will start MongoDB, backend, and frontend services.



## API Documentation
- **Interactive Swagger UI** 
- **API Docs:** See `lyric-backend/README_API.md` for endpoint details, authentication, usage samples, and error handling.
- **B2B Guides:** See `lyric-backend/B2B_API_PARTNER_GUIDE.md` and `lyric-backend/B2B_API_SAMPLE.md`.



## B2B Integration
- **API Key Authentication:** All partner requests require an `x-api-key` header.
- **Sample Requests:** See `B2B_API_SAMPLE.md` for cURL/Postman examples.
- **Usage Logging:** All partner requests are logged for security and analytics.



## Testing
- **Backend:** Jest and Supertest (see `lyric-backend/tests/`)
  ```sh
  npm test
  ```
- **Frontend:** React Testing Library, Jest (see `lyric-frontend/src/setupTests.js`)
  ```sh
  npm test
  ```
- **Coverage Reports:** Generated in the `coverage/` directories.



## Deployment
- **Docker Compose:** See `docker-compose.yml` for multi-service orchestration.
- **Vercel/Koyeb:** Backend and frontend can be deployed to cloud platforms.
- **CI/CD:** GitHub Actions workflows for automated testing and deployment (see `.github/workflows/`).



## Contributing
Contributions are welcome! Please open issues or submit pull requests for improvements, bug fixes, or new features.


## Acknowledgements
- WBD Course, Team 31
- Open source libraries: React, Express, MongoDB, MUI, TailwindCSS, Jest, Docker, and more.



**For detailed API usage, error handling, and partner integration, please refer to the files in `lyric-backend/` and the Swagger UI.**
