// refreshDomains.js

document.addEventListener("DOMContentLoaded", () => {
  fetchDomainsOnRefresh(); // Fetch and render domains on page load
});

async function fetchDomainsOnRefresh() {
  try {
    const response = await fetch("/domains");
    const data = await response.json();

    // Ensure there is a default group to add new domains to
    const defaultGroup = Object.keys(groups)[0] || "New Services";
    if (!groups[defaultGroup]) {
      groups[defaultGroup] = [];
    }

    // Detect and process new domains
    data.domains.forEach((domain) => {
      // Check if the domain is already in allDomains
      const isExisting = allDomains.some((d) => d.id === domain.id);
      if (!isExisting) {
        allDomains.push(domain); // Add to global domain list
        groups[defaultGroup].push(domain.id); // Add to the default group
      }
    });

    saveSetting("groups", groups); // Persist the updated groups
    renderDashboard(); // Re-render the dashboard with the new data
  } catch (error) {
    console.error("Error fetching domains on refresh:", error);
  }
}

function determineGroupForDomain(domain) {
  // Default logic for group assignment based on domain status
  return domain.enabled ? "Active Domains" : "Inactive Domains";
}
