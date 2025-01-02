document.getElementById("toggle-inactive").addEventListener("click", () => {
  showInactive = !showInactive;
  renderDashboard();

  document.getElementById("toggle-inactive").textContent = showInactive
    ? "Hide Inactive Domains"
    : "Show Inactive Domains";

  // Save the inactive toggle state
  saveSetting("hideInactive", !showInactive);
});
