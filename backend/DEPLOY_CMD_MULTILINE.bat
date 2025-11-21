@echo off
REM Command Prompt deployment with line continuation (^)
REM Navigate to backend directory first, then run this script

gcloud run deploy decision-recommendation-api ^
  --source . ^
  --platform managed ^
  --region us-central1 ^
  --allow-unauthenticated ^
  --set-env-vars GEMINI_API_KEY=your-gemini-key,SCRAPERAPI_KEY=your-scraperapi-key,GCP_PROJECT_ID=decision-recommendation-app ^
  --memory 2Gi ^
  --cpu 2 ^
  --timeout 300 ^
  --max-instances 10

pause

