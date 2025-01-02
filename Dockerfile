# Use a lightweight Python 3 image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy necessary files to the container
COPY server.py /app/
COPY requirements.txt /app/
COPY static /app/static/
COPY data /app/data/

# Install Python dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Expose the app's port
EXPOSE 8080

# Command to run the application
CMD ["python", "server.py"]
