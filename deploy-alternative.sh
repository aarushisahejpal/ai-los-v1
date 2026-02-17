#!/bin/bash

# Alternative Deployment Options - Skip gcloud issues
# Kogod School of Business × Google

echo "🚀 AI Learning Outcomes Generator - Alternative Deployment"
echo "==========================================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Note: gcloud CLI is having Python compatibility issues.${NC}"
echo -e "${GREEN}Here are easier alternatives:${NC}"
echo ""

echo "=========================================================="
echo "Option 1: Deploy via Google Cloud Console (Web UI)"
echo "=========================================================="
echo ""
echo "1. Go to: https://console.cloud.google.com/run"
echo "2. Click 'CREATE SERVICE'"
echo "3. Select 'Continuously deploy from a repository'"
echo "4. Connect your GitHub/GitLab account"
echo "5. Push this code to a Git repository"
echo "6. Select the repository"
echo "7. Set build configuration:"
echo "   - Build Type: Dockerfile"
echo "   - Source location: /Dockerfile"
echo "8. Configure service:"
echo "   - Region: us-central1"
echo "   - Allow unauthenticated invocations: YES"
echo "   - Add environment variables:"
echo "     GEMINI_API_KEY=your_key"
echo "     FLASK_ENV=production"
echo "9. Click CREATE"
echo ""
echo "Your app will be deployed in 3-5 minutes!"
echo ""

echo "=========================================================="
echo "Option 2: Deploy to Heroku (EASIEST - No gcloud needed!)"
echo "=========================================================="
echo ""

# Check if heroku is installed
if ! command -v heroku &> /dev/null; then
    echo -e "${YELLOW}Installing Heroku CLI...${NC}"
    brew tap heroku/brew && brew install heroku
fi

echo "Run these commands:"
echo ""
echo -e "${BLUE}# 1. Login to Heroku${NC}"
echo "heroku login"
echo ""
echo -e "${BLUE}# 2. Create app${NC}"
echo "heroku create kogod-ai-learning-outcomes"
echo ""
echo -e "${BLUE}# 3. Set environment variables${NC}"
echo "heroku config:set GEMINI_API_KEY=YOUR_KEY_FROM_ENV_FILE"
echo "heroku config:set SECRET_KEY=\$(python3 -c 'import secrets; print(secrets.token_hex(32))')"
echo "heroku config:set FLASK_ENV=production"
echo ""
echo -e "${BLUE}# 4. Initialize git and deploy${NC}"
echo "git init"
echo "git add ."
echo "git commit -m 'Initial deployment'"
echo "heroku git:remote -a kogod-ai-learning-outcomes"
echo "git push heroku main"
echo ""
echo -e "${BLUE}# 5. Open your app${NC}"
echo "heroku open"
echo ""
echo "=========================================================="
echo ""

read -p "Deploy to Heroku now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${GREEN}Starting Heroku deployment...${NC}"
    
    # Check if logged in
    if ! heroku auth:whoami &>/dev/null; then
        echo "Please login to Heroku..."
        heroku login
    fi
    
    # Get API key from .env
    GEMINI_KEY=$(grep GEMINI_API_KEY .env | cut -d '=' -f2 | tr -d ' ')
    SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
    
    echo ""
    echo "Creating Heroku app..."
    heroku create kogod-ai-learning-outcomes || true
    
    echo ""
    echo "Setting environment variables..."
    heroku config:set GEMINI_API_KEY="$GEMINI_KEY"
    heroku config:set SECRET_KEY="$SECRET_KEY"
    heroku config:set FLASK_ENV=production
    
    echo ""
    echo "Initializing git..."
    if [ ! -d .git ]; then
        git init
        git add .
        git commit -m "Initial deployment"
    fi
    
    echo ""
    echo "Adding Heroku remote..."
    heroku git:remote -a kogod-ai-learning-outcomes || true
    
    echo ""
    echo -e "${GREEN}Deploying to Heroku...${NC}"
    echo "This will take 2-3 minutes..."
    git push heroku main || git push heroku master
    
    echo ""
    echo -e "${GREEN}✅ Deployment complete!${NC}"
    echo ""
    heroku open
fi

echo ""
echo "=========================================================="
echo "Option 3: Deploy to Railway (Modern & Easy)"
echo "=========================================================="
echo ""
echo "1. Go to: https://railway.app"
echo "2. Click 'Start a New Project'"
echo "3. Click 'Deploy from GitHub repo'"
echo "4. Authorize Railway to access GitHub"
echo "5. Push this code to GitHub"
echo "6. Select the repository"
echo "7. Railway auto-detects Dockerfile"
echo "8. Add environment variables in Railway dashboard:"
echo "   - GEMINI_API_KEY"
echo "   - SECRET_KEY"
echo "   - FLASK_ENV=production"
echo "9. Deploy!"
echo ""
echo "Your app will be live in 2 minutes!"
echo ""

echo "=========================================================="
echo "Need to push to GitHub first?"
echo "=========================================================="
echo ""
echo "Run these commands:"
echo ""
echo "# 1. Create a new repository on GitHub"
echo "# 2. Then run:"
echo "git init"
echo "git add ."
echo "git commit -m 'Initial commit'"
echo "git branch -M main"
echo "git remote add origin YOUR_GITHUB_REPO_URL"
echo "git push -u origin main"
echo ""
echo "=========================================================="
echo ""
echo -e "${GREEN}Pick the easiest option for you!${NC}"
echo ""
