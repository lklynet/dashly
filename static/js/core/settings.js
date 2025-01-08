let currentSettings = {};

async function fetchSettings() {
  try {
    const response = await fetch("/settings");
    if (!response.ok) throw new Error("Failed to fetch settings.");
    currentSettings = await response.json();
    return currentSettings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {};
  }
}

function applySettings(updatedKeys = Object.keys(currentSettings)) {
  updatedKeys.forEach((key) => {
    const value = currentSettings[key];

    switch (key) {
      case "theme":
        document.body.className = value !== "light" ? value : "";
        document.getElementById("theme-toggle").textContent =
          value[0].toUpperCase() + value.slice(1);
        break;

      case "layoutView":
        const dashboard = document.getElementById("dashboard");
        dashboard.classList.toggle("grid-view", value === "grid");
        dashboard.classList.toggle("list-view", value === "list");
        break;

      case "groups":
        groups = value || { "New Services": [] };
        renderDashboard();
        break;

      case "maxColumns":
        maxColumns = value || 3;
        updateGridTemplate(Object.keys(groups).length);
        break;

      case "hideSearch":
        const searchBar = document.getElementById("search");
        searchBar.classList.toggle("hidden", value);
        document.getElementById("toggle-search").textContent = value
          ? "Show Search Bar"
          : "Hide Search Bar";
        break;

      case "hideInactive":
        showInactive = !value;
        document.getElementById("toggle-inactive").textContent = showInactive
          ? "Hide Inactive Domains"
          : "Show Inactive Domains";
        break;

      case "sortBy":
        currentSettings.sortBy = value || "domain";
        const sortButton = document.getElementById("sort-toggle");
        if (sortButton) {
          sortButton.textContent = `Sort: ${formatSortOption(currentSettings.sortBy)}`;
        }
        sortDomains(currentSettings.sortBy);
        break;

      case "allDomains":
        allDomains = value || [];
        break;

      case "renamedGroupNames":
        renamedGroupNames = value || {};
        break;

      default:
        console.warn(`Unhandled setting key: "${key}"`);
    }
  });
}

async function saveSettingsToJson(updates = {}) {
  try {
    Object.assign(currentSettings, updates);

    const response = await fetch("/save-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentSettings),
    });

    if (!response.ok) {
      console.error("Failed to save settings:", await response.text());
    }
  } catch (error) {
    console.error("Error saving settings:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    currentSettings = await fetchSettings();
    applySettings();
  } catch (error) {
    console.error("Initialization failed:", error);
  }
});