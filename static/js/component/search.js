// Search and Toggle Search Functionality

// Initialize search visibility
let searchBarVisible = localStorage.getItem("hideSearch")
  ? !JSON.parse(localStorage.getItem("hideSearch")) // Stored "hideSearch" means hidden
  : true; // Default to visible

const searchBar = document.getElementById("search");
const toggleSearchButton = document.getElementById("toggle-search");

// Function to toggle search bar visibility
function toggleSearchVisibility() {
  searchBarVisible = !searchBarVisible;
  searchBar.classList.toggle("hidden", !searchBarVisible); // Hide or show the search bar
  toggleSearchButton.textContent = searchBarVisible
    ? "Hide Search Bar"
    : "Show Search Bar";

  // Save the toggle state
  saveSetting("hideSearch", !searchBarVisible);
}

// Apply initial visibility state on page load
document.addEventListener("DOMContentLoaded", async () => {
  const settings = await fetchSettings(); // Fetch settings from usersettings.js
  searchBarVisible =
    settings.hideSearch !== undefined
      ? !settings.hideSearch // Invert as "hideSearch" means hidden
      : searchBarVisible; // Default to visible if not set
  searchBar.classList.toggle("hidden", !searchBarVisible); // Apply initial state
  toggleSearchButton.textContent = searchBarVisible
    ? "Hide Search Bar"
    : "Show Search Bar";
});

// Event listener for toggling search bar visibility
toggleSearchButton.addEventListener("click", () => {
  toggleSearchVisibility();
});

// Search Functionality
document.getElementById("search").addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase();

  // Backup the original groups to restore after rendering
  const previousGroups = { ...groups };

  // Create new groups with filtered domains based on the query
  const filteredGroups = {};
  let hasResults = false;

  Object.keys(groups).forEach((groupName) => {
    const filteredDomains = groups[groupName]
      .map((domainId) => allDomains.find((domain) => domain.id === domainId))
      .filter((domain) => {
        if (!domain) return false;

        // Search by domain name
        const matchesDomainName = domain.domain_names.some((name) =>
          name.toLowerCase().includes(query)
        );

        // Search by IP (host:port)
        const hostPort = `${domain.forward_host}:${domain.forward_port}`;
        const matchesIP = hostPort.toLowerCase().includes(query);

        // Search by status (online/offline)
        const status =
          domain.nginx_online && domain.enabled ? "online" : "offline";
        const matchesStatus = status.includes(query);

        // Return true if any criteria match
        return matchesDomainName || matchesIP || matchesStatus;
      });

    if (filteredDomains.length > 0) {
      filteredGroups[groupName] = filteredDomains.map((domain) => domain.id);
      hasResults = true;
    }
  });

  // If no results found, show a "No domains found" message
  if (!hasResults) {
    document.getElementById("dashboard").innerHTML = "<p>No domains found.</p>";
  } else {
    // Replace the groups with filtered groups for rendering
    groups = filteredGroups;
    renderDashboard();
  }

  // Restore the original groups after rendering
  groups = previousGroups;

  // Add debounce to improve performance
  let debounceTimeout;
  document.getElementById("search").addEventListener("input", (event) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      // Filter and render logic here
    }, 300); // Adjust delay as needed
  });
});
