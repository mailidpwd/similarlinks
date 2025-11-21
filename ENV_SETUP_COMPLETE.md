# ✅ Complete Environment Variables Setup

## 📁 File 1: Frontend `.env` (Project Root)

**Location**: `C:\Users\Michael\Documents\RDM Projects\Version 2\SimilarLinks\.env`

**Create this file** in the project root with this exact content:

```env
# Frontend Environment Variables (Expo)
# Google Gemini AI API Key (Required)
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyAafxIHpryH3m-RF9xEIcXsRlpDGXxq28k

# Google Gemini AI Backup API Key (Optional - leave empty if you don't have one)
EXPO_PUBLIC_GEMINI_API_KEY_BACKUP=
```

---

## 📁 File 2: Backend `.env` (Backend Folder)

**Location**: `C:\Users\Michael\Documents\RDM Projects\Version 2\SimilarLinks\backend\.env`

**Create this file** in the `backend` folder with this exact content:

```env
# Backend Environment Variables
# Google Gemini AI API Key (Required)
GEMINI_API_KEY=AIzaSyAafxIHpryH3m-RF9xEIcXsRlpDGXxq28k

# Google Gemini AI Backup API Key (Optional - leave empty if you don't have one)
GEMINI_API_KEY_BACKUP=

# ScraperAPI Key (Required - get from https://www.scraperapi.com/)
# ⚠️ REPLACE THIS with your actual ScraperAPI key
SCRAPERAPI_KEY=your-scraperapi-key-here

# Google Cloud Project ID (for Firestore and Cloud Logging)
GCP_PROJECT_ID=decision-recommendation-app

# Google Cloud Region (optional, defaults to us-central1)
GCP_REGION=us-central1
```

---

## 🚀 Quick Setup Steps

### Step 1: Create Frontend `.env`
1. Navigate to: `C:\Users\Michael\Documents\RDM Projects\Version 2\SimilarLinks\`
2. Create new file named: `.env` (no extension)
3. Copy the Frontend `.env` content above
4. Save the file

### Step 2: Create Backend `.env`
1. Navigate to: `C:\Users\Michael\Documents\RDM Projects\Version 2\SimilarLinks\backend\`
2. Create new file named: `.env` (no extension)
3. Copy the Backend `.env` content above
4. **IMPORTANT**: Replace `your-scraperapi-key-here` with your actual ScraperAPI key
5. Save the file

### Step 3: Restart Expo
```bash
# Stop Expo (Ctrl+C)
# Then restart with clear cache
npx expo start --clear
```

### Step 4: Verify Files Exist
```bash
# Check frontend .env
dir .env

# Check backend .env
dir backend\.env
```

---

## ✅ Verification Checklist

- [ ] Frontend `.env` file exists in project root
- [ ] Frontend `.env` has `EXPO_PUBLIC_GEMINI_API_KEY` set
- [ ] Backend `.env` file exists in `backend` folder
- [ ] Backend `.env` has `GEMINI_API_KEY` set
- [ ] Backend `.env` has `SCRAPERAPI_KEY` set (replace placeholder!)
- [ ] Backend `.env` has `GCP_PROJECT_ID=decision-recommendation-app`
- [ ] Restarted Expo with `--clear` flag

---

## 🔑 Where to Get API Keys

### Gemini API Key
- ✅ Already have: `AIzaSyAafxIHpryH3m-RF9xEIcXsRlpDGXxq28k`
- Get new one: https://makersuite.google.com/app/apikey

### ScraperAPI Key
- ⚠️ **You need to get this!**
- Sign up: https://www.scraperapi.com/
- Free tier available (1000 requests/month)
- Get your key from dashboard

### GCP Project ID
- ✅ Already set: `decision-recommendation-app`

---

## 🐛 Troubleshooting

### Error: "GEMINI_API_KEY environment variable is required"
- ✅ Make sure `.env` file exists in correct location
- ✅ Make sure variable name is exactly `EXPO_PUBLIC_GEMINI_API_KEY` (frontend) or `GEMINI_API_KEY` (backend)
- ✅ Restart Expo after creating/updating `.env`
- ✅ No spaces around `=` sign

### Backend can't find API keys
- ✅ Make sure `backend/.env` file exists
- ✅ Backend uses `python-dotenv` to load `.env` automatically
- ✅ Restart backend server after updating `.env`

### Frontend can't find API keys
- ✅ Make sure `.env` is in project root (not in `src` folder)
- ✅ Variable must start with `EXPO_PUBLIC_` prefix
- ✅ Restart Expo with `--clear` flag

---

## 📝 Notes

- `.env` files are already in `.gitignore` (won't be committed to git)
- Never share your `.env` files or commit them to GitHub
- For Cloud Run, environment variables are set via `gcloud` commands (not `.env` files)
- Frontend `.env` is only for local development
- Backend `.env` is only for local development (Cloud Run uses different method)

---

**After creating both files, restart Expo and the app should work!** 🎉

