let searchBarVisible = true;

const searchBar = document.getElementById("search");
const toggleSearchButton = document.getElementById("toggle-search");

async function toggleSearchVisibility() {
  searchBarVisible = !searchBarVisible;
  searchBar.classList.toggle("hidden", !searchBarVisible);
  toggleSearchButton.textContent = searchBarVisible
    ? "Hide Search Bar"
    : "Show Search Bar";

  try {
    const settingsResponse = await fetch("/settings");
    if (!settingsResponse.ok) throw new Error("Failed to fetch current settings");

    const settings = await settingsResponse.json();
    const updatedSettings = { ...settings, hideSearch: !searchBarVisible };

    await fetch("/save-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedSettings),
    });
  } catch (error) {
    console.error("Error updating search visibility settings:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const settingsResponse = await fetch("/settings");
    if (!settingsResponse.ok) throw new Error("Failed to fetch settings");

    const settings = await settingsResponse.json();
    searchBarVisible =
      settings.hideSearch !== undefined ? !settings.hideSearch : true;

    searchBar.classList.toggle("hidden", !searchBarVisible);
    toggleSearchButton.textContent = searchBarVisible
      ? "Hide Search Bar"
      : "Show Search Bar";
  } catch (error) {
    console.error("Error loading search visibility settings:", error);
  }
});

toggleSearchButton.addEventListener("click", toggleSearchVisibility);

searchBar.addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase();

  const previousGroups = { ...groups };

  const filteredGroups = {};
  let hasResults = false;

  Object.keys(groups).forEach((groupName) => {
    const filteredDomains = groups[groupName]
      .map((domainId) => allDomains.find((domain) => domain.id === domainId))
      .filter((domain) => {
        if (!domain) return false;

        const matchesDomainName = domain.domain_names.some((name) =>
          name.toLowerCase().includes(query)
        );

        const hostPort = `${domain.forward_host}:${domain.forward_port}`;
        const matchesIP = hostPort.toLowerCase().includes(query);

        const status =
          domain.nginx_online && domain.enabled ? "online" : "offline";
        const matchesStatus = status.includes(query);

        return matchesDomainName || matchesIP || matchesStatus;
      });

    if (filteredDomains.length > 0) {
      filteredGroups[groupName] = filteredDomains.map((domain) => domain.id);
      hasResults = true;
    }
  });

  if (!hasResults) {
    document.getElementById("dashboard").innerHTML =
      "<p>No domains found.</p>";
  } else {
    groups = filteredGroups;
    renderDashboard();
  }

  groups = previousGroups;
});