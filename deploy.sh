#!/bin/bash

# AI Learning Outcomes Generator - Quick Deploy to Google Cloud Run
# Kogod School of Business × Google

set -e  # Exit on error

echo "🚀 AI Learning Outcomes Generator - Cloud Run Deployment"
echo "=========================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Google Cloud CLI (gcloud) is not installed${NC}"
    echo ""
    echo "Install it with:"
    echo "  brew install google-cloud-sdk"
    echo ""
    echo "Or download from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo -e "${GREEN}✅ Google Cloud CLI found${NC}"
echo ""

# Get project ID
echo -e "${BLUE}📋 Enter your Google Cloud Project ID:${NC}"
read -p "Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Project ID cannot be empty${NC}"
    exit 1
fi

# Set project
echo ""
echo -e "${YELLOW}🔧 Setting project to: $PROJECT_ID${NC}"
gcloud config set project $PROJECT_ID

# Get Gemini API Key
echo ""
echo -e "${BLUE}🔑 Enter your Google Gemini API Key:${NC}"
read -p "API Key: " GEMINI_KEY

if [ -z "$GEMINI_KEY" ]; then
    echo -e "${RED}❌ API Key cannot be empty${NC}"
    exit 1
fi

# Generate secret key
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")

# Service name
SERVICE_NAME="ai-learning-outcomes"
REGION="us-central1"

echo ""
echo -e "${YELLOW}📦 Configuration:${NC}"
echo "  Service Name: $SERVICE_NAME"
echo "  Region: $REGION"
echo "  Project: $PROJECT_ID"
echo ""

# Confirm
read -p "Deploy with these settings? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 1
fi

echo ""
echo -e "${YELLOW}🔌 Enabling required APIs...${NC}"
gcloud services enable run.googleapis.com --quiet
gcloud services enable containerregistry.googleapis.com --quiet

echo ""
echo -e "${YELLOW}🚀 Deploying to Cloud Run...${NC}"
echo "This may take 3-5 minutes..."
echo ""

gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars "FLASK_ENV=production,GEMINI_API_KEY=$GEMINI_KEY,SECRET_KEY=$SECRET_KEY" \
  --memory 1Gi \
  --timeout 300 \
  --quiet

echo ""
echo -e "${GREEN}✅ Deployment successful!${NC}"
echo ""

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format='value(status.url)')

echo "=========================================================="
echo -e "${GREEN}🎉 Your app is live!${NC}"
echo ""
echo -e "${BLUE}URL:${NC} $SERVICE_URL"
echo ""
echo "=========================================================="
echo ""
echo "Next steps:"
echo "1. Open the URL above in your browser"
echo "2. Test by uploading a syllabus"
echo "3. Share with faculty members!"
echo ""
echo "To update your deployment:"
echo "  ./deploy.sh"
echo ""
echo "To view logs:"
echo "  gcloud run logs tail $SERVICE_NAME --region $REGION"
echo ""
echo -e "${GREEN}Happy teaching! 🎓✨${NC}"
