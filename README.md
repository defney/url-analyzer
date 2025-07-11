# URL Analyzer

This is a full-stack web application for analyzing web pages.

- Backend: FastAPI (Python)
- Frontend: React with TypeScript

## Project Structure

```
url-analyzer/
├── url-analyzer-backend/       # Python FastAPI backend
└── url-analyzer-frontend-ts/   # React frontend (TypeScript)
```

## Requirements

- Python 3.9+
- Node.js 18+
- npm

## Backend Setup

```bash
cd url-analyzer-backend
python -m venv venv
source venv/bin/activate           # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Runs at: http://localhost:8000

## Frontend Setup

```bash
cd url-analyzer-frontend-ts
npm install
npm start
```

Runs at: http://localhost:3000

## Notes

- Make sure the backend is running before using the frontend.
- The backend uses a local SQLite database (database.db).
