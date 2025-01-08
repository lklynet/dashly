function toggleSortCriteria() {
  const sortOptions = ["domain", "status", "ip"];
  const currentIndex = sortOptions.indexOf(currentSettings.sortBy || "domain");
  const newSortCriteria = sortOptions[(currentIndex + 1) % sortOptions.length];

  updateSortButton(newSortCriteria);
  sortDomains(newSortCriteria);
  renderDashboard();
  saveSettingsToJson({ sortBy: newSortCriteria });
}

function updateSortButton(criteria) {
  const sortButton = document.getElementById("sort-toggle");
  sortButton.textContent = `Sort: ${formatSortOption(criteria)}`;
}

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

async function saveSettingsToJson() {
  try {
    await fetch("/save-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentSettings),
    });
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const settingsResponse = await fetch("/settings");
    if (!settingsResponse.ok) throw new Error("Failed to fetch settings");

    currentSettings = await settingsResponse.json();
    currentSortCriteria = currentSettings.sortBy || "domain";

    const sortButton = document.getElementById("sort-toggle");
    sortButton.textContent = `Sort: ${formatSortOption(currentSortCriteria)}`;

    sortDomains(currentSortCriteria);
    renderDashboard();
  } catch (error) {
    console.error("Error loading sort settings:", error);
  }
});

document.getElementById("sort-toggle").addEventListener("click", toggleSortCriteria);

async function updateSortSetting(criteria) {
  try {
    const updatedSettings = { sortBy: criteria };

    await fetch("/save-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedSettings),
    });
  } catch (error) {
    console.error("Error updating sort settings:", error);
  }
}

function sortDomains(criteria) {
  if (!groups || typeof groups !== "object") {
    console.warn("Groups is not defined or not an object.");
    return;
  }
  Object.keys(groups).forEach((groupName) => {
    groups[groupName].sort((a, b) => {
      const domA = allDomains.find((d) => d.id === a);
      const domB = allDomains.find((d) => d.id === b);

      if (!domA || !domB) return 0;

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

function getStatusRank(domain) {
  if (domain.nginx_online && domain.enabled) return 0;
  if (!domain.nginx_online && domain.enabled) return 1;
  return 2;
}