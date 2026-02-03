# Football Mondays

A simple web application for managing weekly football sign-ups with React/TypeScript frontend and Go backend.

## Features

- Weekly football sign-up management
- First 10 people can play, others go to reserve list
- Sign-ups only allowed on Monday 8pm or later
- Simple username-based authentication
- Real-time status updates

## Language Support

This app currently supports 5 languages:

- 🇬🇧 **English** (en)
- 🇪🇸 **Spanish / Español** (es)
- 🇮🇹 **Italian / Italiano** (it)
- 🇸🇦 **Arabic / العربية** (ar) - with RTL support
- 🇩🇪 **German / Deutsch** (de)

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Backend**: Go with Gin framework
- **Data**: JSON file storage
- **Styling**: CSS

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Start the Server**:

   ```bash
   npm start
   ```

   Or for development with auto-restart:

   ```bash
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
