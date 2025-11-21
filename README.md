# SimilarLinks - AI-Powered Product Recommendation System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS-lightgrey.svg)

**Intelligent product alternatives finder powered by Google Gemini AI**

[Features](#-features) • [Implementation](#-implementation-details) • [Architecture](#-architecture) • [API](#-api-endpoints) • [Deployment](#-deployment)

</div>

---

## 📖 Overview

**SimilarLinks** is a mobile application that helps users find similar product alternatives across multiple Indian e-commerce platforms. Using Google Gemini AI, it intelligently matches products based on features and specifications, not just keywords.

### Problem Statement

Online shoppers often struggle to:
- Find similar products with better prices
- Compare products across multiple platforms
- Understand product alternatives based on features
- Track purchase history and warranties

### Solution

SimilarLinks uses AI to understand product context and features, providing intelligent recommendations that go beyond simple keyword matching. It integrates with multiple e-commerce platforms to provide real-time price comparisons.

---

## ✨ Features

### 1. Multi-Modal Product Search
- **URL-based**: Paste Amazon/Flipkart product links
- **Text Search**: Type product names directly
- **Image Search**: Take a photo - AI identifies the product using Gemini Vision
- **Invoice Upload**: Extract product details from purchase receipts

### 2. AI-Powered Recommendations
- Finds 3-6 similar product alternatives
- Intelligent category matching using Gemini 2.5 Flash
- Feature-based comparison
- "Why pick this?" explanations for each alternative

### 3. Multi-Platform Price Comparison
- Compare prices across Amazon, Flipkart, Meesho, Snapdeal, JioMart, Myntra, Ajio, Tata Cliq
- Direct product links where available
- Real-time price updates using ScraperAPI

### 4. Invoice Management
- Upload purchase receipts/invoices
- Automatic extraction using Gemini Vision API:
  - Product name and brand
  - Purchase date and price
  - Warranty period
  - Next service date

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              React Native Mobile App (Expo)                  │
│                    TypeScript + React                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Product      │  │Recommendation│  │Invoice       │     │
│  │ Input Screen │  │ Screen       │  │Details       │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                  │              │
│              ┌────────────▼────────────┐                     │
│              │   API Service Layer     │                     │
│              │   (api.ts)             │                     │
│              └────────────┬────────────┘                     │
└───────────────────────────┼──────────────────────────────────┘
                            │ HTTPS/REST API
                            │
┌───────────────────────────▼──────────────────────────────────┐
│         🚀 Google Cloud Run (FastAPI Backend)                │
│              +5 Points: Cloud Run Usage                      │
│                    Python 3.11+                              │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ 🤖 Gemini    │  │ ScraperAPI   │  │ 🔵 Firestore │     │
│  │ 2.5 Flash    │  │ Service      │  │ Database     │     │
│  │ +5 Points:   │  │              │  │ +2 Points:   │     │
│  │ Google AI    │  │              │  │ GCP Database │     │
│  │ (LLM+Vision) │  │              │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└──────────────────────────────────────────────────────────────┘
```

### Design Rationale

**Why Cloud Run?**
- Serverless architecture - no server management
- Auto-scaling based on traffic
- Pay-per-use pricing model
- Fast cold start times (~1-2 seconds)
- Built-in HTTPS and load balancing

**Why Firestore?**
- NoSQL database perfect for caching
- Real-time updates capability
- Serverless - scales automatically
- Low latency for reads
- Free tier: 1GB storage, 50K reads/day

**Why Gemini 2.5 Flash?**
- Fast inference times
- Cost-effective for production
- Supports both text and vision
- Excellent for structured output (JSON)
- Free tier: 15 requests/minute

---

## 🔧 Implementation Details

### Frontend Implementation

#### Technology Stack
- **React Native** with **Expo SDK 54**
- **TypeScript** for type safety
- **React Navigation** v6 for navigation
- **TanStack Query** for API state management
- **Expo Image Picker** for camera/gallery access
- **Expo Document Picker** for file uploads

#### Key Components

**1. ProductInputScreen (`src/screens/ProductInputScreen.tsx`)**
```typescript
// Handles multiple input methods:
- URL input with validation
- Text search input
- Image picker (camera/gallery)
- Document picker (for invoices)
- Share text parsing (from other apps)
```

**Implementation Highlights:**
- URL validation using regex patterns
- Base64 image encoding for backend
- Share text extraction (handles Amazon/Flipkart share links)
- Recent searches stored in AsyncStorage
- Error handling with user-friendly messages

**2. RecommendationScreen (`src/screens/RecommendationScreen.tsx`)**
```typescript
// Displays product alternatives:
- Scrollable list of ProductCard components
- Loading states with skeletons
- Error handling with retry
- Pull-to-refresh functionality
```

**3. ProductCard (`src/components/ProductCard.tsx`)**
```typescript
// Features:
- Image loading with fallback
- Price and rating display
- Specifications list
- "Why pick this?" explanation
- Multi-platform comparison links
- Direct product links
```

**Image Handling Implementation:**
```typescript
// Ensures absolute URLs for images
useEffect(() => {
  if (product.image_url && product.image_url.trim().length > 0) {
    let url = product.image_url.trim();
    
    // Convert relative URLs to absolute
    if (url.startsWith('//')) {
      url = 'https:' + url;
    } else if (url.startsWith('/')) {
      url = 'https://www.amazon.in' + url;
    }
    
    setImageUri(url);
  }
}, [product.image_url]);
```

**4. API Service (`src/services/api.ts`)**
```typescript
// Key Features:
- Automatic fallback to direct Gemini API if backend fails
- Timeout handling (150 seconds for scraping)
- Error handling with user-friendly messages
- Request/response logging
```

**Fallback Implementation:**
```typescript
export async function getRecommendations(url: string): Promise<RecommendationResponse> {
  try {
    // Try backend first (has real scraped data)
    const response = await fetchWithTimeout(`${BACKEND_URL}/recommend`, {...});
    
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    // Fallback to direct Gemini API
    console.log('Backend unavailable, falling back to direct Gemini...');
    return await getRecommendationsFromGemini(url);
  }
}
```

### Backend Implementation

#### Technology Stack
- **FastAPI** (Python 3.11+)
- **Google Gemini AI** (2.5 Flash)
- **ScraperAPI** for web scraping
- **Firestore** for caching
- **Cloud Logging** for monitoring

#### Key Modules

**1. Main Application (`backend/main.py`)**

**Endpoint: `/recommend`**
```python
@app.post("/recommend")
async def recommend_products(request: RecommendationRequest):
    """
    Main recommendation endpoint
    
    Flow:
    1. Check Firestore cache (if refresh=False)
    2. Scrape product page using ScraperAPI
    3. Extract product details (title, price, specs)
    4. Call Gemini AI for alternatives
    5. Scrape alternatives from Amazon/Flipkart
    6. Cache results in Firestore
    7. Return recommendations
    """
    
    # Cache check
    if not request.refresh:
        cached = get_cached_recommendation(request.url)
        if cached:
            return cached
    
    # Scrape product
    product_data = await scrape_product_page(request.url)
    
    # Get AI recommendations
    alternatives = await get_ai_recommendations(product_data)
    
    # Scrape alternatives
    scraped_alternatives = await scrape_alternatives(alternatives)
    
    # Cache results
    cache_recommendation(request.url, scraped_alternatives)
    
    return RecommendationResponse(...)
```

**Implementation Details:**
- **Caching Strategy**: Cache for 24 hours, keyed by product URL
- **Error Handling**: Returns 503 if < 2 valid alternatives found (triggers frontend fallback)
- **Logging**: All AI calls logged to Firestore and Cloud Logging
- **Timeout**: 300 seconds for Cloud Run (allows time for multiple scrapes)

**2. ScraperAPI Integration (`backend/scraper_api.py`)**

**Product Scraping:**
```python
async def scrape_product_scraperapi(url: str, source_site: str) -> Dict:
    """
    Scrapes product page using ScraperAPI
    
    Returns:
    - title, price, rating, specs, image_url
    """
    
    # Call ScraperAPI
    response = requests.get(
        SCRAPERAPI_ENDPOINT,
        params={'api_key': SCRAPERAPI_KEY, 'url': url}
    )
    
    # Parse HTML with BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Extract data using CSS selectors
    # Amazon: span.a-price-whole, #landingImage, etc.
    # Flipkart: div._30jeq3, img._396cs4, etc.
    
    return {
        'title': extracted_title,
        'price': extracted_price,
        'image_url': absolute_image_url,  # Ensured absolute URL
        'rating': extracted_rating,
        'specs': extracted_specs
    }
```

**Image URL Normalization:**
```python
# Ensure all image URLs are absolute
if img_url.startswith('//'):
    img_url = 'https:' + img_url
elif img_url.startswith('/'):
    img_url = 'https://www.amazon.in' + img_url
elif not img_url.startswith('http'):
    img_url = 'https://www.amazon.in' + img_url
```

**3. Gemini AI Integration (`backend/gemini_vision.py`)**

**Product Recommendations:**
```python
def get_product_alternatives(product_data: Dict) -> List[Dict]:
    """
    Uses Gemini 2.5 Flash to find alternatives
    
    Prompt Engineering:
    - Structured JSON output required
    - Category matching
    - Feature-based comparison
    - Price range consideration
    """
    
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    prompt = f"""
    Find 3-6 similar product alternatives for:
    Product: {product_data['title']}
    Brand: {product_data.get('brand', 'Unknown')}
    Price: {product_data.get('price', 'Unknown')}
    Specs: {product_data.get('specs', [])}
    
    Requirements:
    1. Match category and key features
    2. Similar or better specifications
    3. Price range: ±30% of original
    4. Return JSON array with: brand, model, title, why_pick, tradeoffs
    """
    
    response = model.generate_content(prompt)
    # Parse JSON from response
    alternatives = json.loads(extract_json(response.text))
    
    return alternatives
```

**Vision API for Image Recognition:**
```python
def identify_product_from_image_base64(image_base64: str) -> Dict:
    """
    Identifies product from image using Gemini Vision
    """
    
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    # Decode base64 image
    image_bytes = base64.b64decode(image_base64)
    image = Image.open(BytesIO(image_bytes))
    
    prompt = """
    Analyze this product image and identify:
    1. Product name/brand
    2. Model number (if visible)
    3. Key features/specifications
    
    Respond in JSON format:
    {
        "brand": "Brand Name",
        "product_name": "Product Name",
        "model": "Model Number",
        "specifications": ["spec1", "spec2"]
    }
    """
    
    response = model.generate_content([prompt, image])
    product_info = json.loads(extract_json(response.text))
    
    return product_info
```

**4. Firestore Integration (`backend/firestore_service.py`)**

**Caching Implementation:**
```python
def cache_recommendation(url: str, recommendations: Dict):
    """
    Cache recommendations in Firestore
    
    Structure:
    collection: 'recommendations'
    document_id: URL hash
    fields: url, alternatives, timestamp, expires_at
    """
    
    db = firestore.Client(project=GCP_PROJECT_ID)
    
    doc_ref = db.collection('recommendations').document(hash_url(url))
    doc_ref.set({
        'url': url,
        'alternatives': recommendations['alternatives'],
        'timestamp': datetime.utcnow(),
        'expires_at': datetime.utcnow() + timedelta(hours=24)
    })
```

**AI Usage Logging:**
```python
def log_ai_usage(endpoint: str, model: str, tokens_used: int):
    """
    Log AI API usage for tracking
    
    Structure:
    collection: 'ai_usage_logs'
    fields: endpoint, model, tokens, timestamp
    """
    
    db = firestore.Client(project=GCP_PROJECT_ID)
    
    db.collection('ai_usage_logs').add({
        'endpoint': endpoint,
        'model': model,
        'tokens_used': tokens_used,
        'timestamp': datetime.utcnow()
    })
```

**5. Multi-Platform Search (`backend/multi_platform_search.py`)**

```python
async def get_multi_platform_links(product_name: str, brand: str) -> List[Dict]:
    """
    Search product across multiple platforms
    
    Implementation:
    1. Use ScraperAPI for Amazon and Flipkart (real prices)
    2. Generate search URLs for other platforms
    3. Return platform links with prices where available
    """
    
    sellers = []
    
    # Search Amazon and Flipkart via ScraperAPI
    amazon_result = await search_product_scraperapi(f"{brand} {product_name}", "amazon")
    flipkart_result = await search_product_scraperapi(f"{brand} {product_name}", "flipkart")
    
    # Add other platforms with search URLs
    other_platforms = [
        ("Meesho", "https://www.meesho.com/search?q="),
        ("Snapdeal", "https://www.snapdeal.com/search?keyword="),
        # ... more platforms
    ]
    
    return sellers
```

### Google Cloud Platform Integration

#### Cloud Run Deployment

**Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

**Deployment Configuration:**
- **Memory**: 2Gi (handles image processing)
- **CPU**: 2 vCPU (faster processing)
- **Timeout**: 300 seconds (allows time for scraping)
- **Max Instances**: 10 (auto-scaling)
- **Min Instances**: 0 (cost-effective)

**Environment Variables:**
```bash
GEMINI_API_KEY=your-key
SCRAPERAPI_KEY=your-key
GCP_PROJECT_ID=decision-recommendation-app
```

#### Firestore Setup

**Database Structure:**
```
recommendations/
  └── {url_hash}/
      ├── url: string
      ├── alternatives: array
      ├── timestamp: timestamp
      └── expires_at: timestamp

ai_usage_logs/
  └── {auto_id}/
      ├── endpoint: string
      ├── model: string
      ├── tokens_used: number
      └── timestamp: timestamp
```

**Indexes Created:**
- `timestamp` (descending) for recent logs
- `expires_at` for cache cleanup

#### Cloud Logging

**Implementation:**
```python
from google.cloud import logging as cloud_logging

def log_ai_call(endpoint: str, model: str, success: bool):
    client = cloud_logging.Client(project=GCP_PROJECT_ID)
    logger = client.logger('ai_api_calls')
    
    logger.log_struct({
        'endpoint': endpoint,
        'model': model,
        'success': success,
        'timestamp': datetime.utcnow().isoformat()
    })
```

---

## 📡 API Endpoints

### Base URL
- **Production**: `https://decision-recommendation-api-348821053890.us-central1.run.app`
- **Local**: `http://localhost:8000`

### Endpoints

#### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-11-21T06:58:49.739879"
}
```

#### `POST /recommend`
Get product alternatives.

**Request:**
```json
{
  "url": "https://www.amazon.in/dp/B0ABC123",
  "device": "android",
  "refresh": false,
  "share_text": "Product Name https://amzn.in/d/abc"
}
```

**Response:**
```json
{
  "source": "amazon",
  "canonical_url": "https://www.amazon.in/dp/B0ABC123",
  "query_time_iso": "2024-11-21T10:30:45.123Z",
  "alternatives": [
    {
      "id": "1",
      "brand": "Fire-Boltt",
      "title": "Fire-Boltt Ninja Call Pro Smartwatch",
      "image_url": "https://m.media-amazon.com/images/...",
      "price_estimate": "₹1,299",
      "rating_estimate": 4.2,
      "specs": ["1.69\" Display", "Bluetooth Calling"],
      "why_pick": "Similar features, better battery",
      "tradeoffs": "Slightly heavier",
      "source_url": "https://www.amazon.in/dp/...",
      "source_site": "amazon"
    }
  ],
  "meta": {
    "validation": {
      "llm_valid_json": true,
      "image_urls_checked": true
    }
  }
}
```

**Implementation Flow:**
1. Validate URL
2. Check Firestore cache
3. Scrape product page
4. Call Gemini for alternatives
5. Scrape each alternative
6. Validate and filter results
7. Cache in Firestore
8. Return response

#### `POST /identify-product`
Identify product from image.

**Request:**
```json
{
  "image_base64": "iVBORw0KGgoAAAANSUhEUgAA..."
}
```

**Response:**
```json
{
  "success": true,
  "product": {
    "brand": "Samsung",
    "product_name": "Galaxy Buds 2 Pro",
    "model": "SM-R510"
  }
}
```

**Implementation:**
- Uses Gemini Vision API
- Parses JSON response
- Handles errors gracefully

#### `POST /extract-invoice`
Extract invoice data from image.

**Request:**
```json
{
  "image_base64": "iVBORw0KGgoAAAANSUhEUgAA..."
}
```

**Response:**
```json
{
  "success": true,
  "invoice": {
    "product_name": "Realme Buds T300",
    "brand": "Realme",
    "store": "Amazon",
    "purchase_date": "15/10/2024",
    "price": "₹2,299",
    "warranty": "1 Year",
    "next_service_date": "15/10/2025"
  }
}
```

**Implementation:**
- Uses Gemini Vision API with specialized prompt
- Extracts structured data from invoice images
- Handles various invoice formats

#### `POST /multi-platform/search`
Search product across multiple platforms.

**Request:**
```json
{
  "product_name": "Realme Buds T300",
  "brand": "Realme",
  "current_platform": "amazon"
}
```

**Response:**
```json
{
  "sellers": [
    {
      "platform": "Flipkart",
      "url": "https://www.flipkart.com/...",
      "price": "₹2,199",
      "available": true,
      "icon": "🛒"
    }
  ],
  "total_found": 5
}
```

---

## 📁 Project Structure

```
similarlinks/
├── src/
│   ├── components/
│   │   ├── ProductCard.tsx          # Product display card
│   │   ├── ComparisonTable.tsx      # Price comparison table
│   │   ├── MultiSellerLinks.tsx     # Multi-platform links
│   │   ├── ErrorBoundary.tsx        # Error handling
│   │   ├── LoadingSkeleton.tsx      # Loading states
│   │   └── ErrorCard.tsx            # Error display
│   ├── screens/
│   │   ├── ProductInputScreen.tsx   # Main input screen
│   │   ├── RecommendationScreen.tsx # Results display
│   │   └── InvoiceDetailsScreen.tsx # Invoice details
│   ├── services/
│   │   ├── api.ts                   # Backend API client
│   │   └── geminiService.ts         # Direct Gemini fallback
│   ├── utils/
│   │   ├── storage.ts               # AsyncStorage helpers
│   │   └── urlValidator.ts          # URL validation
│   ├── navigation/
│   │   └── types.ts                 # Navigation types
│   └── types.ts                     # TypeScript types
├── backend/
│   ├── main.py                      # FastAPI application
│   ├── scraper_api.py               # ScraperAPI integration
│   ├── gemini_vision.py             # Gemini AI integration
│   ├── firestore_service.py         # Firestore operations
│   ├── cloud_logging_service.py     # Cloud Logging
│   ├── multi_platform_search.py     # Multi-platform search
│   ├── requirements.txt             # Python dependencies
│   ├── Dockerfile                   # Container definition
│   └── .gcloudignore                # Deployment exclusions
├── assets/                          # App icons and images
├── App.tsx                           # Root component
├── app.json                          # Expo configuration
├── package.json                      # Node dependencies
├── tsconfig.json                     # TypeScript config
├── babel.config.js                   # Babel config
└── .env                              # Frontend environment variables
```

---

## 🚀 Deployment

### Prerequisites
1. Google Cloud Project created
2. APIs enabled: Cloud Run, Firestore, Cloud Logging
3. Firestore database created (Native mode)
4. Service account with required permissions

### Deploy Backend

**From Cloud Shell:**
```bash
cd backend
gcloud run deploy decision-recommendation-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your-key,SCRAPERAPI_KEY=your-key,GCP_PROJECT_ID=your-project-id \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300
```

**From Local Windows:**
```cmd
cd backend
DEPLOY.bat
```

### Update Frontend

After deployment, update `src/services/api.ts`:
```typescript
export const BACKEND_URL = 'https://your-cloud-run-url.run.app';
```

---

## 📊 GCP Usage & Points

### Cloud Run (+5 Points)
- **Service**: `decision-recommendation-api`
- **Region**: `us-central1`
- **URL**: `https://decision-recommendation-api-348821053890.us-central1.run.app`
- **Configuration**: 2Gi memory, 2 vCPU, 300s timeout
- **Usage**: Handles all API requests, auto-scales based on traffic

