# Football Mondays

A simple web application for managing weekly football sign-ups with React/TypeScript frontend and Go backend.

## Features

- Weekly football sign-up management
- First 10 people can play, others go to reserve list
- Sign-ups only allowed on Monday 8pm or later
- Simple username-based authentication
- Real-time status updates

## Language Support

This app supports 6 languages:

- 🇬🇧 **English** (en)
- 🇪🇸 **Spanish / Español** (es)
- 🇮🇹 **Italian / Italiano** (it)
- 🇸🇦 **Arabic / العربية** (ar) - with RTL support
- 🇩🇪 **German / Deutsch** (de)
- 🇧🇷 **Portuguese / Português** (pt)

## Tech Stack

- **Frontend**: React 19 with TypeScript, Vite
- **Backend**: Go 1.24 with Gin framework
- **Data**: SQLite database (persistent)
- **Styling**: CSS with RTL support

## Setup

1. **Install Dependencies**:

   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   go mod download
   ```

2. **Start the Backend**:

   ```bash
   cd backend
   go run main.go
   ```

   Or for development with auto-restart:

   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the App**:
   Open your browser to `http://localhost:3000`

## API Endpoints

- `GET /api/status` - Get current week's sign-up status
- `POST /api/register` - Register a new user
- `POST /api/signup` - Sign up for current week
- `DELETE /api/signup` - Remove your sign-up
- `GET /api/user` - Get current user info

## Rules Implemented

- ✅ Sign-ups only open Monday 8 PM or later
- ✅ First 10 people get main spots
- ✅ Additional people go to reserve list
- ✅ Users can only sign themselves up
- ✅ One sign-up per person per week
- ✅ Automatic weekly reset

## Development Notes

- **Backend**: Go with Gin, persistent SQLite database (no more JSON file)
- **Frontend**: React/TypeScript (Vite)
- **Authentication**: Cookie-based, with frontend using localStorage for session and language
