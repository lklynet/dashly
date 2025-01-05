<p align="center">
  <img src="/static/assets/dashly.svg" alt="Dashly Logo" height="150">
</p>
<h1 align="center">Dashly</h1>

## What Dashly Is

**Dashly** is a lightweight, real-time dashboard for users of **Nginx Proxy Manager**. It simplifies how you monitor and organize your services by automatically syncing with your NPM database. This means you never have to manually edit dashboard configuration files like YAML—it dynamically tracks and displays all your services based on their domain configurations in NPM.

![2025-01-05](/static/assets/hero.png)

## Core Features

- **Dynamic Updates:**
  - **Dashly** reads from the **Nginx Proxy Manager database**, automatically updating your dashboard whenever you add, remove, or modify domains.
- **Interactive UI:**
  - Organize services with drag-and-drop groups.
  - Toggle between grid and list views.
  - Search and filter services for quick access.
- **Customizable Appearance:**
  - Multiple themes, including a light and dark mode.
  - Visibility toggles for inactive services.
- **Group Management:**
  - Categorize services into customizable groups.
  - Rename and sort groups for easier navigation.

## Why It's Useful

If you use **Nginx Proxy Manager**, you likely already have domain names set up for your services. **Dashly** takes that data and creates a clean, automatically updating dashboard. It eliminates the repetitive task of manually maintaining dashboard YAML files for tools like **Dashy** or **Homepage**. **Dashly** is tailored for **NPM** users who value automation and simplicity.

## Screenshots

<p align="center">
  <img src="/static/assets/screenshot1.png" alt="Dashly Screenshot 1" width="200">
  <img src="/static/assets/screenshot2.png" alt="Dashly Screenshot 2" width="200">
  <img src="/static/assets/screenshot3.png" alt="Dashly Screenshot 3" width="200">
  <img src="/static/assets/screenshot4.png" alt="Dashly Screenshot 4" width="200">
</p>

## Future Roadmap

- Add a "Favorites" group for quick access to preferred services.
- Enable hiding groups or individual services.
- Support for custom app icons and renaming services.
- Enhance drag-and-drop functionality for smoother interaction.
- Introduce collapsible groups for better organization.
- Toggle displayed information for a cleaner look.

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- Access to your Nginx Proxy Manager database.

### Deployment Steps

1. Create a new directory for Dashly and navigate into it:

   ```bash
   mkdir dashly
   cd dashly
   ```

2. Create the `.env` file with the required variables:

   ```bash
   echo "NGINX_DB_PATH=/path/to/your/nginx/database.sqlite" >> .env
   echo "USER_SETTINGS=/data/" >> .env
   ```

3. Download the `docker-compose.yml` file:

   ```bash
   wget https://raw.githubusercontent.com/lklynet/dashly/refs/heads/main/docker-compose.yml
   ```

4. Start the application using Docker Compose:

   ```bash
   docker compose up -d
   ```

   Alternatively, if you are using an older version of Docker Compose:

   ```bash
   docker-compose up -d
   ```

5. Access the dashboard at [http://localhost:8080](http://localhost:8080).

## Troubleshooting

If the app isn't running, has database errors, or doesn't show any services:

1. Double-Check:

   - `.env` variables are correct and point to your Nginx Proxy Manager `database.sqlite`.
   - User permissions are correct to read the database.
   - The directory is bind-mounted to the Docker host.

2. Install Dependencies:

   ```bash
   apt update && apt upgrade -y
   apt install python3 sqlite3
   pip3 install flask
   ```

   Then rebuild or update the container, and it should start right up.

## Contributing

Dashly is an open-source project, and contributions are welcome! If you're interested in collaborating, here are some ways you can help:

- Submit pull requests to add features or fix bugs.
- Message on X (Twitter) at [@lklynet](https://twitter.com/lklynet).
- Email at [hi@lkly.net](mailto:hi@lkly.net).

## Live Demo

Try Dashly at [demo.dashly.lkly.net](demo.dashly.lkly.net)

## Contact

For feedback, questions, or collaboration opportunities:

- X (Twitter): [@lklynet](https://twitter.com/lklynet)
- Email: [hi@lkly.net](mailto:hi@lkly.net)

Thank you for checking out Dashly! Let's make it the best it can be together.
