# 🚀 Deployment Guide - AI Learning Outcomes Generator

This guide covers multiple deployment options for your application.

---

## ⭐ Option 1: Google Cloud Run (RECOMMENDED)

**Best for:** Google partnership projects, auto-scaling, pay-per-use

### Prerequisites
1. Google Cloud account
2. Google Cloud CLI installed ([Download here](https://cloud.google.com/sdk/docs/install))
3. Billing enabled on your Google Cloud project

### Step-by-Step Deployment

#### 1. Install Google Cloud CLI (if not already installed)
```bash
# macOS
brew install google-cloud-sdk

# Or download from: https://cloud.google.com/sdk/docs/install
```

#### 2. Authenticate and Set Up Project
```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create kogod-ai-learning-outcomes --name="AI Learning Outcomes"

# Set the project
gcloud config set project kogod-ai-learning-outcomes

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

#### 3. Set Environment Variables in Cloud Run
```bash
# You'll add your GEMINI_API_KEY as a secret
gcloud secrets create gemini-api-key --data-file=- <<EOF
YOUR_GEMINI_API_KEY_HERE
EOF
```

#### 4. Deploy to Cloud Run
```bash
# Navigate to your project directory
cd /Users/aarushisahejpal/Dropbox/google-ai-deployment

# Deploy (this builds and deploys in one command!)
gcloud run deploy ai-learning-outcomes \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars FLASK_ENV=production \
  --set-secrets GEMINI_API_KEY=gemini-api-key:latest \
  --memory 1Gi \
  --timeout 300
```

#### 5. Your App is Live! 🎉
Cloud Run will give you a URL like:
```
https://ai-learning-outcomes-XXXXX-uc.a.run.app
```

### Update Your Deployment
```bash
# After making changes, just run deploy again
gcloud run deploy ai-learning-outcomes --source .
```

### View Logs
```bash
gcloud run logs tail ai-learning-outcomes
```

### Cost Estimate
- **Free tier**: 2 million requests/month
- **After free tier**: ~$0.00002 per request
- **Very affordable** for this use case!

---

## 🔵 Option 2: Heroku (Easiest for Beginners)

**Best for:** Quick deployment, simple management

### Prerequisites
1. Heroku account ([Sign up free](https://signup.heroku.com/))
2. Heroku CLI installed

### Step-by-Step Deployment

#### 1. Install Heroku CLI
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Or download from: https://devcenter.heroku.com/articles/heroku-cli
```

#### 2. Login and Create App
```bash
# Login
heroku login

# Create app
heroku create kogod-ai-learning-outcomes

# Add buildpack
heroku buildpacks:set heroku/python
```

#### 3. Set Environment Variables
```bash
heroku config:set GEMINI_API_KEY=your_gemini_api_key_here
heroku config:set SECRET_KEY=your_random_secret_key_here
heroku config:set FLASK_ENV=production
```

#### 4. Deploy
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial deployment"

# Deploy to Heroku
git push heroku main
```

#### 5. Open Your App
```bash
heroku open
```

### Update Your Deployment
```bash
git add .
git commit -m "Update app"
git push heroku main
```

### Cost Estimate
- **Free tier**: Available with limitations
- **Hobby**: $7/month
- **Standard**: $25-50/month

---

## 🟠 Option 3: AWS Elastic Beanstalk

**Best for:** AWS ecosystem integration

### Prerequisites
1. AWS account
2. EB CLI installed

### Quick Deploy
```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p python-3.11 ai-learning-outcomes --region us-east-1

# Create environment and deploy
eb create kogod-ai-production

# Set environment variables
eb setenv GEMINI_API_KEY=your_key SECRET_KEY=your_secret FLASK_ENV=production

# Open app
eb open
```

---

## 🟢 Option 4: Railway (Modern Alternative)

**Best for:** Modern UI, GitHub integration

### Steps
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Push this code to GitHub
6. Select the repository
7. Add environment variables in Railway dashboard:
   - `GEMINI_API_KEY`
   - `SECRET_KEY`
   - `FLASK_ENV=production`
8. Railway auto-deploys! 🚀

---

## 🔐 Important: Environment Variables

For ALL deployment options, you need these environment variables:

| Variable | Value | Required |
|----------|-------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |
| `SECRET_KEY` | Random secret string | Yes |
| `FLASK_ENV` | `production` | Yes |
| `PORT` | Auto-set by platform | No (auto) |

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] Your `.env` file is NOT committed to Git (it's in `.gitignore`)
- [ ] You have your Gemini API key ready
- [ ] All dependencies are in `requirements.txt`
- [ ] The app runs locally without errors
- [ ] You've tested with sample data

---

## 🔒 Security Best Practices

### 1. Never Commit Secrets
```bash
# Verify .env is ignored
git status
# .env should NOT appear in the list
```

### 2. Use Strong Secret Keys
```python
# Generate a strong secret key:
python -c "import secrets; print(secrets.token_hex(32))"
```

### 3. Enable HTTPS
- Cloud Run: Auto-enabled ✅
- Heroku: Auto-enabled ✅
- Railway: Auto-enabled ✅

### 4. Set Production Environment
Always set `FLASK_ENV=production` in production!

---

## 🧪 Test Your Deployment

After deployment, test these features:

1. ✅ Upload a syllabus (PDF, DOCX, or TXT)
2. ✅ AI extraction works
3. ✅ Validation interface functions
4. ✅ Framework matching produces results
5. ✅ Export works (JSON and TXT)

---

## 📊 Monitoring & Logs

### Google Cloud Run
```bash
# View logs
gcloud run logs tail ai-learning-outcomes --region us-central1

# View metrics in Console
# Go to: https://console.cloud.google.com/run
```

### Heroku
```bash
# View logs
heroku logs --tail

# View metrics
heroku dashboard
```

---

## 🔄 Continuous Deployment (Optional)

### GitHub Actions + Cloud Run

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Cloud Run
        uses: google-github-actions/deploy-cloudrun@main
        with:
          service: ai-learning-outcomes
          region: us-central1
          source: ./
          credentials: ${{ secrets.GCP_SA_KEY }}
```

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid (Low Traffic) | Best For |
|----------|-----------|-------------------|----------|
| **Cloud Run** | 2M requests/month | ~$5-10/month | Google projects |
| **Heroku** | Limited | $7/month | Quick start |
| **Railway** | $5 credit/month | ~$5-15/month | Modern UI |
| **AWS EB** | 12 months free | ~$10-20/month | AWS users |

---

## 🎯 Recommended: Google Cloud Run

For this Kogod × Google project, I **strongly recommend Google Cloud Run** because:

1. ✅ **Google Partnership**: Perfect alignment
2. ✅ **Auto-scaling**: Handles variable traffic
3. ✅ **Pay-per-use**: Cost-effective
4. ✅ **Easy updates**: One command to deploy
5. ✅ **Built-in HTTPS**: Automatic SSL
6. ✅ **Free tier**: 2M requests/month

---

## 🚀 Quick Start: Deploy to Cloud Run NOW

```bash
# 1. Install gcloud CLI (if needed)
brew install google-cloud-sdk

# 2. Login
gcloud auth login

# 3. Set project
gcloud config set project YOUR_PROJECT_ID

# 4. Enable APIs
gcloud services enable run.googleapis.com

# 5. Deploy!
cd /Users/aarushisahejpal/Dropbox/google-ai-deployment
gcloud run deploy ai-learning-outcomes \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars FLASK_ENV=production,GEMINI_API_KEY=YOUR_KEY_HERE \
  --memory 1Gi

# 6. Done! 🎉
```

---

## 📞 Support

- **Cloud Run Docs**: https://cloud.google.com/run/docs
- **Heroku Docs**: https://devcenter.heroku.com/
- **Google AI Docs**: https://ai.google.dev/

---

**Your app is production-ready! Choose a platform and deploy! 🚀**
