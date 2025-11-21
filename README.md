# SimilarLinks - AI-Powered Product Recommendation System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-lightgrey.svg)

**Intelligent product alternatives finder powered by Google Gemini AI**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-endpoints) • [Deployment](#-deployment)

</div>

---

## 📖 Overview

**SimilarLinks** is a mobile application that helps users find similar product alternatives across multiple Indian e-commerce platforms. Using Google Gemini AI, it intelligently matches products based on features and specifications, not just keywords.

### Key Capabilities

- 🔍 **Smart Product Matching**: AI-powered recommendations using Gemini 2.5 Flash
- 💰 **Real-time Pricing**: Live product data from Amazon and Flipkart
- 📸 **Image Recognition**: Identify products from photos using Gemini Vision API
- 🧾 **Invoice Extraction**: Automatically extract warranty, purchase date, and price from receipts
- 🛒 **Multi-platform Comparison**: Compare prices across Amazon, Flipkart, Meesho, Snapdeal, and more
- ⚡ **Fast & Reliable**: Serverless backend on Google Cloud Run with intelligent caching

---

## ✨ Features

### Product Search Methods
- **URL-based**: Paste Amazon/Flipkart product links
- **Text Search**: Type product names directly
- **Image Search**: Take a photo - AI identifies the product
- **Invoice Upload**: Extract product details from purchase receipts

### AI-Powered Recommendations
- Finds 3-6 similar product alternatives
- Intelligent category matching
- Feature-based comparison
- "Why pick this?" explanations for each alternative

### Multi-Platform Price Comparison
- Compare prices across multiple e-commerce sites
- Direct product links where available
- Search links for other platforms
- Real-time price updates

### Invoice Management
- Upload purchase receipts/invoices
- Automatic extraction of:
  - Product name and brand
  - Purchase date and price
  - Warranty period
  - Next service date

---

## 🏗️ Architecture


### Design Rationale

- **Cloud Run**: Serverless, auto-scaling, pay-per-use
- **Firestore**: Fast NoSQL database for caching
- **Gemini AI**: Fast, cost-effective AI for intelligent matching
- **Smart Fallback**: Direct Gemini mode if backend unavailable

---

## 🛠️ Tech Stack

### Frontend
- **React Native** with **Expo** (~54.0.25)
- **TypeScript** for type safety
- **React Navigation** for routing
- **TanStack Query** for API state management
- **Expo Image Picker** & **Document Picker**

### Backend
- **FastAPI** (Python 3.11+)
- **Google Gemini 2.5 Flash** (LLM + Vision API)
- **ScraperAPI** for web scraping
- **Firestore** for caching and usage tracking
- **Cloud Logging** for monitoring

### Cloud Infrastructure
- **Google Cloud Run** - Serverless backend hosting
- **Firestore** - NoSQL database for caching
- **Cloud Logging** - Application monitoring

---

## 📋 Prerequisites

### Required Software
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (3.11 or higher) - [Download](https://www.python.org/downloads/)
- **Google Cloud SDK** - [Installation Guide](https://cloud.google.com/sdk/docs/install)
- **Expo CLI** - Install via `npm install -g expo-cli`
- **Git** - [Download](https://git-scm.com/downloads)

### Required Accounts & API Keys
- **Google Cloud Account** - [Sign up](https://cloud.google.com/) (Free tier available)
- **Google Gemini API Key** - [Get from Google AI Studio](https://makersuite.google.com/app/apikey)
- **ScraperAPI Account** - [Sign up](https://www.scraperapi.com/) (Free tier: 1000 requests/month)

### Mobile Device
- Android or iOS device with **Expo Go** app installed
- Or use Android/iOS emulator

---

## 🚀 Installation

### 1. Clone the Repository
h
git clone https://github.com/mailidpwd/similarlinks.git
cd similarlinks### 2. Install Frontend Dependencies

npm install### 3. Install Backend Dependencies

cd backend
pip install -r requirements.txt### 4. Set Up Environment Variables

#### Frontend (`.env` in project root)

Create `.env` file:
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
EXPO_PUBLIC_GEMINI_API_KEY_BACKUP=your-backup-key-here#### Backend (`backend/.env`)

Create `backend/.env` file:
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_API_KEY_BACKUP=your-backup-key-here
SCRAPERAPI_KEY=your-scraperapi-key-here
GCP_PROJECT_ID=your-gcp-project-id
GCP_REGION=us-central1> 💡 **Note**: Copy `env.example` and `backend/env.example` as templates.

---

## 🏃 Running Locally

### Start Backend (Local Development)
h
cd backend
python main.pyBackend will run on `http://localhost:8000`

### Start Frontend

# From project root
npx expo startThen:
- Scan QR code with Expo Go app (Android/iOS)
- Or press `a` for Android emulator
- Or press `i` for iOS simulator

---

## 🌐 Deployment

### Deploy Backend to Google Cloud Run

#### Prerequisites
1. Create GCP project and enable APIs:
   gcloud services enable \
     run.googleapis.com \
     firestore.googleapis.com \
     logging.googleapis.com \
     cloudbuild.googleapis.com
   2. Create Firestore database:
   - Go to [Firestore Console](https://console.cloud.google.com/firestore)
   - Create database in "Native mode"
   - Choose region: `us-central1`

#### Deploy

**Option 1: From Cloud Shell** (Recommended)
cd backend
gcloud run deploy decision-recommendation-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your-key,SCRAPERAPI_KEY=your-key,GCP_PROJECT_ID=your-project-id \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300**Option 2: From Local Windows**
cd backend
DEPLOY.bat#### Update Backend URL in Frontend

After deployment, update `src/services/api.ts`:
export const BACKEND_URL = 'https://your-cloud-run-url.run.app';---

## 📡 API Endpoints

### Base URL
- **Local**: `http://localhost:8000`
- **Cloud Run**: `https://decision-recommendation-api-348821053890.us-central1.run.app`

### Endpoints

#### `GET /health`
Health check endpoint.

**Response:**
{
  "status": "healthy",
  "timestamp": "2024-11-21T06:58:49.739879"
}#### `POST /recommend`
Get product alternatives.

**Request:**
{
  "url": "https://www.amazon.in/dp/B0ABC123",
  "device": "android",
  "refresh": false,
  "share_text": "Product Name https://amzn.in/d/abc"
}**Response:**
{
  "source": "amazon",
  "canonical_url": "https://www.amazon.in/dp/B0ABC123",
  "query_time_iso": "2024-11-21T10:30:45.123Z",
  "alternatives": [
    {
      "id": "1",
      "brand": "Fire-Boltt",
      "title": "Fire-Boltt Ninja Call Pro Smartwatch",
      "image_url": "https://...",
      "price_estimate": "₹1,299",
      "rating_estimate": 4.2,
      "specs": ["1.69\" Display", "Bluetooth Calling"],
      "why_pick": "Similar features, better battery",
      "source_url": "https://www.amazon.in/dp/...",
      "source_site": "amazon"
    }
  ],
  "meta": {
    "validation": {
      "llm_valid_json": true,
      "image_urls_checked": true
    },
    "warnings": []
  }
}#### `POST /identify-product`
Identify product from image.

**Request:**on
{
  "image_base64": "iVBORw0KGgoAAAANSUhEUgAA..."
}
**Response:**
{
  "success": true,
  "product": {
    "brand": "Samsung",
    "product_name": "Galaxy Buds 2 Pro",
    "model": "SM-R510"
  }
}#### `POST /extract-invoice`
Extract invoice data from image.

**Request:**
{
  "image_base64": "iVBORw0KGgoAAAANSUhEUgAA..."
}**Response:**
{
  "success": true,
  "invoice": {
    "product_name": "Realme Buds T300",
    "brand": "Realme",
    "store": "Amazon",
    "purchase_date": "15/10/2024",
    "price": "₹2,299",
    "warranty": "1 Year"
  }
}#### `POST /multi-platform/search`
Search product across multiple platforms.

**Request:**
{
  "product_name": "Realme Buds T300",
  "brand": "Realme",
  "current_platform": "amazon"
}**Response:**
{
  "sellers": [
    {
      "platform": "Flipkart",
      "url": "https://www.flipkart.com/...",
      "price": "₹2,199",
      "available": true
    }
  ],
  "total_found": 5
}---

## 📁 Project Structure
