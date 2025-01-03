# Use a lightweight Python 3 image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Install SQLite3 (required for database functionality) and Python dependencies
RUN apt-get update && apt-get install -y sqlite3 && rm -rf /var/lib/apt/lists/*

# Create the empty /app/data directory
RUN mkdir -p /app/data

# Copy necessary files to the container
COPY server.py /app/
COPY requirements.txt /app/
COPY static /app/static/

# Install Python dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Expose the app's port
EXPOSE 8080

# Command to run the application
CMD ["python3", "server.py"]