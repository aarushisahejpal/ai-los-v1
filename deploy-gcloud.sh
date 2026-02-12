#!/bin/bash

# Google Cloud Run Deployment - Fixed for Python compatibility
# Set environment variables for gcloud

export PATH="/opt/homebrew/share/google-cloud-sdk/bin:$PATH"
export CLOUDSDK_PYTHON=/usr/local/bin/python3.11

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🚀 Deploying to Google Cloud Run"
echo "=================================="
echo ""

# Get project ID
echo -e "${BLUE}Enter your Google Cloud Project ID:${NC}"
echo "(Create one at https://console.cloud.google.com if you don't have one)"
read -p "Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo "Project ID cannot be empty"
    exit 1
fi

# Set project
echo ""
echo -e "${YELLOW}Setting project...${NC}"
gcloud config set project $PROJECT_ID

# Get API key
echo ""
echo -e "${BLUE}Enter your Gemini API Key:${NC}"
GEMINI_KEY=$(grep GEMINI_API_KEY .env | cut -d '=' -f2 | tr -d ' ')
echo "Found in .env: $GEMINI_KEY"
read -p "Press Enter to use this key, or paste a different one: " INPUT_KEY

if [ ! -z "$INPUT_KEY" ]; then
    GEMINI_KEY=$INPUT_KEY
fi

# Enable APIs
echo ""
echo -e "${YELLOW}Enabling required APIs...${NC}"
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Deploy
echo ""
echo -e "${GREEN}Deploying to Cloud Run...${NC}"
echo "This will take 3-5 minutes..."
echo ""

gcloud run deploy ai-learning-outcomes \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "FLASK_ENV=production,GEMINI_API_KEY=$GEMINI_KEY,SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_hex(32))')" \
  --memory 1Gi \
  --timeout 300

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Your app URL:"
gcloud run services describe ai-learning-outcomes --region us-central1 --format='value(status.url)'
echo ""
