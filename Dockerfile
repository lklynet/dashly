FROM python:3.9-slim
WORKDIR /app
RUN apt-get update && apt-get install -y \
    sqlite3 \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
COPY . /app
RUN mkdir -p /app/data
RUN pip install --no-cache-dir -r /app/requirements.txt
EXPOSE 8080
CMD ["waitress-serve", "--host=0.0.0.0", "--port=8080", "server:app"]