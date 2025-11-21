/**
 * API Service - Smart Mode with Auto-Fallback
 * 
 * 🚀 Tries backend first (real scraped data), falls back to direct Gemini (fast)
 * 
 * Backend must be running: py main.py (in backend/ folder)
 * Update BACKEND_URL if your IP changes
 */

import { Platform } from 'react-native';
import type { RecommendationResponse } from '../types';
import { getRecommendationsFromGemini } from './geminiService';

// Backend URL - Always use Cloud Run for mobile devices
// Local IP only works when device and computer are on same network
// For hackathon demo, always use Cloud Run to ensure it works everywhere
export const BACKEND_URL = 'https://decision-recommendation-api-348821053890.us-central1.run.app';
const BACKEND_TIMEOUT = 150000; // 150 seconds (allow time for 3-6 products + brand matching)

/**
 * Fetch with timeout helper
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = BACKEND_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - backend is taking too long');
    }
    throw error;
  }
}

/**
 * Get recommendations - Smart Mode: Backend first, Gemini fallback
 * 
 * 1. Try backend (real scraped data with ScraperAPI) - BEST QUALITY
 * 2. Fallback to direct Gemini if backend fails - FAST BACKUP
 */
export async function getRecommendations(
  url: string,
  refresh: boolean = false,
  shareText?: string
): Promise<RecommendationResponse> {
  // Try backend first (real scraped data)
  try {
    console.log('🚀 Trying backend first (real scraped data)...');
    if (shareText) {
      console.log('⚡ Sending share text - backend will skip scraping!');
    }
    
    const response = await fetchWithTimeout(`${BACKEND_URL}/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        device: Platform.OS === 'ios' ? 'ios' : 'android',
        refresh,
        share_text: shareText || null, // Send share text if available
      }),
    });

    if (response.ok) {
      try {
        const data = await response.json();
        
        // Validate response structure
        if (!data || !data.alternatives || !Array.isArray(data.alternatives)) {
          throw new Error('Invalid response structure from backend');
        }
        
        console.log('✅ Backend success:', data.alternatives.length, 'alternatives');
        return data;
      } catch (parseError) {
        console.error('❌ Failed to parse backend response:', parseError);
        throw new Error(`Backend returned invalid JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }
    } else {
      // Backend returned error (503, etc.) - trigger Gemini fallback
      let errorText = 'Unknown error';
      try {
        errorText = await response.text();
      } catch (e) {
        // Ignore text read errors
      }
      console.log('⚠️  Backend error:', response.status, errorText.substring(0, 200));
      // Throw error to trigger Gemini fallback
      throw new Error(`Backend error: ${response.status}`);
    }
  } catch (error) {
    // Any error (network, 503, timeout, etc.) triggers Gemini fallback
    console.log('⚠️  Backend unavailable, falling back to direct Gemini...');
    console.log('Backend error details:', error instanceof Error ? error.message : String(error));
    
    // Fallback to direct Gemini (this should work!)
    try {
      console.log('🤖 Using Gemini AI directly (fallback mode)...');
      const result = await getRecommendationsFromGemini(url);
      console.log('✅ Gemini fallback success:', result.alternatives.length, 'alternatives');
      return result;
    } catch (geminiError) {
      console.error('❌ Gemini fallback also failed:', geminiError);
      throw new Error(
        geminiError instanceof Error
          ? `Both backend and Gemini failed. Gemini error: ${geminiError.message}`
          : 'Failed to get recommendations from both backend and Gemini'
      );
    }
  }
}

/**
 * Refresh prices
 */
export async function refreshPrices(url: string): Promise<RecommendationResponse> {
  return getRecommendations(url, true);
}

/**
 * Health check - tries backend, always returns true (fallback available)
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/health`, {
      method: 'GET',
    }, 5000);
    return response.ok;
  } catch {
    // Backend not available, but we have Gemini fallback, so still "healthy"
    return true;
  }
}
