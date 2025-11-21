# Google Cloud Platform (GCP) Setup Guide

This guide will help you set up your project on Google Cloud Platform to meet the usage requirements:
- **Cloud Run Usage (+5)** - Deploy backend to Cloud Run
- **GCP Database Usage (+2)** - Set up Firestore
- **Google's AI Usage (+5)** - Track Gemini AI usage

---

## Prerequisites

1. **Google Cloud Account** - Sign up at https://cloud.google.com/
2. **Google Cloud SDK** - Install from https://cloud.google.com/sdk/docs/install
3. **Billing Account** - Enable billing on your GCP project (free tier available)

---

## Step 1: Create GCP Project

### In Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter project name: `decision-recommendation-app`
4. Click **"Create"**
5. Note your **Project ID** (e.g., `decision-recommendation-app-123456`)

### Set Project ID in Terminal:

```bash
gcloud config set project YOUR_PROJECT_ID
```

---

## Step 2: Enable Required APIs

Enable the following APIs in Google Cloud Console:

### Option A: Via Console
1. Go to [APIs & Services → Library](https://console.cloud.google.com/apis/library)
2. Search and enable each API:
   - **Cloud Run API**
   - **Firestore API**
   - **Cloud Logging API**
   - **Cloud Build API** (for deploying)
   - **Artifact Registry API** (for container images)

### Option B: Via Command Line

```bash
# Enable all required APIs
gcloud services enable \
  run.googleapis.com \
  firestore.googleapis.com \
  logging.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com
```

---

## Step 3: Set Up Firestore Database

### Create Firestore Database:

1. Go to [Firestore Console](https://console.cloud.google.com/firestore)
2. Click **"Create Database"**
3. Select **"Native mode"** (recommended)
4. Choose location: **us-central1** (or your preferred region)
5. Click **"Create"**

### Set Up Authentication:

Firestore will automatically use your Cloud Run service account. No additional setup needed!

---

## Step 4: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy your API key
4. Save it securely (you'll need it for environment variables)

---

## Step 5: Deploy Backend to Cloud Run

### 5.1: Set Environment Variables

Create a file `backend/.env` (or set in Cloud Run):

```env
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_API_KEY_BACKUP=your-backup-key-here
SCRAPERAPI_KEY=your-scraperapi-key-here
GCP_PROJECT_ID=your-project-id
GCP_REGION=us-central1
```

### 5.2: Deploy to Cloud Run

```bash
cd backend

# Build and deploy
gcloud run deploy decision-recommendation-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your-key,SCRAPERAPI_KEY=your-key,GCP_PROJECT_ID=your-project-id \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --max-instances 10
```

### 5.3: Get Your Cloud Run URL

After deployment, you'll get a URL like:
```
https://decision-recommendation-api-xxxxx-uc.a.run.app
```

**Update this in your frontend** (`src/services/api.ts`):
```typescript
const BACKEND_URL = 'https://decision-recommendation-api-xxxxx-uc.a.run.app';
```

---

## Step 6: Set Up Frontend Environment Variables

1. Create `.env` file in project root:
```env
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
EXPO_PUBLIC_GEMINI_API_KEY_BACKUP=your-backup-key-here
```

2. Restart Expo:
```bash
npx expo start --clear
```

---

## Step 7: Verify Usage Requirements

### Check Cloud Run Usage:
1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. Check your service is running and receiving requests
3. View metrics: Requests, CPU, Memory usage

### Check Firestore Usage:
1. Go to [Firestore Console](https://console.cloud.google.com/firestore)
2. Check collections: `recommendations`, `ai_usage_logs`
3. View data browser to see cached recommendations

### Check AI Usage:
1. Go to [Cloud Logging](https://console.cloud.google.com/logs)
2. Filter by: `service="gemini-ai"`
3. View AI API call logs

### Check Cloud Logging:
1. Go to [Cloud Logging](https://console.cloud.google.com/logs)
2. Filter by: `service="cloud-run"` or `service="firestore"`
3. View application logs

---

## Step 8: Monitor Usage

### View Metrics Dashboard:

1. Go to [Cloud Monitoring](https://console.cloud.google.com/monitoring)
2. Create custom dashboard with:
   - Cloud Run request count
   - Firestore read/write operations
   - AI API call count
   - Error rates

### Set Up Alerts (Optional):

1. Go to [Alerting](https://console.cloud.google.com/monitoring/alerting)
2. Create alerts for:
   - High error rates
   - Low request volume
   - API quota limits

---

## Troubleshooting

### Issue: Firestore not working
- **Solution**: Check that Firestore API is enabled
- **Solution**: Verify `GCP_PROJECT_ID` environment variable is set correctly

### Issue: Cloud Logging not showing logs
- **Solution**: Check that Cloud Logging API is enabled
- **Solution**: Verify service account has logging permissions

### Issue: Deployment fails
- **Solution**: Check that Cloud Build API is enabled
- **Solution**: Verify billing is enabled on your project
- **Solution**: Check Dockerfile is correct

### Issue: API keys not working
- **Solution**: Verify environment variables are set in Cloud Run
- **Solution**: Check API keys are valid and not expired

---

## Cost Estimation

### Free Tier (First 3 months):
- **Cloud Run**: 2 million requests/month free
- **Firestore**: 1 GB storage, 50K reads/day, 20K writes/day free
- **Cloud Logging**: 50 GB logs/month free
- **AI API**: Check [Gemini pricing](https://ai.google.dev/pricing)

### Estimated Monthly Cost (After Free Tier):
- **Cloud Run**: ~$5-10/month (depending on traffic)
- **Firestore**: ~$1-3/month (depending on usage)
- **Cloud Logging**: ~$0.50/month
- **Total**: ~$6-13/month (excluding AI API costs)

---

## Next Steps

1. ✅ Deploy backend to Cloud Run
2. ✅ Set up Firestore database
3. ✅ Configure environment variables
4. ✅ Test the application
5. ✅ Monitor usage in GCP Console
6. ✅ Verify all requirements are met

---

## Support

If you encounter issues:
1. Check [GCP Documentation](https://cloud.google.com/docs)
2. Review Cloud Run logs: `gcloud run services logs read decision-recommendation-api`
3. Check Firestore data in console
4. Review Cloud Logging for errors

---

**Good luck! 🚀**


