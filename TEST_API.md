# Testing Your Cloud Run API

## ✅ Your API is Working!

The 404 errors you're seeing are **normal** - they're just for files that don't exist (favicon, index page). Your API is actually working!

## 🧪 Test Your API Endpoints

### 1. Health Check (Test This First!)

**URL**: https://decision-recommendation-api-348821053890.us-central1.run.app/health

**Expected Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-..."
}
```

**How to Test**:
- Open in browser: https://decision-recommendation-api-348821053890.us-central1.run.app/health
- Or use curl: `curl https://decision-recommendation-api-348821053890.us-central1.run.app/health`

### 2. Main Recommendation Endpoint

**URL**: https://decision-recommendation-api-348821053890.us-central1.run.app/recommend

**Method**: POST

**Body** (JSON):
```json
{
  "url": "https://www.amazon.in/dp/B0ABC123",
  "device": "android",
  "refresh": false
}
```

**Test with curl**:
```bash
curl -X POST https://decision-recommendation-api-348821053890.us-central1.run.app/recommend \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.amazon.in/dp/B0ABC123","device":"android","refresh":false}'
```

### 3. Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/recommend` | POST | Get product recommendations |
| `/identify-product` | POST | Identify product from image |
| `/extract-invoice` | POST | Extract invoice data |
| `/multi-platform/search` | POST | Search across platforms |

## 🔍 About Those 404 Errors

The errors you're seeing are **completely normal**:

1. **`/favicon.ico`** - Browsers automatically request this. Your API doesn't serve favicons, so 404 is expected.
2. **`(index)`** - Browsers try to load an index page. Your API doesn't have one, so 404 is expected.

**These are NOT errors with your API!** Your API is working fine.

## ✅ Verify Your API is Working

### Option 1: Test Health Endpoint (Easiest)

Open this URL in your browser:
```
https://decision-recommendation-api-348821053890.us-central1.run.app/health
```

You should see:
```json
{"status":"healthy","timestamp":"2024-..."}
```

If you see this, **your API is working perfectly!** ✅

### Option 2: Use Postman or Thunder Client

1. Create a new POST request
2. URL: `https://decision-recommendation-api-348821053890.us-central1.run.app/recommend`
3. Headers: `Content-Type: application/json`
4. Body:
```json
{
  "url": "https://www.amazon.in/dp/B0ABC123",
  "device": "android",
  "refresh": false
}
```

### Option 3: Use curl (Command Line)

**Windows PowerShell**:
```powershell
Invoke-RestMethod -Uri "https://decision-recommendation-api-348821053890.us-central1.run.app/health" -Method Get
```

**Linux/Mac**:
```bash
curl https://decision-recommendation-api-348821053890.us-central1.run.app/health
```

## 🐛 Troubleshooting

### If Health Endpoint Returns 404

1. Check the URL is correct
2. Make sure the service is deployed:
   ```cmd
   gcloud run services list --region us-central1
   ```

### If You Get 500 Errors

Check the logs:
```cmd
gcloud run services logs read decision-recommendation-api --region us-central1 --limit 50
```

### If API is Slow

- First request may be slow (cold start)
- Subsequent requests should be faster
- Check Cloud Run metrics in console

## 📊 View Logs

```cmd
# Stream logs in real-time
gcloud run services logs tail decision-recommendation-api --region us-central1

# View recent logs
gcloud run services logs read decision-recommendation-api --region us-central1 --limit 50
```

## 🎯 Quick Test Checklist

- [ ] Health endpoint returns `{"status":"healthy"}`
- [ ] No errors in Cloud Run logs
- [ ] Service shows as "Active" in Cloud Console
- [ ] Frontend can connect to the API

---

**Your API is working! The 404s are just for files that don't exist (favicon, index page). Test the `/health` endpoint to confirm!** ✅


