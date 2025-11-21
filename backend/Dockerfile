FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for Playwright
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright browsers
RUN playwright install chromium
RUN playwright install-deps chromium

# Copy application code
COPY . .

# Expose port (Cloud Run sets PORT env var, default to 8080)
EXPOSE 8080

# Run the application - use PORT env var from Cloud Run (defaults to 8080)
CMD sh -c "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"

