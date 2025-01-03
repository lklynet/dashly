# Use an official Python image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Install sqlite3 and system dependencies
RUN apt-get update && \
    apt-get install -y sqlite3 libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy application files
COPY . /app

# Install Python dependencies
RUN pip3 install -r requirements.txt

# Expose the application port
EXPOSE 8080

# Command to run the application
CMD ["python3", "server.py"]