### Firestore (+2 Points)
- **Database**: Native mode, `us-central1` region
- **Collections**: 
  - `recommendations` - Cached product recommendations
  - `ai_usage_logs` - AI API usage tracking
- **Usage**: Caching reduces API calls, improves performance

### Gemini AI (+5 Points)
- **Model**: Gemini 2.5 Flash
- **Usage**: 
  - Product recommendations (text generation)
  - Image recognition (vision API)
  - Invoice extraction (vision API)
- **Logging**: All API calls logged to Firestore and Cloud Logging

**Total GCP Points: 12 points**

---

## 🔧 Configuration

### Environment Variables

**Frontend (`.env`):**
```env
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
EXPO_PUBLIC_GEMINI_API_KEY_BACKUP=backup-key
```

**Backend (`backend/.env`):**
```env
GEMINI_API_KEY=your-gemini-api-key
GEMINI_API_KEY_BACKUP=backup-key
SCRAPERAPI_KEY=your-scraperapi-key
GCP_PROJECT_ID=decision-recommendation-app
GCP_REGION=us-central1
```

### Cloud Run Environment Variables

Set via `gcloud`:
```bash
gcloud run services update decision-recommendation-api \
  --region us-central1 \
  --update-env-vars GEMINI_API_KEY=key,SCRAPERAPI_KEY=key,GCP_PROJECT_ID=project-id
```

