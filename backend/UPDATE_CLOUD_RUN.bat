@echo off
REM Update Cloud Run service with ScraperAPI key
REM Run this from Cloud Shell, not local Windows

echo.
echo ========================================
echo Update Cloud Run Environment Variables
echo ========================================
echo.
echo Run this command in Cloud Shell:
echo.
echo gcloud run services update decision-recommendation-api --region us-central1 --update-env-vars SCRAPERAPI_KEY=3edee09be2007498fcc3e262efc0d826
echo.
echo Or update all at once:
echo.
echo gcloud run services update decision-recommendation-api --region us-central1 --update-env-vars GEMINI_API_KEY=AIzaSyAafxIHpryH3m-RF9xEIcXsRlpDGXxq28k,SCRAPERAPI_KEY=3edee09be2007498fcc3e262efc0d826,GCP_PROJECT_ID=decision-recommendation-app
echo.
pause

