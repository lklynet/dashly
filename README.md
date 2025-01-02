
# Dashly

Dashly is a lightweight dashboard application for Nginx Proxy Manager users. It provides a user-friendly interface with customizable settings and persistent storage, all packaged in an easy-to-deploy Docker container.

---

## Features

- **User-Friendly Dashboard**: View your Nginx services effortlessly.
- **Customizable Settings**: Change settings and persist them across sessions.
- **Dockerized**: Simplifies deployment and portability.
- **Volume Support**: Store user settings and database configurations in customizable locations.
- **Minimal Configuration**: Works out-of-the-box with a simple `docker-compose` setup.

---

## Quick Start

### Using Docker Compose

1. Clone the repository:
   ```bash
   git clone https://github.com/lklynet/dashly.git
   cd dashly
   ```

2. Customize the `docker-compose.yml` file (if necessary):
   - Default settings save user data in `./data` and require the path to your Nginx database.

3. Start the app:
   ```bash
   docker-compose up -d
   ```

4. Access the app in your browser at [http://localhost:8080](http://localhost:8080).

---

### Running with `docker run`

If you prefer not to use Docker Compose:

```bash
docker run -d \
  -p 8080:8080 \
  -v $(pwd)/data:/app/user_settings.db \
  -v /path/to/your/nginx/database.sqlite:/app/database.sqlite:ro \
  --name dashly \
  --restart unless-stopped \
  lklynet/dashly:latest
```

---

## Configuration

### Volumes

- **User Settings**: Stored by default in `./data/user_settings.db`.
- **Nginx Database**: Bind-mount the path to your existing Nginx database in `docker-compose.yml` or as a volume in `docker run`.

### Ports

- The app runs on port `8080` inside the container and is mapped to `8080` on the host.

---

## Customization

### Adjust Volume Paths

To use custom paths for data:

1. Edit the `docker-compose.yml` file:
   ```yaml
   volumes:
     - /custom/data/path:/app/user_settings.db
     - /custom/nginx/database/path:/app/database.sqlite:ro
   ```

2. Restart the container:
   ```bash
   docker-compose down && docker-compose up -d
   ```

---

## Development

### Building the Image Locally

1. Clone the repository and navigate to the project directory.
   ```bash
   git clone https://github.com/lklynet/dashly.git
   cd dashly
   ```

2. Build the Docker image:
   ```bash
   docker build -t lklynet/dashly:latest .
   ```

3. Run the container:
   ```bash
   docker run -d -p 8080:8080 -v $(pwd)/data:/app/user_settings.db -v /path/to/nginx/database.sqlite:/app/database.sqlite:ro lklynet/dashly:latest
   ```

---

## Contribution Guidelines

We welcome contributions! Here's how you can help:

1. Fork the repository on GitHub.
2. Create a feature branch:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit your changes and push the branch:
   ```bash
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```
4. Submit a pull request.

---

## License

Dashly is licensed under the MIT License. See the `LICENSE` file for details.

---

## Support

If you encounter any issues or have questions, feel free to open an issue in the [GitHub repository](https://github.com/lklynet/dashly/issues).

---

## Acknowledgments

Thank you for using Dashly! We hope it simplifies your Nginx service management. Contributions and feedback are always welcome!
