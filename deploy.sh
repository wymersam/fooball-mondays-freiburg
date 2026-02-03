#!/bin/bash

# Production deployment script for Football Mondays
# Ensures shared state persistence across deployments

echo "🏈 Football Mondays Deployment Script"

# Create data directory if it doesn't exist
mkdir -p /app/data

# Set proper permissions for data file
touch /app/data/signups.json
chmod 666 /app/data/signups.json

# Set environment variables for production
export GIN_MODE=release
export DATA_FILE=/app/data/signups.json

echo "✅ Shared state setup complete"
echo "📁 Data file: $DATA_FILE"
echo "🌐 Starting server..."

# Start the application
./football-mondays