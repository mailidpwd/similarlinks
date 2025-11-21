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