---

## 🧪 Testing

### Test Health Endpoint
```bash
curl https://decision-recommendation-api-348821053890.us-central1.run.app/health
```

### Test Product Recommendation
```bash
curl -X POST https://decision-recommendation-api-348821053890.us-central1.run.app/recommend \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.amazon.in/dp/B0ABC123","device":"android"}'
```

### Test Image Identification
```bash
curl -X POST https://decision-recommendation-api-348821053890.us-central1.run.app/identify-product \
  -H "Content-Type: application/json" \
  -d '{"image_base64":"base64-encoded-image"}'
```

---

## 🐛 Troubleshooting

### Images Not Loading
- **Issue**: Product images show fallback instead of actual images
- **Solution**: 
  - Check image URLs are absolute (start with `https://`)
  - Verify ScraperAPI returns valid image URLs
  - Check browser console for CORS errors
  - See `FIX_IMAGES.md` for detailed steps

### API Key Errors
- **Issue**: "API key was reported as leaked" or "API key not found"
- **Solution**:
  - Get new API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
  - Update `.env` files
  - Update Cloud Run environment variables
  - Restart Expo
  - See `FIX_GEMINI_API_KEY.md` for help

### Backend Connection Issues
- **Issue**: Frontend can't connect to backend
- **Solution**:
  - Verify Cloud Run service is running
  - Check `BACKEND_URL` in `src/services/api.ts`
  - View logs: `gcloud run services logs read decision-recommendation-api --region us-central1`
  - Use tunnel mode: `npx expo start --tunnel`

