#!/bin/bash

# Your application's base URL (e.g., https://your-anonify-app.vercel.app)
APP_URL="https://annonify.vercel.app" # <<< IMPORTANT: Replace with your actual deployed app URL

# Calculate a random delay in seconds (e.g., up to 3599 seconds, which is just under an hour)
# This means the post will happen at a random time within the hour the cron job triggers.
RANDOM_DELAY=$(( RANDOM % 3600 )) # Random number between 0 and 3599

echo "Waiting for $RANDOM_DELAY seconds before posting..."
sleep $RANDOM_DELAY

echo "Making POST request to $APP_URL/api/bot-post"
curl -X POST "$APP_URL/api/bot-post"

echo "Post attempt complete."
