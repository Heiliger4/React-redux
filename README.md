# Addis Songs App

A full-stack application for managing a list of songs.

## Live Demo
- **Frontend:** [https://addis-songs.vercel.app/](https://addis-songs.vercel.app/)
- **Backend:** [https://addis-songs-backend.onrender.com/api/](https://addis-songs-backend.onrender.com/api/)

---

## Features
- Paginated list of songs (title, artist, album, year, etc.)
- Create, Read, Update, Delete (CRUD) operations
- Search by title, artist, or album
- Responsive, modern dark UI with orange/white accents
- Node/Express REST API backend

---

## Technologies
- **Frontend:** ReactJS, Redux Toolkit, Redux-Saga, MUI, Webpack (manual config)
- **Backend:** Node.js, Express

---

## API Endpoints
All endpoints are prefixed with `/api`.

| Method | Endpoint         | Description                                    |
| ------ | ---------------- | ---------------------------------------------- |
| GET    | `/api/songs`     | Get paginated list. Query: `page`, `limit`, `search` |
| POST   | `/api/songs`     | Create a new song. Body: `{ title, artist, ... }` |
| GET    | `/api/songs/:id` | Get a single song by ID                        |
| PUT    | `/api/songs/:id` | Update a song by ID                            |
| DELETE | `/api/songs/:id` | Delete a song by ID                            |
| GET    | `/api/health`    | Health check                                   |

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Docker & Docker Compose (optional)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd addis-songs-app
```

### 2. Run with Docker Compose (Recommended)
```bash
docker-compose up -d
```
- Frontend: [http://localhost:4001](http://localhost:4001)
- Backend: [http://localhost:5001/api](http://localhost:5001/api)

### 3. Manual Setup
#### Backend
```bash
cd backend
npm install
npm run dev
```
#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Webpack
- Manual Webpack config (no CRA)
- Handles JS/JSX, CSS, HTML
- Uses `dotenv-webpack` for environment variables (e.g., `API_BASE_URL`)
- Code splitting for optimized bundle size
- See `frontend/webpack.config.js` for details

---

## Verification
- All CRUD and pagination features tested in browser
- API endpoints tested with Postman
- Responsive and error states checked

---

## Deployment
- **Frontend:** Vercel ([link](https://addis-songs.vercel.app/))
- **Backend:** Render ([link](https://addis-songs-backend.onrender.com/api/))
