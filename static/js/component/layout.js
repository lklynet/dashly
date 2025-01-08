let currentLayout = "list";

const layoutToggleButton = document.getElementById("toggle-layout");
const dashboard = document.getElementById("dashboard");

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

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const settings = await fetchSettings();
    currentLayout = settings.layoutView || currentLayout;
    applyLayout(currentLayout);
  } catch (error) {
    console.error("Error fetching layout settings:", error);
  }
});

layoutToggleButton.addEventListener("click", async () => {
  currentLayout = currentLayout === "list" ? "grid" : "list";
  applyLayout(currentLayout);

  try {
    await saveLayoutToJSON(currentLayout);
  } catch (error) {
    console.error("Error saving layout setting:", error);
  }
});

async function saveLayoutToJSON(layout) {
  try {
    await fetch("/save-settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ layoutView: layout }),
    });
  } catch (error) {
    throw new Error("Failed to save layout setting to JSON.");
  }
}

async function toggleMaxColumns() {
  maxColumns = maxColumns === 3 ? 1 : maxColumns + 1;

  const maxColumnsButton = document.getElementById("max-columns-toggle");
  maxColumnsButton.textContent = `Columns: ${maxColumns}`;

  try {
    await fetch("/save-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ maxColumns }),
    });
    renderDashboard();
  } catch (error) {
    console.error("Error updating max columns:", error);
  }
}

document.getElementById("max-columns-toggle")?.addEventListener("click", toggleMaxColumns);