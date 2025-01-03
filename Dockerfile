# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container
COPY . /app

# Install Python dependencies
RUN pip3 install flask

# Expose the port your app runs on
EXPOSE 8080

# Command to run the application
CMD ["python3", "app.py"]
