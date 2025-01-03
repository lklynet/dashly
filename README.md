<p align="center">
  <img src="/static/assets/dashly.svg" alt="Dashly Logo" height="150">
</p>
<h1 align="center">Dashly</h1>

Dashly is a dynamic dashboard designed for Nginx Proxy Manager users, enabling automatic updates to homelab dashboards based on domain configurations. It eliminates the need for manually editing YAML files or forgetting to add new services, providing a seamless and intuitive experience.

## Features

- **Dynamic Updates**: Automatically syncs with your Nginx Proxy Manager database.
- **Interactive UI**: Drag-and-drop functionality, customizable themes, and grid/list layouts.
- **Groups and Sorting**: Organize services into groups, sort by domain name, status, or IP address.
- **Search and Filter**: Quickly find services with an integrated search bar.
- **Customizable Appearance**: Toggle themes, layouts, and visibility of inactive domains.

## Screenshots

<p align="center">
  <img src="/assets/screenshot1.png" alt="Dashly Screenshot 1" width="200">
</p>
<p align="center">
  <img src="/assets/screenshot2.png" alt="Dashly Screenshot 2" width="200">
</p>
<p align="center">
  <img src="/assets/screenshot3.png" alt="Dashly Screenshot 3" width="200">
</p>
<p align="center">
  <img src="/assets/screenshot4.png" alt="Dashly Screenshot 4" width="200">
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

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/lklynet/dashly.git
   cd dashly
   ```

2. Create a `.env` file with the following variables:

   ```env
   NGINX_DB_PATH=/path/to/nginx-proxy-manager/database.sqlite
   USER_SETTINGS=/path/to/preferred/app/data
   ```

3. Start the application using Docker Compose:

   ```bash
   docker compose up -d
   ```

4. Access the dashboard at [http://localhost:8080](http://localhost:8080).

## Contributing

Dashly is an open-source project, and contributions are welcome! If you're interested in collaborating, here are some ways you can help:

- Submit pull requests to add features or fix bugs.
- Message on X (Twitter) at [@lklynet](https://twitter.com/lklynet).
- Email at [hi@lkly.net](mailto:hi@lkly.net).

## Roadmap for Dashly.lkly.net

The app will soon be hosted at [dashly.lkly.net](https://dashly.lkly.net), featuring:

- Screenshots and demos.
- Comprehensive installation instructions.
- A blog for updates and changes.
- Full documentation for users and contributors.

## Contact

For feedback, questions, or collaboration opportunities:

- X (Twitter): [@lklynet](https://twitter.com/lklynet)
- Email: [hi@lkly.net](mailto:hi@lkly.net)

Thank you for checking out Dashly! Let's make it the best it can be together.