---

## 📈 Performance Metrics

- **Average Response Time**: 8-12 seconds end-to-end
- **Image Recognition**: 2-3 seconds
- **Invoice Extraction**: 3-5 seconds
- **Cache Hit Rate**: ~60% (reduces API calls)
- **Fallback Mode**: Works even if backend unavailable

---

## 🔮 Future Enhancements

- Price drop alerts
- User accounts and favorites
- Historical price tracking
- Social sharing of comparisons
- Voice search integration
- Web version of the app
- Push notifications for price drops

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Google Cloud Platform** for serverless infrastructure
- **Google Gemini AI** for powerful AI capabilities
- **ScraperAPI** for reliable web scraping
- **Expo** for React Native development experience

---

## 📞 Support & Resources

- **GitHub Repository**: https://github.com/mailidpwd/similarlinks
- **Cloud Run URL**: https://decision-recommendation-api-348821053890.us-central1.run.app
- **GCP Console**: https://console.cloud.google.com/home/dashboard?project=decision-recommendation-app
- **Documentation**: 
  - [GCP Setup Guide](./GCP_SETUP_GUIDE.md)
  - [Setup Summary](./SETUP_SUMMARY.md)
  - [API Testing Guide](./TEST_API.md)

---

**Made with ❤️ using Google Cloud Platform and Gemini AI**

*"Making online shopping smarter, one recommendation at a time."*

