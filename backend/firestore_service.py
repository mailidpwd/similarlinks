"""
Firestore Service for caching recommendations and tracking usage
This helps meet GCP Database Usage requirements
"""

import os
import hashlib
import json
from typing import Optional, Dict, Any
from datetime import datetime

try:
    from google.cloud import firestore
    from google.cloud.firestore import SERVER_TIMESTAMP
    FIRESTORE_AVAILABLE = True
except ImportError:
    FIRESTORE_AVAILABLE = False
    SERVER_TIMESTAMP = None
    print("⚠️  google-cloud-firestore not installed. Firestore caching disabled.")

# Initialize Firestore client (only if project ID is set)
db = None
project_id = os.getenv("GCP_PROJECT_ID")

if FIRESTORE_AVAILABLE and project_id:
    try:
        db = firestore.Client(project=project_id)
        print(f"✅ Firestore initialized for project: {project_id}")
    except Exception as e:
        print(f"⚠️  Failed to initialize Firestore: {e}")
        db = None
elif not project_id:
    print("⚠️  GCP_PROJECT_ID not set. Firestore caching disabled.")


def hash_url(url: str) -> str:
    """Create a hash of the URL for use as document ID"""
    return hashlib.md5(url.encode()).hexdigest()


async def get_cached_recommendation(url: str) -> Optional[Dict[str, Any]]:
    """
    Get cached recommendation from Firestore
    Returns None if not found or Firestore is not available
    """
    if not db:
        return None
    
    try:
        doc_ref = db.collection('recommendations').document(hash_url(url))
        doc = doc_ref.get()
        
        if doc.exists:
            data = doc.to_dict()
            # Check if cache is still valid (24 hours)
            if data and 'timestamp' in data:
                cache_age = (datetime.now() - data['timestamp']).total_seconds()
                if cache_age < 86400:  # 24 hours
                    print(f"✅ Found cached recommendation in Firestore (age: {cache_age/3600:.1f}h)")
                    return data.get('data')
                else:
                    print(f"⚠️  Cached recommendation expired (age: {cache_age/3600:.1f}h)")
            return data.get('data') if data else None
    except Exception as e:
        print(f"⚠️  Error reading from Firestore: {e}")
        return None
    
    return None


async def cache_recommendation(url: str, data: Dict[str, Any]) -> bool:
    """
    Cache recommendation in Firestore
    Returns True if successful, False otherwise
    """
    if not db:
        return False
    
    try:
        doc_ref = db.collection('recommendations').document(hash_url(url))
        doc_ref.set({
            'url': url,
            'data': data,
            'timestamp': SERVER_TIMESTAMP if SERVER_TIMESTAMP else datetime.now(),
            'cached_at': datetime.now().isoformat()
        })
        print(f"✅ Cached recommendation in Firestore")
        return True
    except Exception as e:
        print(f"⚠️  Error writing to Firestore: {e}")
        return False


async def log_ai_usage(
    model: str,
    endpoint: str,
    tokens_estimated: int = 0,
    success: bool = True,
    error_message: Optional[str] = None
) -> bool:
    """
    Log AI usage to Firestore for tracking
    This helps meet Google's AI Usage requirements
    """
    if not db:
        return False
    
    try:
        usage_ref = db.collection('ai_usage_logs').document()
        usage_ref.set({
            'model': model,
            'endpoint': endpoint,
            'tokens_estimated': tokens_estimated,
            'success': success,
            'error_message': error_message,
            'timestamp': SERVER_TIMESTAMP if SERVER_TIMESTAMP else datetime.now(),
            'created_at': datetime.now().isoformat()
        })
        return True
    except Exception as e:
        print(f"⚠️  Error logging AI usage: {e}")
        return False

