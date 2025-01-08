document.addEventListener("DOMContentLoaded", async () => {
  try {
    await fetchDomainsOnRefresh();
  } catch (error) {
    console.error("Error during domain refresh:", error);
  }
});

async function fetchDomainsOnRefresh() {
  try {
    const response = await fetch("/domains");
    if (!response.ok) {
      throw new Error("Failed to fetch domains.");
    }

    const data = await response.json();

    const settingsResponse = await fetch("/settings");
    if (!settingsResponse.ok) {
      throw new Error("Failed to fetch current settings.");
    }

    const settings = await settingsResponse.json();
    groups = settings.groups || { "New Services": [] };
    allDomains = settings.allDomains || [];

    const defaultGroup = Object.keys(groups)[0] || "New Services";
    if (!groups[defaultGroup]) {
      groups[defaultGroup] = [];
    }

    data.allDomains.forEach((domain) => {
      const isExisting = allDomains.some((d) => d.id === domain.id);

      if (!isExisting) {
        allDomains.push(domain);
        groups[defaultGroup].push(domain.id);
      }
    });

    const sortBy = settings.sortBy || "domain";
    sortDomains(sortBy);

    await saveSettingsToJSON({ groups, allDomains });

    renderDashboard();
  } catch (error) {
    console.error("Error fetching domains on refresh:", error);
  }
}

async function saveSettingsToJSON(updatedSettings) {
  try {
    await fetch("/save-settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedSettings),
    });
  } catch (error) {
    console.error("Failed to save settings to JSON:", error);
  }
}

function determineGroupForDomain(domain) {
  return domain.enabled ? "Active Domains" : "Inactive Domains";
}