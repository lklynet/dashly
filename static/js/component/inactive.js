document.getElementById("toggle-inactive").addEventListener("click", async () => {
  showInactive = !showInactive;
  renderDashboard();

  document.getElementById("toggle-inactive").textContent = showInactive
    ? "Hide Inactive Domains"
    : "Show Inactive Domains";

  try {
    await saveInactiveStateToJSON(!showInactive);
  } catch (error) {
    console.error("Error saving inactive state:", error);
  }
});

async function saveInactiveStateToJSON(hideInactiveState) {
  try {
    await fetch("/save-settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hideInactive: hideInactiveState }),
    });
  } catch (error) {
    throw new Error("Failed to save inactive state to JSON.");
  }
}