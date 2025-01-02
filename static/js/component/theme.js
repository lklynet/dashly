// Centralize themes
window.themes = ["light", "dark", "midnight", "terminal"];
const themeButton = document.getElementById("theme-toggle");

// Function to switch theme
themeButton.addEventListener("click", async () => {
  const currentThemeIndex = window.themes.indexOf(
    currentSettings.theme || "light"
  );
  const newTheme =
    window.themes[(currentThemeIndex + 1) % window.themes.length];

  // Apply theme
  document.body.className = ""; // Clear existing classes
  if (newTheme !== "light") {
    document.body.classList.add(newTheme);
  }
  themeButton.textContent = newTheme[0].toUpperCase() + newTheme.slice(1);

  // Save theme setting
  await saveSetting("theme", newTheme);
});
