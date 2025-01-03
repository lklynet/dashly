# Use a lightweight Python base image
FROM python:3.9-slim

# Install SQLite
RUN apt-get update && apt-get install -y sqlite3 && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy application code and dependencies
COPY server.py /app/
COPY requirements.txt /app/
COPY static /app/static/
COPY data /app/data/

# Install Python dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Expose application port
EXPOSE 8080

# Run the application
CMD ["python", "/app/server.py"]
