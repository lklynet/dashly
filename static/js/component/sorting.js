let currentSortCriteria = "domain"; // Default sort option

// Function to toggle between sort options
function toggleSortCriteria() {
  const sortOptions = ["domain", "status", "ip"];
  const currentIndex = sortOptions.indexOf(currentSortCriteria);

  // Cycle to the next option
  currentSortCriteria = sortOptions[(currentIndex + 1) % sortOptions.length];

  // Update the button text
  const sortButton = document.getElementById("sort-toggle");
  sortButton.textContent = `Sort: ${formatSortOption(currentSortCriteria)}`;

  // Save the selected sort option persistently
  saveSetting("sortBy", currentSortCriteria);

  // Apply the new sorting criteria
  sortDomains(currentSortCriteria); // Sort the services
  renderDashboard(); // Re-render the dashboard with the updated sorting
  setupDragAndDrop(); // Ensure drag-and-drop remains functional
}

// Function to format the sort option for button display
function formatSortOption(option) {
  switch (option) {
    case "domain":
      return "Domain Name";
    case "status":
      return "Status";
    case "ip":
      return "IP Address";
    default:
      return option;
  }
}

// Apply the saved sort option on page load
document.addEventListener("DOMContentLoaded", async () => {
  const settings = await fetchSettings(); // Fetch settings from the backend
  currentSortCriteria = settings.sortBy || "domain"; // Load saved option or default to domain

  // Update the sort button text
  const sortButton = document.getElementById("sort-toggle");
  sortButton.textContent = `Sort: ${formatSortOption(currentSortCriteria)}`;

  // Apply the saved sort criteria to the dashboard
  sortDomains(currentSortCriteria);
  renderDashboard();
});

// Set up the event listener for the sort button
document.getElementById("sort-toggle").addEventListener("click", () => {
  toggleSortCriteria();
});

function sortDomains(criteria) {
  // Sort services within each group
  Object.keys(groups).forEach((groupName) => {
    groups[groupName].sort((a, b) => {
      const domA = allDomains.find((d) => d.id === a);
      const domB = allDomains.find((d) => d.id === b);

      switch (criteria) {
        case "domain":
          return domA.domain_names[0].localeCompare(domB.domain_names[0]);
        case "status":
          return getStatusRank(domA) - getStatusRank(domB);
        case "ip":
          return domA.forward_host.localeCompare(domB.forward_host);
        default:
          return 0;
      }
    });
  });
}

// Helper function to rank statuses (if needed)
function getStatusRank(domain) {
  // Example rank: online = 0, partial = 1, offline = 2
  if (domain.nginx_online && domain.enabled) return 0; // online
  if (!domain.nginx_online && domain.enabled) return 1; // partial
  return 2; // offline
}
