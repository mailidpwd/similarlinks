"""
Cloud Logging Service for tracking AI usage and application logs
This helps meet Google's AI Usage requirements and provides better observability
"""

import os
import logging
from typing import Optional

try:
    from google.cloud import logging as cloud_logging
    CLOUD_LOGGING_AVAILABLE = True
except ImportError:
    CLOUD_LOGGING_AVAILABLE = False
    print("⚠️  google-cloud-logging not installed. Cloud Logging disabled.")

# Initialize Cloud Logging
cloud_logger = None
project_id = os.getenv("GCP_PROJECT_ID")

if CLOUD_LOGGING_AVAILABLE and project_id:
    try:
        client = cloud_logging.Client(project=project_id)
        client.setup_logging()
        cloud_logger = logging.getLogger('decision-recommendation-api')
        cloud_logger.setLevel(logging.INFO)
        print(f"✅ Cloud Logging initialized for project: {project_id}")
    except Exception as e:
        print(f"⚠️  Failed to initialize Cloud Logging: {e}")
        cloud_logger = None
elif not project_id:
    print("⚠️  GCP_PROJECT_ID not set. Cloud Logging disabled.")
    # Fallback to standard logging
    cloud_logger = logging.getLogger('decision-recommendation-api')
    cloud_logger.setLevel(logging.INFO)


def log_ai_call(
    model: str,
    endpoint: str,
    prompt_length: int = 0,
    response_length: int = 0,
    tokens_estimated: int = 0,
    duration_ms: float = 0,
    success: bool = True,
    error_message: Optional[str] = None
):
    """
    Log AI API call to Cloud Logging
    This helps track Google's AI Usage for requirements
    """
    if not cloud_logger:
        return
    
    log_data = {
        'service': 'gemini-ai',
        'model': model,
        'endpoint': endpoint,
        'prompt_length': prompt_length,
        'response_length': response_length,
        'tokens_estimated': tokens_estimated,
        'duration_ms': duration_ms,
        'success': success,
    }
    
    if error_message:
        log_data['error_message'] = error_message
    
    if success:
        cloud_logger.info(
            f"Gemini API call successful: {model} on {endpoint}",
            extra=log_data
        )
    else:
        cloud_logger.error(
            f"Gemini API call failed: {model} on {endpoint} - {error_message}",
            extra=log_data
        )


def log_firestore_operation(
    operation: str,
    collection: str,
    success: bool = True,
    error_message: Optional[str] = None
):
    """
    Log Firestore operations for tracking database usage
    """
    if not cloud_logger:
        return
    
    log_data = {
        'service': 'firestore',
        'operation': operation,
        'collection': collection,
        'success': success,
    }
    
    if error_message:
        log_data['error_message'] = error_message
    
    if success:
        cloud_logger.info(
            f"Firestore {operation} successful: {collection}",
            extra=log_data
        )
    else:
        cloud_logger.error(
            f"Firestore {operation} failed: {collection} - {error_message}",
            extra=log_data
        )


def log_cloud_run_request(
    endpoint: str,
    method: str,
    status_code: int,
    duration_ms: float = 0
):
    """
    Log Cloud Run request for tracking service usage
    """
    if not cloud_logger:
        return
    
    log_data = {
        'service': 'cloud-run',
        'endpoint': endpoint,
        'method': method,
        'status_code': status_code,
        'duration_ms': duration_ms,
    }
    
    cloud_logger.info(
        f"Cloud Run request: {method} {endpoint} - {status_code}",
        extra=log_data
    )


