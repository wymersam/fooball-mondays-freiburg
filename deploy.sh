#!/bin/bash

# Production deployment script for Football Mondays
# Ensures shared state persistence across deployments

echo "Football Mondays Deployment Script"

# Create data directory if it doesn't exist
mkdir -p /app/data

# Set environment variables for production
export GIN_MODE=release

echo "✅ Shared state setup complete"
echo "📁 Data file: $DATA_FILE"
echo "🌐 Starting server..."

# Start the application
./football-mondays