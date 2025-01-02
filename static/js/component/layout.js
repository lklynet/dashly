// Initialize layout view
let currentLayout = localStorage.getItem("layoutView")
  ? JSON.parse(localStorage.getItem("layoutView"))
  : "list"; // Default view

const layoutToggleButton = document.getElementById("toggle-layout");
const dashboard = document.getElementById("dashboard");

// Function to apply layout and update button text
function applyLayout(layout) {
  if (layout === "grid") {
    dashboard.classList.add("grid-view");
    dashboard.classList.remove("list-view");
    layoutToggleButton.textContent = "Switch to List View";
  } else {
    dashboard.classList.add("list-view");
    dashboard.classList.remove("grid-view");
    layoutToggleButton.textContent = "Switch to Grid View";
  }
}

// On page load, apply the saved or default layout
document.addEventListener("DOMContentLoaded", async () => {
  const settings = await fetchSettings(); // Fetch settings from usersettings.js
  currentLayout = settings.layoutView || currentLayout; // Use saved layout or fallback to default
  applyLayout(currentLayout); // Apply the layout
});

// Event listener for toggling the layout
layoutToggleButton.addEventListener("click", async () => {
  // Toggle layout
  currentLayout = currentLayout === "list" ? "grid" : "list";
  applyLayout(currentLayout);

  // Save the layout setting
  await saveSetting("layoutView", currentLayout);
});
