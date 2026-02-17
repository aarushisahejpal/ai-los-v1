# 🚀 DEPLOY IN 5 MINUTES - Quick Start

## Choose Your Deployment Method:

---

## 🥇 **Option 1: One-Command Deploy (Recommended)**

### For Google Cloud Run:

```bash
./deploy.sh
```

That's it! The script will:
- ✅ Check prerequisites
- ✅ Ask for your Google Cloud Project ID
- ✅ Ask for your Gemini API Key
- ✅ Enable required APIs
- ✅ Deploy your app
- ✅ Give you the live URL

**Time: ~5 minutes**

---

## 🥈 **Option 2: Manual Cloud Run Deploy**

```bash
# 1. Install gcloud (if needed)
brew install google-cloud-sdk

# 2. Login
gcloud auth login

# 3. Deploy
gcloud run deploy ai-learning-outcomes \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars FLASK_ENV=production,GEMINI_API_KEY=YOUR_KEY \
  --memory 1Gi
```

**Time: ~5 minutes**

---

## 🥉 **Option 3: Heroku (Easiest)**

```bash
# 1. Install Heroku CLI
brew install heroku

# 2. Login and create app
heroku login
heroku create kogod-ai-learning

# 3. Set config
heroku config:set GEMINI_API_KEY=your_key
heroku config:set FLASK_ENV=production

# 4. Deploy
git init
git add .
git commit -m "Deploy"
git push heroku main

# 5. Open
heroku open
```

**Time: ~10 minutes**

---

## 🎯 What You Need:

1. ✅ **Google Gemini API Key** (you already have this in `.env`)
2. ✅ **Google Cloud Project** (or create one free)
3. ✅ **5 minutes** of your time

---

## 🔥 Fastest Way (Copy-Paste):

```bash
# Just run this:
./deploy.sh
```

Then enter:
1. Your Google Cloud Project ID
2. Your Gemini API Key (from your `.env` file)

**DONE! Your app will be live! 🎉**

---

## 🆘 Don't have Google Cloud set up?

### Quick Setup:

1. **Go to**: https://console.cloud.google.com
2. **Click**: "Create Project"
3. **Name it**: "kogod-ai-learning"
4. **Copy the Project ID** (shown under the name)
5. **Run**: `./deploy.sh`

**Free tier includes**: 2 million requests/month

---

## 💡 Tips:

- **First time?** → Use `./deploy.sh` (easiest)
- **Already have gcloud?** → Copy-paste the manual command
- **Want simplest?** → Use Heroku
- **Need help?** → See `DEPLOYMENT.md`

---

## 🎊 After Deployment:

You'll get a URL like:
```
https://ai-learning-outcomes-xxxxx.run.app
```

**Share it with your faculty team!** 🎓

---

## 📱 Test It:

1. Open the URL
2. Upload `sample_syllabus.txt`
3. Watch AI magic happen! ✨

---

**Let's deploy NOW! Run `./deploy.sh` 🚀**
