# Use the official Python 3 slim image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy application code and dependencies
COPY server.py /app/
COPY requirements.txt /app/
COPY static /app/static/
COPY data /app/data/

# Install Python dependencies
RUN python3 -m pip install --no-cache-dir -r /app/requirements.txt

# Expose the application port
EXPOSE 8080

# Run the application
CMD ["python3", "/app/server.py"]
