window.themes = ["light", "dark", "midnight", "terminal"];
const themeButton = document.getElementById("theme-toggle");

function applyTheme(theme) {
  document.body.className = "";
  if (theme !== "light") {
    document.body.classList.add(theme);
  }
  themeButton.textContent = theme[0].toUpperCase() + theme.slice(1);
  localStorage.setItem("theme", theme);
}

async function toggleTheme() {
  try {
    const currentThemeIndex = window.themes.indexOf(currentSettings.theme || "light");
    const newTheme = window.themes[(currentThemeIndex + 1) % window.themes.length];

    applyTheme(newTheme);

    await saveSettingsToJson({ theme: newTheme });
  } catch (error) {
    console.error("Error toggling theme:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    applyTheme(storedTheme);
  }

  try {
    currentSettings = await fetchSettings();
    const currentTheme = currentSettings.theme || "light";
    applyTheme(currentTheme);
  } catch (error) {
    console.error("Error loading theme settings:", error);
    if (!storedTheme) {
      applyTheme("light");
    }
  }
});

themeButton.addEventListener("click", toggleTheme);

async function fetchSettings() {
  try {
    const response = await fetch("/settings");
    if (!response.ok) throw new Error("Failed to fetch settings.");
    return await response.json();
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {};
  }
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