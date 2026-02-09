# Football Mondays

A simple web application for managing weekly football sign-ups with React/TypeScript frontend and Go backend.

## Features

- Weekly football sign-up management
- First 20 people can play, others go to reserve list
- Sign-ups only allowed on Monday 8pm or later
- Simple username-based authentication
- Real-time status updates

## Features

### Email Notifications

- Reserve players get notified by email when promoted to starting XI
- Optional email during registration
- Powered by Resend (100 free emails/day)

### Language Support

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
- **Email**: Resend API (free tier)
- **Data**: JSON file storage
- **Styling**: CSS with RTL support

## Setup

1. **Install Dependencies**:

   ```bash
   npm install
   go mod download
   ```

2. **Configure Email (Optional)**:

   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env and add your Resend API key
   # Get free API key at: https://resend.com/api-keys
   # Free tier: 100 emails/day, 3000/month
   ```

   The app will work without an API key but won't send actual emails (will just log them).

3. **Start the Server**:

   ```bash
   npm start
   ```

   Or for development with auto-restart:

   ```bash
   npm run dev
   ```

4. **Access the App**:
   Open your browser to `http://localhost:3000`

## API Endpoints

- `GET /api/status` - Get current week's sign-up status
- `POST /api/register` - Register a new user
- `POST /api/signup` - Sign up for current week
- `DELETE /api/signup` - Remove your sign-up
- `GET /api/user` - Get current user info

## Rules Implemented

- ✅ Sign-ups only open Monday 8 PM or later
- ✅ First 20 people get main spots
- ✅ Additional people go to reserve list
- ✅ Users can only sign themselves up
- ✅ One sign-up per person per week
- ✅ Automatic weekly reset

## Development

The app uses:

- **Backend**: Node.js with Express
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Storage**: JSON file (no database needed)
- **Authentication**: Simple cookie-based system

To modify the app:

- Edit `server.js` for backend logic
- Edit files in `public/` for frontend changes
- No build step required - just refresh the browser

## Deployment

For production deployment:

1. Set `PORT` environment variable
2. Consider using PM2 or similar process manager
3. Set up reverse proxy (nginx) if needed
4. Ensure `signups.json` file is writable by the application

## License

ISC
