@echo off
REM Fixed deployment script with correct API keys
REM Make sure you're in the backend directory

echo ========================================
echo Deploying to Google Cloud Run
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "main.py" (
    echo ERROR: main.py not found!
    echo Please navigate to the backend directory first
    pause
    exit /b 1
)

echo Current directory: %CD%
echo.

REM IMPORTANT: Replace SCRAPERAPI_KEY with your actual ScraperAPI key!
set GEMINI_API_KEY=AIzaSyAafxIHpryH3m-RF9xEIcXsRlpDGXxq28k
set SCRAPERAPI_KEY=YOUR-SCRAPERAPI-KEY-HERE
set GCP_PROJECT_ID=decision-recommendation-app

echo Deploying with project: %GCP_PROJECT_ID%
echo.

REM Deploy command (all on one line for cmd.exe)
gcloud run deploy decision-recommendation-api --source . --platform managed --region us-central1 --allow-unauthenticated --set-env-vars GEMINI_API_KEY=%GEMINI_API_KEY%,SCRAPERAPI_KEY=%SCRAPERAPI_KEY%,GCP_PROJECT_ID=%GCP_PROJECT_ID% --memory 2Gi --cpu 2 --timeout 300 --max-instances 10

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Deployment successful!
    echo ========================================
    echo.
    echo Getting your Cloud Run URL...
    gcloud run services describe decision-recommendation-api --region us-central1 --format "value(status.url)"
) else (
    echo.
    echo ========================================
    echo Deployment failed! Check the logs above.
    echo ========================================
)

pause

