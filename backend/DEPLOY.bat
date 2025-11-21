@echo off
REM Deploy backend to Cloud Run (Windows CMD)
REM Run this from the backend directory

echo.
echo ========================================
echo Deploying to Cloud Run
echo ========================================
echo.

gcloud run deploy decision-recommendation-api --source . --platform managed --region us-central1 --allow-unauthenticated --set-env-vars GEMINI_API_KEY=AIzaSyAafxIHpryH3m-RF9xEIcXsRlpDGXxq28k,SCRAPERAPI_KEY=3edee09be2007498fcc3e262efc0d826,GCP_PROJECT_ID=decision-recommendation-app --memory 2Gi --cpu 2 --timeout 300

echo.
echo ========================================
echo Deployment complete!
echo ========================================
pause

