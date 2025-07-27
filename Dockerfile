FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY backend/ .

# Expose the port
EXPOSE $PORT

# Start the application
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
