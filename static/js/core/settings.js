// Centralize globally accessible settings and functions
let currentSettings = {}; // In-memory store for all settings

// Constants for setting keys
const SETTINGS_KEYS = {
  THEME: "theme",
  LAYOUT_VIEW: "layoutView",
  HIDE_SEARCH: "hideSearch",
  HIDE_INACTIVE: "hideInactive",
  GROUPS: "groups", // Added groups as a setting key
};

// Fetch settings from the server
async function fetchSettings() {
  try {
    const response = await fetch("/appsettings");
    if (response.ok) {
      const settings = await response.json();
      currentSettings = settings; // Store in memory
      Object.keys(settings).forEach((key) => {
        localStorage.setItem(key, JSON.stringify(settings[key])); // Cache in localStorage
      });
      console.log("Loaded settings:", settings);
      return settings;
    } else {
      console.error("Failed to fetch settings:", await response.text());
    }
  } catch (error) {
    console.error("Error fetching settings:", error);
  }
  return {};
}

// Save a specific setting to the server and localStorage
async function saveSetting(key, value) {
  try {
    currentSettings[key] = value; // Update in-memory settings
    localStorage.setItem(key, JSON.stringify(value)); // Update localStorage
    const response = await fetch("/appsettings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentSettings), // Send updated settings to server
    });
    if (response.ok) {
      console.log(`Setting saved: ${key} = ${value}`);
    } else {
      console.error("Failed to save setting:", await response.text());
    }
  } catch (error) {
    console.error("Error saving setting:", error);
  }
}

// Save groups to the backend (utility function for convenience)
async function saveGroups(groups) {
  await saveSetting(SETTINGS_KEYS.GROUPS, groups);
}

// Apply all settings to the UI
function applySettings() {
  Object.keys(currentSettings).forEach((key) => {
    const value = currentSettings[key];

    // Handle theme
    if (key === SETTINGS_KEYS.THEME) {
      document.body.className = ""; // Clear classes
      if (value !== "light") {
        document.body.classList.add(value);
      }
      const themeButton = document.getElementById("theme-toggle");
      if (themeButton) {
        themeButton.textContent = value[0].toUpperCase() + value.slice(1);
      }
    }

    // Handle layout
    if (key === SETTINGS_KEYS.LAYOUT_VIEW) {
      const dashboard = document.getElementById("dashboard");
      if (value === "grid") {
        dashboard.classList.add("grid-view");
        dashboard.classList.remove("list-view");
      } else {
        dashboard.classList.add("list-view");
        dashboard.classList.remove("grid-view");
      }
    }

    // Handle groups
    if (key === SETTINGS_KEYS.GROUPS) {
      groups = value || {}; // Set groups or default
      renderDashboard(); // Re-render with loaded groups
    }

    // Add additional settings logic as needed...
  });

  console.log("Applied settings to UI:", currentSettings);
}

// Initialize settings on page load
document.addEventListener("DOMContentLoaded", async () => {
  // Check localStorage for saved theme and apply immediately to avoid flash
  const savedTheme = localStorage.getItem(SETTINGS_KEYS.THEME);
  if (savedTheme) {
    document.body.className = ""; // Clear classes
    if (savedTheme !== "light") {
      document.body.classList.add(JSON.parse(savedTheme));
    }
  }

  // Fetch remaining settings from server and apply them
  const settings = await fetchSettings();
  applySettings();
});
