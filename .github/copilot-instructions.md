# Football Mondays Sign-up App

This project is a web application for managing weekly football sign-ups with the following requirements:

## Project Requirements

- Simple web app to replace WhatsApp sign-up process
- First 10 people to sign up can play
- Additional people go to reserve list
- Must sign up at 8pm or after on Monday
- Users can only sign up themselves (no signing up others)
- Clean, simple interface for managing weekly football games

## Technical Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js/Express API
- Database: JSON file or SQLite for simplicity
- Authentication: Simple username system
- Time validation: Monday 8pm rule enforcement

## Development Guidelines

- Keep the interface simple and mobile-friendly
- Implement clear visual distinction between main list (10 players) and reserve list
- Include time validation to prevent early sign-ups
- Show current week's sign-up status
- Reset sign-ups weekly on Monday at 8pm
